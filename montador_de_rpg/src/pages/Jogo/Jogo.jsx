import { useState, useEffect, createContext, useCallback, useMemo } from 'react';

import styles from './styles.Jogo.module.css';
import NavBarJogo from '../../Components/NavBar/navBarG.jsx';
import LateralPersonagem from '../../Components/Jogo/LateralPersonagem/LateralPersonagem.jsx';
import Mapa from '../../Components/Jogo/Mapa/Mapa.jsx';
import LateralHistorico from '../../Components/Jogo/LateralHistorico/LateralHistorico.jsx';
import AbaDados from '../../Components/Jogo/AbaDados/AbaDados.jsx';
import api from '../../utils/api';

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
   const handleResultadoFisico = useCallback(async (id, valor, faces) => {
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

      try {
         await api.post('/jogadas/rolar', { dado: label, resultado: valor });
      } catch (err) {
         console.error("Erro ao salvar jogada:", err);
      }

      // Remove o dado da tela após alguns segundos de contemplação do resultado
      setTimeout(() => {
         setDadosAtivosNaMesa(prev => prev.filter(d => d.id !== id));
      }, 5000);
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
      limparMesa, possuiDadosInterativos,
      onDadoParou: handleResultadoFisico,
   }), [dadosAtivosNaMesa, resultadosMesa, tipoRolamento, limparMesa, possuiDadosInterativos, handleResultadoFisico]);

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
                     </div>

                     <LateralHistorico roleAtiva={roleNaSessao} />
                  </div>
               </ContextoMesaFisica.Provider>
            </ContextoAbasPersonagem.Provider>
         </ContextoRegistros.Provider>
      </>
   );
}