import { useState, useEffect } from 'react';
import { campanhaService } from '../../services/campanhaService';
import styles from './SelecaoCampanha.module.css';

export default function SelecaoCampanha({ usuarioId, onConfirmar }) {
  const [campanhas, setCampanhas] = useState([]);
  const [selecionada, setSelecionada] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    if (!usuarioId) return;
    campanhaService
      .listarMinhas()
      .then((res) => setCampanhas(res?.data || res || []))
      .catch(() => setErro('Não foi possível carregar as campanhas.'))
      .finally(() => setCarregando(false));
  }, [usuarioId]);

  function handleConfirmar() {
    // passa a campanha selecionada ou null para "sem campanha"
    onConfirmar(selecionada ?? null);
  }

  if (carregando) {
    return (
      <div className={styles.centrado}>
        <div className={styles.spinner} />
        <p>Carregando campanhas...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.brasao}>⚔</div>
        <h1 className={styles.titulo}>Forja do Cavaleiro</h1>
        <p className={styles.subtitulo}>
          Escolha uma campanha ou crie o personagem livremente
        </p>
      </header>

      {erro && <p className={styles.erro}>{erro}</p>}

      <section className={styles.secao}>
        <h2 className={styles.secaoTitulo}>
          <span className={styles.secaoNum}>I</span> Campanha
        </h2>

        <div className={styles.grade}>
          {/* opção de não vincular campanha */}
          <button
            className={`${styles.card} ${selecionada === null ? styles.cardAtivo : ''}`}
            onClick={() => setSelecionada(null)}
          >
            <span className={styles.cardNome}>Sem campanha</span>
            <span className={styles.cardDesc}>
              Escolha o sistema manualmente
            </span>
          </button>

          {campanhas.map((c) => (
            <button
              key={c.id}
              className={`${styles.card} ${selecionada?.id === c.id ? styles.cardAtivo : ''}`}
              onClick={() => setSelecionada(c)}
            >
              <span className={styles.cardNome}>{c.nome}</span>
              {c.sistemaNome && (
                <span className={styles.cardSistema}>{c.sistemaNome}</span>
              )}
              <span className={`${styles.cardStatus} ${styles[c.status?.toLowerCase()]}`}>
                {c.status}
              </span>
            </button>
          ))}
        </div>
      </section>

      <div className={styles.rodape}>
        <button
          className={styles.botaoCriar}
          // sempre habilitado — "sem campanha" é uma escolha válida
          onClick={handleConfirmar}
        >
          Continuar
          <span className={styles.setaBotao}>→</span>
        </button>
      </div>
    </div>
  );
}