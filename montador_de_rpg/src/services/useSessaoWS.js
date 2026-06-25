import { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';

export function useSessaoWS(idSessao, callbacks) {
  const [conectado, setConectado] = useState(false);
  const [usuariosOnline, setUsuariosOnline] = useState([]);
  const clientRef = useRef(null);

  useEffect(() => {
    if (!idSessao) return;

    // Recupera o token JWT salvo no seu login para autenticação
    const token = localStorage.getItem('token'); 

    // IMPORTANTE: Altere http/https para ws/wss da URL do seu backend do Railway
    const WS_URL = 'wss://montadorderpgbackend-production.up.railway.app/ws'; 
    // Se testar localmente, use: 'ws://localhost:8080/ws'

    const client = new Client({
      brokerURL: WS_URL,
      connectHeaders: {
        Authorization: `Bearer ${token}` // Envia o JWT para o Spring preencher o Principal
      },
      debug: (str) => {
        console.log('WS Debug:', str);
      },
      reconnectDelay: 5000, // Tenta reconectar a cada 5 segundos se cair
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      setConectado(true);
      console.log('Conectado ao WebSocket do RPG!');

      // 1. Escuta canal geral da sessão (Ações completas e Movimentação)
      client.subscribe(`/topic/sessao/${idSessao}`, (message) => {
        const dados = JSON.parse(message.body);
        
        if (dados.tipo === 'MOVIMENTO') {
          callbacks.onMovimento?.(dados);
        } else {
          callbacks.onAcaoResultado?.(dados);
        }
      });

      // 2. Escuta atualizações de status/fases (Entradas paralelas / Mitos de Bastionland)
      client.subscribe(`/topic/sessao/${idSessao}/status`, (message) => {
        callbacks.onStatusFase?.(JSON.parse(message.body));
      });

      // 3. Escuta a fila privada do próprio jogador (Retorno das declarações dele)
      client.subscribe(`/user/queue/sessao/${idSessao}`, (message) => {
        callbacks.onDeclaracaoPrivada?.(JSON.parse(message.body));
      });

      // 4. Escuta o Chat da sessão
      client.subscribe(`/topic/sessao/${idSessao}/chat`, (message) => {
        callbacks.onNovaMensagem?.(JSON.parse(message.body));
      });

      // 5. Escuta a lista global de presença de usuários
      client.subscribe('/topic/usuarios', (message) => {
        const dados = JSON.parse(message.body);
        setUsuariosOnline(dados.online || []);
      });
    };

    client.onDisconnect = () => {
      setConectado(false);
      console.log('Desconectado do WebSocket');
    };

    client.activate();
    clientRef.current = client;

    // Cleanup: desconecta automaticamente quando o usuário sai do mapa/página
    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [idSessao]);

  // --- MÉTODOS DE DISPARO (SEND) ---

  const enviarMensagem = (conteudo) => {
    if (clientRef.current?.connected) {
      clientRef.current.publish({
        destination: `/app/sessao/${idSessao}/chat`,
        body: JSON.stringify({ content: conteudo }),
      });
    }
  };

  const moverToken = (x, y) => {
    if (clientRef.current?.connected) {
      clientRef.current.publish({
        destination: `/app/sessao/${idSessao}/mover`,
        body: JSON.stringify({ x, y }),
      });
    }
  };

  const enviarAcao = (payload) => {
    if (clientRef.current?.connected) {
      clientRef.current.publish({
        destination: `/app/sessao/${idSessao}/acao`,
        body: JSON.stringify(payload), // Ex: { acao_escolhida: "ATACAR", id_alvo: 42 }
      });
    }
  };

  const declararAcao = (payload) => {
    if (clientRef.current?.connected) {
      clientRef.current.publish({
        destination: `/app/sessao/${idSessao}/declarar`,
        body: JSON.stringify(payload),
      });
    }
  };

  return {
    conectado,
    usuariosOnline,
    enviarMensagem,
    moverToken,
    enviarAcao,
    declararAcao
  };
}