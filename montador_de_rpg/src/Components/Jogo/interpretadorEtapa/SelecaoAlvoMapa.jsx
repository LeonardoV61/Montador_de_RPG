import { useContext } from 'react';
import { ContextoAvatar } from '../Mapa/Mapa';

export default function SelecaoAlvoMapa({ etapa, onResponder, carregando }) {
  const { avatarSelecionado } = useContext(ContextoAvatar);
  const prompt = etapa?.parametrosEtapa?.campoPedido || 'Selecione um alvo no mapa';

  function confirmar() {
    if (avatarSelecionado) {
      onResponder(avatarSelecionado.idInstancia); // envia o ID da instância
    }
  }

  return (
    <div style={{ position: 'absolute', bottom: 20, left: 20, zIndex: 100, background: '#1a1a1a', padding: 12, borderRadius: 8 }}>
      <p>{prompt}</p>
      <button onClick={confirmar} disabled={!avatarSelecionado || carregando}>
        Confirmar Alvo
      </button>
    </div>
  );
}