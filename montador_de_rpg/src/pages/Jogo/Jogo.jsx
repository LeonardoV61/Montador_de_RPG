import { useState, useEffect, createContext, useCallback, useMemo, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import styles from './styles.Jogo.module.css';
import NavBarJogo from '../../Components/NavBar/navBarG.jsx';
import LateralPersonagem from '../../Components/Jogo/LateralPersonagem/LateralPersonagem.jsx';
import Mapa from '../../Components/Jogo/Mapa/Mapa.jsx';
import LateralHistorico from '../../Components/Jogo/LateralHistorico/LateralHistorico.jsx';
import AbaDados from '../../Components/Jogo/AbaDados/AbaDados.jsx';
import { Dices, CircleDollarSign } from 'lucide-react';

export const ContextoRegistros     = createContext(null);
export const ContextoAbasPersonagem = createContext(null);
export const ContextoMesaFisica    = createContext(null);
export const ContextoParticipantes = createContext(null); // ← novo

export default function Jogo() {
  const roleNaSessao = localStorage.getItem('role_sessao_ativa') || 'jogador';

  useEffect(() => {
    if (roleNaSessao !== null) localStorage.removeItem('role_sessao_ativa');
  }, [roleNaSessao]);

  const [registros, setRegistros] = useState([
    { id: 1, aba: 'Chat', autor: 'Mestre', horario: '20:03', texto: 'A estrada de terra leva por colinas cobertas de névoa...' },
    { id: 3, aba: 'Roll', icone: <Dices />, autor: 'Aldric', tipo: 'Força', valor: 17, dado: 'd20', valorAtributo: 14 },
  ]);

  const [abasAbertas, setAbasAbertas] = useState({});
  const definirAbaAberta = useCallback((id, aberto) => {
    if (!id) return;
    setAbasAbertas(prev => ({ ...prev, [id]: aberto }));
  }, []);

  const [dadosAtivosNaMesa, setDadosAtivosNaMesa] = useState([]);
  const [resultadosMesa, setResultadosMesa]       = useState({});
  const [tipoRolamento, setTipoRolamento]         = useState('Selecione seus dados');

  const possuiDadosInterativos = useMemo(
    () => dadosAtivosNaMesa.some(d => !d.lancado),
    [dadosAtivosNaMesa]
  );

  const handleResultadoFisico = useCallback(async (id, valor, faces) => {
    const label = faces === 2 ? 'Moeda' : `d${faces}`;
    setResultadosMesa(prev => ({ ...prev, [id]: { valor, label } }));
    setDadosAtivosNaMesa(prev => prev.map(d => d.id === id ? { ...d, lancado: true } : d));
    setRegistros(prev => [...prev, {
      id: Date.now() + Math.random(), aba: 'Roll',
      icone: faces === 2 ? '🪙' : '🎲', autor: 'Você',
      tipo: 'Mesa Física', valor, dado: label, valorAtributo: false,
    }]);
    setTimeout(() => setDadosAtivosNaMesa(prev => prev.filter(d => d.id !== id)), 5000);
  }, []);

  const limparMesa = useCallback(() => {
    setDadosAtivosNaMesa([]);
    setResultadosMesa({});
    setTipoRolamento('Selecione seus dados');
  }, []);

  // ── Sessão, cena e participantes ──
  const idSessao = localStorage.getItem('idSessaoAtiva');
  const [participantes, setParticipantes] = useState([]);
  const stompRef = useRef(null);

  // Carrega participantes da cena ativa
  useEffect(() => {
    if (!idSessao) return;
    (async () => {
      try {
        const token = localStorage.getItem('token');
        const res   = await fetch(`/api/sessoes/${idSessao}/cena`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setParticipantes(data.participantes || []);
      } catch (e) {
        console.error('Erro ao carregar cena', e);
      }
    })();
  }, [idSessao]);

  // WebSocket — escuta movimentações e atualiza posição dos tokens
  useEffect(() => {
    if (!idSessao) return;
    const client = new Client({
      brokerURL: `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/ws`,
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
    return () => client.deactivate();
  }, [idSessao]);

  const valorContextoAbasPersonagem = useMemo(
    () => ({ abasAbertas, definirAbaAberta }),
    [abasAbertas, definirAbaAberta]
  );
  const valorContextoMesa = useMemo(() => ({
    dadosAtivosNaMesa, setDadosAtivosNaMesa,
    resultadosMesa, tipoRolamento, setTipoRolamento,
    limparMesa, possuiDadosInterativos, onDadoParou: handleResultadoFisico,
  }), [dadosAtivosNaMesa, resultadosMesa, tipoRolamento, limparMesa, possuiDadosInterativos, handleResultadoFisico]);

  const valorContextoParticipantes = useMemo(
    () => ({ participantes, setParticipantes, idSessao, stompRef }),
    [participantes, idSessao]
  );

  return (
    <>
      <NavBarJogo roleAtiva={roleNaSessao} />
      <ContextoRegistros.Provider value={{ registros, setRegistros }}>
        <ContextoAbasPersonagem.Provider value={valorContextoAbasPersonagem}>
          <ContextoMesaFisica.Provider value={valorContextoMesa}>
            <ContextoParticipantes.Provider value={valorContextoParticipantes}>
              <div className={styles.jogo}>
                <LateralPersonagem />
                <div style={{ flex: 1, position: 'relative', height: '100%', overflow: 'hidden' }}>
                  <Mapa />
                </div>
                <LateralHistorico roleAtiva={roleNaSessao} />
              </div>
            </ContextoParticipantes.Provider>
          </ContextoMesaFisica.Provider>
        </ContextoAbasPersonagem.Provider>
      </ContextoRegistros.Provider>
    </>
  );
}