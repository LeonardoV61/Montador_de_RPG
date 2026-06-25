import { useState, useEffect } from 'react';
import { campanhaService } from '../../services/campanhaService';
import styles from './SelecaoCampanha.module.css';

export default function SelecaoCampanha({ usuarioId, onConfirmar }) {
  const [campanhas, setCampanhas] = useState([]);
  const [selecionada, setSelecionada] = useState(null);
  const [criarNova, setCriarNova] = useState(false);
  const [nomeNova, setNomeNova] = useState('');

  useEffect(() => {
    if (!usuarioId) return;
    campanhaService.listarPorUsuario(usuarioId)
      .then(res => setCampanhas(res?.data || res || []))
      .catch(console.error);
  }, [usuarioId]);

  function confirmar() {
    if (criarNova && nomeNova.trim()) {
      // criar campanha via API e passar o ID
      campanhaService.criar({ nome: nomeNova, sistemaId: null /* opcional */ })
        .then(res => onConfirmar(res.id))
        .catch(console.error);
    } else if (selecionada) {
      onConfirmar(selecionada);
    }
  }

  return (
    <div className={styles.container}>
      <h2>Escolha a Campanha</h2>
      <div className={styles.lista}>
        {campanhas.map(c => (
          <button
            key={c.id}
            className={`${styles.card} ${selecionada === c.id ? styles.ativo : ''}`}
            onClick={() => { setSelecionada(c.id); setCriarNova(false); }}
          >
            {c.nome}
          </button>
        ))}
      </div>
      <div className={styles.nova}>
        <label>
          <input type="checkbox" checked={criarNova} onChange={e => setCriarNova(e.target.checked)} />
          Criar nova campanha
        </label>
        {criarNova && (
          <input
            type="text"
            placeholder="Nome da nova campanha"
            value={nomeNova}
            onChange={e => setNomeNova(e.target.value)}
          />
        )}
      </div>
      <button className={styles.btnIniciar} onClick={confirmar} disabled={!criarNova && !selecionada}>
        Iniciar Criação
      </button>
    </div>
  );
}