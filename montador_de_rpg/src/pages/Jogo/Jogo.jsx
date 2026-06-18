import { useState, useEffect, createContext, useCallback, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import * as THREE from 'three';

import styles from './styles.Jogo.module.css';
import NavBarJogo from '../../Components/NavBar/navBarG.jsx';
import LateralPersonagem from '../../Components/Jogo/LateralPersonagem/LateralPersonagem.jsx';
import Mapa from '../../Components/Jogo/Mapa/Mapa.jsx';
import LateralHistorico from '../../Components/Jogo/LateralHistorico/LateralHistorico.jsx';

import { ChaoMesa, DadoFisicoPoliedro, MoedaFisica } from '../../Components/Jogo/AbaDados/MesaFisica.jsx';
import AbaDados from '../../Components/Jogo/AbaDados/AbaDados.jsx';

export const ContextoRegistros = createContext(null);
export const ContextoAbasPersonagem = createContext(null); 
export const ContextoMesaFisica = createContext(null);

export default function Jogo() {
   const roleNaSessao = localStorage.getItem("role_sessao_ativa") || "jogador";
   
   useEffect(() => {
      if (roleNaSessao !== null) {
         localStorage.removeItem("role_sessao_ativa");
      }
   }, [roleNaSessao]);
   
   const [registros, setRegistros] = useState([
      { "id": 1, "aba": "Chat", "autor": "Mestre", "horario": "20:03", "texto": "A estrada de terra leva por colinas cobertas de névoa..." },
      { "id": 3, "aba": "Roll", "icone": "🎲", "autor": "Aldric", "tipo": "Força", "valor": 17, "dado": "d20", "valorAtributo": 14 }
   ]);

   const [abasAbertas, setAbasAbertas] = useState({});
   const definirAbaAberta = useCallback((id, aberto) => {
      if (!id) return;
      setAbasAbertas(prev => ({ ...prev, [id]: aberto }));
   }, []);

   // Structural Fix: Keep track of state transitions per die
   const [dadosAtivosNaMesa, setDadosAtivosNaMesa] = useState([]);
   const [resultadosMesa, setResultadosMesa] = useState({}); 
   const [tipoRolamento, setTipoRolamento] = useState("Selecione seus dados");

   // Check if any dice are currently awaiting placement/throwing
   const possuiDadosInterativos = useMemo(() => {
      return dadosAtivosNaMesa.some(dado => !dado.lancado);
   }, [dadosAtivosNaMesa]);

   // Structural Fix: Aggregate results instead of overwriting them
   const handleResultadoFisico = useCallback((id, valor, faces) => {
      const label = faces === 2 ? "Moeda" : `d${faces}`;
      
      setResultadosMesa(prev => ({
         ...prev,
         [id]: { valor, label, icone: faces === 2 ? "🪙" : "🎲" }
      }));

      setDadosAtivosNaMesa(prev => 
         prev.map(dado => dado.id === id ? { ...dado, lancado: true } : dado)
      );

      setRegistros(prev => [
         ...prev,
         {
            id: Date.now() + Math.random(),
            aba: "Roll",
            icone: faces === 2 ? "🪙" : "🎲",
            autor: "Você",
            tipo: "Mesa Física",
            valor: valor,
            dado: label,
            valorAtributo: false
         }
      ]);
   }, []);

   const limparMesa = useCallback(() => {
      setDadosAtivosNaMesa([]);
      setResultadosMesa({});
      setTipoRolamento("Selecione seus dados");
   }, []);

   const valorContextoRegistros = useMemo(() => ({ registros, setRegistros }), [registros]);
   const valorContextoAbasPersonagem = useMemo(() => ({ abasAbertas, definirAbaAberta }), [abasAbertas, definirAbaAberta]);
   
   const valorContextoMesa = useMemo(() => ({
      dadosAtivosNaMesa, setDadosAtivosNaMesa,
      resultadosMesa, tipoRolamento, setTipoRolamento,
      limparMesa
   }), [dadosAtivosNaMesa, resultadosMesa, tipoRolamento, limparMesa]);

   return (
      <>
         <NavBarJogo roleAtiva={roleNaSessao}/>
         <ContextoRegistros.Provider value={valorContextoRegistros}>
            <ContextoAbasPersonagem.Provider value={valorContextoAbasPersonagem}>
               <ContextoMesaFisica.Provider value={valorContextoMesa}>
                  <div className={styles.jogo}>
                     <LateralPersonagem />
                     
                     <div style={{ flex: 1, position: 'relative', height: '100%' }}>
                        <Mapa />
                        
                        {/* Fix 3: Dynamic Pointer Events Layer */}
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }}>
                           <div style={{ pointerEvents: possuiDadosInterativos ? 'auto' : 'none', width: '100%', height: '100%' }}>
                              <Canvas
                                 shadows
                                 gl={{ shadowMapType: THREE.PCFShadowMap, antialias: true }}
                                 camera={{ position: [0, 6.5, 4.5], fov: 45 }}
                                 style={{ pointerEvents: possuiDadosInterativos ? 'auto' : 'none' }}
                              >
                                 <ambientLight intensity={0.5} />
                                 <directionalLight position={[4, 8, 4]} intensity={1.3} castShadow />
                                 <Physics gravity={[0, -9.81, 0]} tolerance={0.002}>
                                    <ChaoMesa />
                                    {dadosAtivosNaMesa.map((dado) => dado.lados === 2 ? (
                                       <MoedaFisica key={dado.id} id={dado.id} position={dado.posicao} onStopped={handleResultadoFisico} />
                                    ) : (
                                       <DadoFisicoPoliedro key={dado.id} id={dado.id} lados={dado.lados} position={dado.posicao} onStopped={handleResultadoFisico} />
                                    ))}
                                 </Physics>
                              </Canvas>
                           </div>
                        </div>
                     </div>

                     <LateralHistorico roleAtiva={roleNaSessao} />
                  </div>
               </ContextoMesaFisica.Provider>
            </ContextoAbasPersonagem.Provider>
         </ContextoRegistros.Provider>
      </>
   );
}