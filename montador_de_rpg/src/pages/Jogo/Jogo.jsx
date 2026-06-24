import { useState, useEffect, createContext, useCallback, useMemo, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import * as THREE from 'three';
import { Client } from '@stomp/stompjs';   // WebSocket

import styles from './styles.Jogo.module.css';
import NavBarJogo from '../../Components/NavBar/navBarG.jsx';
import LateralPersonagem from '../../Components/Jogo/LateralPersonagem/LateralPersonagem.jsx';
import Mapa from '../../Components/Jogo/Mapa/Mapa.jsx';
import LateralHistorico from '../../Components/Jogo/LateralHistorico/LateralHistorico.jsx';
import { ChaoMesa, DadoFisicoPoliedro, MoedaFisica } from '../../Components/Jogo/AbaDados/MesaFisica.jsx';

export const ContextoRegistros = createContext(null);
export const ContextoAbasPersonagem = createContext(null);
export const ContextoMesaFisica = createContext(null);

export default function Jogo() {
  const roleNaSessao = localStorage.getItem('role_sessao_ativa') || 'jogador';

  useEffect(() => {
    if (roleNaSessao !== null) localStorage.removeItem('role_sessao_ativa');
  }, [roleNaSessao]);

  // ── Registros (chat, rolagens) ──
  const [registros, setRegistros] = useState([
    { id: 1, aba: 'Chat', autor: 'Mestre', horario: '20:03', texto: 'A estrada de terra leva por colinas cobertas de névoa...' },
    { id: 3, aba: 'Roll', icone: '🎲', autor: 'Aldric', tipo: 'Força', valor: 17, dado: 'd20', valorAtributo: 14 },
  ]);

  // ── Abas da lateral ──
  const [abasAbertas, setAbasAbertas] = useState({});
  const definirAbaAberta = useCallback((id, aberto) => {
    if (!id) return;
    setAbasAbertas(prev => ({ ...prev, [id]: aberto }));
  }, []);

  // ── Mesa física (dados 3D) ──
  const [dadosAtivosNaMesa, setDadosAtivosNaMesa] = useState([]);
  const [resultadosMesa, setResultadosMesa] = useState({});
  const [tipoRolamento, setTipoRolamento] = useState('Selecione seus dados');

  const possuiDadosInterativos = useMemo(() => dadosAtivosNaMesa.some(d => !d.lancado), [dadosAtivosNaMesa]);

  const handleResultadoFisico = useCallback((id, valor, faces) => {
    const label = faces === 2 ? 'Moeda' : `d${faces}`;
    setResultadosMesa(prev => ({ ...prev, [id]: { valor, label, icone: faces === 2 ? '🪙' : '🎲' } }));
    setDadosAtivosNaMesa(prev => prev.map(d => (d.id === id ? { ...d, lancado: true } : d)));
    setRegistros(prev => [...prev, {
      id: Date.now() + Math.random(),
      aba: 'Roll', icone: faces === 2 ? '🪙' : '🎲', autor: 'Você',
      tipo: 'Mesa Física', valor, dado: label, valorAtributo: false,
    }]);
  }, []);

  const limparMesa = useCallback(() => {
    setDadosAtivosNaMesa([]);
    setResultadosMesa({});
    setTipoRolamento('Selecione seus dados');
  }, []);

  // ── Cena e participantes ──
  const idSessao = localStorage.getItem('idSessaoAtiva');
  const [cena, setCena] = useState(null);
  const [mapaData, setMapaData] = useState(null);
  const [participantes, setParticipantes] = useState([]);
  const stompRef = useRef(null);

  // Carrega a cena ativa
  useEffect(() => {
    if (!idSessao) return;
    (async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/sessoes/${idSessao}/cena`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setCena(data);
        setMapaData(data.mapaJson);
        setParticipantes(data.participantes || []);
      } catch (e) {
        console.error('Erro ao carregar cena', e);
      }
    })();
  }, [idSessao]);

  // ebSocket –> escuta movimentações
  useEffect(() => {
    if (!idSessao) return;
    const client = new Client({
      brokerURL: 'ws://localhost:8080/ws',  // ajuste a URL conforme seu servidor
      connectHeaders: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      onConnect: () => {
        client.subscribe(`/topic/sessao/${idSessao}/cena`, msg => {
          const body = JSON.parse(msg.body);
          if (body.tipo === 'MOVIMENTO') {
            setParticipantes(prev =>
              prev.map(p =>
                p.idInstancia === body.idInstancia
                  ? { ...p, posicao: { x: body.x, y: body.y } }
                  : p
              )
            );
          }
        });
      },
    });
    client.activate();
    stompRef.current = client;
    return () => { client.deactivate(); };
  }, [idSessao]);

  // Valores dos contextos
  const valorContextoRegistros = useMemo(() => ({ registros, setRegistros }), [registros]);
  const valorContextoAbasPersonagem = useMemo(() => ({ abasAbertas, definirAbaAberta }), [abasAbertas, definirAbaAberta]);
  const valorContextoMesa = useMemo(() => ({
    dadosAtivosNaMesa, setDadosAtivosNaMesa,
    resultadosMesa, tipoRolamento, setTipoRolamento, limparMesa,
  }), [dadosAtivosNaMesa, resultadosMesa, tipoRolamento, limparMesa]);

  return (
    <>
      <NavBarJogo roleAtiva={roleNaSessao} />
      <ContextoRegistros.Provider value={valorContextoRegistros}>
        <ContextoAbasPersonagem.Provider value={valorContextoAbasPersonagem}>
          <ContextoMesaFisica.Provider value={valorContextoMesa}>
            <div className={styles.jogo}>
              <LateralPersonagem />

              <div style={{ flex: 1, position: 'relative', height: '100%' }}>
                <Mapa mapaData={mapaData} participantes={participantes} />

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
                        {dadosAtivosNaMesa.map(dado =>
                          dado.lados === 2 ? (
                            <MoedaFisica key={dado.id} id={dado.id} position={dado.posicao} onStopped={handleResultadoFisico} />
                          ) : (
                            <DadoFisicoPoliedro key={dado.id} id={dado.id} lados={dado.lados} position={dado.posicao} onStopped={handleResultadoFisico} />
                          )
                        )}
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