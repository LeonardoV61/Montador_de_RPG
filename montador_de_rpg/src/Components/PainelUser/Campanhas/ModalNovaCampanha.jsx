// Components/PainelUser/Campanhas/ModalNovaCampanha.jsx
import { useState } from 'react';
import { campanhaService } from '../../../services/campanhaService';
import styles from './ModalNovaCampanha.module.css';

export default function ModalNovaCampanha({ usuarioId, onClose, onCriada }) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [sistemaId, setSistemaId] = useState(1); // ou buscar sistemas disponíveis
  const [carregando, setCarregando] = useState(false);

  async function handleCriar() {
    if (!nome.trim()) return;
    setCarregando(true);
    try {
      const resp = await campanhaService.criar({
        nome: nome.trim(),
        descricao,
        sistemaId,
        criadorId: usuarioId,
      });
      onCriada?.(resp.data || resp);
      onClose();
    } catch (e) {
      console.error('Erro ao criar campanha', e);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Nova Campanha</h2>
        <label>Nome</label>
        <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome da campanha" />
        <label>Descrição</label>
        <textarea value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Breve descrição" />
        <div className={styles.acoes}>
          <button onClick={onClose} disabled={carregando}>Cancelar</button>
          <button onClick={handleCriar} disabled={!nome.trim() || carregando}>
            {carregando ? 'Criando...' : 'Criar'}
          </button>
        </div>
      </div>
    </div>
  );
}