// Components/PainelUser/Campanhas/ModalNovaCena.jsx
import { useState } from 'react';
import { cenaService } from '../../../services/cenaService';
import styles from './ModalNovaCena.module.css';

export default function ModalNovaCena({ sessaoId, onClose, onCriada }) {
  const [tipo, setTipo] = useState('EXPLORACAO');
  const [ordem, setOrdem] = useState(1);
  const [urlMapa, setUrlMapa] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleCriar() {
    setCarregando(true);
    try {
      const resp = await cenaService.criar({
        sessaoId,
        tipo,
        ordem,
        urlMapa: urlMapa || null,
        mapaJson: null, // pode ser gerado depois
      });
      onCriada?.(resp.data || resp);
      onClose();
    } catch (e) {
      console.error('Erro ao criar cena', e);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Nova Cena</h2>
        <label>Tipo</label>
        <select value={tipo} onChange={e => setTipo(e.target.value)}>
          <option value="EXPLORACAO">Exploração</option>
          <option value="COMBATE">Combate</option>
          <option value="SOCIAL">Social</option>
          <option value="NARRATIVA">Narrativa</option>
        </select>
        <label>Ordem</label>
        <input type="number" value={ordem} onChange={e => setOrdem(Number(e.target.value))} min={1} />
        <label>URL do Mapa (opcional)</label>
        <input value={urlMapa} onChange={e => setUrlMapa(e.target.value)} placeholder="https://..." />
        <div className={styles.acoes}>
          <button onClick={onClose} disabled={carregando}>Cancelar</button>
          <button onClick={handleCriar} disabled={carregando}>
            {carregando ? 'Criando...' : 'Criar'}
          </button>
        </div>
      </div>
    </div>
  );
}