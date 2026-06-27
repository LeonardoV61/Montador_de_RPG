// Components/PainelUser/Campanhas/ModalNovaCampanha.jsx
import { useState, useEffect } from 'react';
import { campanhaService } from '../../../services/campanhaService';
import { sistemaService } from '../../../services/sistemaService';
import styles from './ModalNovaCampanha.module.css';

export default function ModalNovaCampanha({ usuarioId, onClose, onCriada }) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [sistemaId, setSistemaId] = useState(null);
  const [sistemas, setSistemas] = useState([]);
  const [carregandoSistemas, setCarregandoSistemas] = useState(true);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    sistemaService
      .listarTodos()
      .then((res) => {
        const lista = res?.data || res || [];
        setSistemas(lista);
        // pré-seleciona o primeiro da lista se houver
        if (lista.length > 0) setSistemaId(lista[0].id);
      })
      .catch(() => setErro('Não foi possível carregar os sistemas.'))
      .finally(() => setCarregandoSistemas(false));
  }, []);

  async function handleCriar() {
    if (!nome.trim() || !sistemaId) return;
    setCarregando(true);
    setErro(null);
    try {
      const resp = await campanhaService.criar({
        nome: nome.trim(),
        descricao,
        sistemaId,
        criadorId: usuarioId,
      });
      onCriada?.(resp.data || resp);
      onClose();
    } catch {
      setErro('Erro ao criar campanha. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Nova Campanha</h2>

        <label>Nome</label>
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome da campanha"
        />

        <label>Descrição</label>
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Breve descrição"
        />

        <label>Sistema</label>
        {carregandoSistemas ? (
          <p className={styles.carregando}>Carregando sistemas...</p>
        ) : sistemas.length === 0 ? (
          <p className={styles.vazio}>Nenhum sistema disponível.</p>
        ) : (
          <select
            value={sistemaId ?? ''}
            onChange={(e) => setSistemaId(Number(e.target.value))}
          >
            {sistemas.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nome}{s.eOficial ? ' ✦' : ''}
              </option>
            ))}
          </select>
        )}

        {erro && <p className={styles.erro}>{erro}</p>}

        <div className={styles.acoes}>
          <button onClick={onClose} disabled={carregando}>
            Cancelar
          </button>
          <button
            onClick={handleCriar}
            disabled={!nome.trim() || !sistemaId || carregandoSistemas || carregando}
          >
            {carregando ? 'Criando...' : 'Criar'}
          </button>
        </div>
      </div>
    </div>
  );
}