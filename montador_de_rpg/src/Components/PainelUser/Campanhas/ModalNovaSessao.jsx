// Components/PainelUser/Campanhas/ModalNovaSessao.jsx
import { useState } from 'react';
import { sessaoService } from '../../../services/sessaoService';
import styles from './ModalNovaSessao.module.css';

export default function ModalNovaSessao({ campanhaId, onClose, onCriada }) {
  const [dataInicio, setDataInicio] = useState('');
  const [ordem, setOrdem] = useState(1);
  const [carregando, setCarregando] = useState(false);

  async function handleIniciar() {
    setCarregando(true);
    try {
      const resp = await sessaoService.iniciar(campanhaId, {
        dataInicio: dataInicio || new Date().toISOString(),
        ordem,
      });
      onCriada?.(resp.data || resp);
      onClose();
    } catch (e) {
      console.error('Erro ao iniciar sessão', e);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Iniciar Sessão</h2>
        <label>Data de início</label>
        <input type="datetime-local" value={dataInicio} onChange={e => setDataInicio(e.target.value)} />
        <label>Ordem (número da sessão)</label>
        <input type="number" value={ordem} onChange={e => setOrdem(Number(e.target.value))} min={1} />
        <div className={styles.acoes}>
          <button onClick={onClose} disabled={carregando}>Cancelar</button>
          <button onClick={handleIniciar} disabled={carregando}>
            {carregando ? 'Iniciando...' : 'Iniciar'}
          </button>
        </div>
      </div>
    </div>
  );
}