import { useState, useEffect, createContext, useCallback, useMemo, useRef } from 'react';
import { Client } from '@stomp/stompjs';   // WebSocket

import styles from './styles.Jogo.module.css';
import NavBarJogo from '../../Components/NavBar/navBarG.jsx';
import LateralPersonagem from '../../Components/Jogo/LateralPersonagem/LateralPersonagem.jsx';
import Mapa from '../../Components/Jogo/Mapa/Mapa.jsx';
import LateralHistorico from '../../Components/Jogo/LateralHistorico/LateralHistorico.jsx';
import AbaDados from '../../Components/Jogo/AbaDados/AbaDados.jsx';
import api from '../../utils/api';
import { Dices, CircleDollarSign } from 'lucide-react';

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
    { id: 3, aba: 'Roll', icone: <Dices />, autor: 'Aldric', tipo: 'Força', valor: 17, dado: 'd20', valorAtributo: 14 },
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

   const possuiDadosInterativos = useMemo(() => {
      return dadosAtivosNaMesa.some(dado => !dado.lancado);
   }, [dadosAtivosNaMesa]);

   const handleResultadoFisico = useCallback(async (id, valor, faces) => {
      const label = faces === 2 ? "Moeda" : `d${faces}`;
      
      setResultadosMesa(prev => ({
         ...prev,
         [id]: { valor, label, icone: faces === 2 ? <CircleDollarSign /> : <Dices /> }
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

      // try {
      //    await api.post('/jogadas/rolar', { dado: label, resultado: valor });
      // } catch (err) {
      //    console.error("Erro ao salvar jogada:", err);
      // }

      setTimeout(() => {
         setDadosAtivosNaMesa(prev => prev.filter(d => d.id !== id));
      }, 5000);
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
  /* const valorContextoRegistros = useMemo(() => ({ registros, setRegistros }), [registros]); */
  const valorContextoAbasPersonagem = useMemo(() => ({ abasAbertas, definirAbaAberta }), [abasAbertas, definirAbaAberta]);
  const valorContextoMesa = useMemo(() => ({
    dadosAtivosNaMesa, setDadosAtivosNaMesa,
    resultadosMesa, tipoRolamento, setTipoRolamento, limparMesa, possuiDadosInterativos,
      onDadoParou: handleResultadoFisico,
  }), [dadosAtivosNaMesa, resultadosMesa, tipoRolamento, limparMesa, possuiDadosInterativos, handleResultadoFisico]);

   return (
      <>
         <NavBarJogo roleAtiva={roleNaSessao}/>
         <ContextoRegistros.Provider value={{ registros, setRegistros }}>
            <ContextoAbasPersonagem.Provider value={valorContextoAbasPersonagem}>
               <ContextoMesaFisica.Provider value={valorContextoMesa}>
                  <div className={styles.jogo}>
                     <LateralPersonagem />
                     
                     {/* FIX: Ajustado overflow e posicionamento para não quebrar o layout da Navbar */}
                     <div style={{ flex: 1, position: 'relative', height: '100%', overflow: 'hidden' }}>
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
