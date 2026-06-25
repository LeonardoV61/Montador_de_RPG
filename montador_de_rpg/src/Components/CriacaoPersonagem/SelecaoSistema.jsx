import { useState, useEffect } from 'react';
import { sistemaService } from '../../services/sistemaService.js';
import styles from './SelecaoSistema.module.css';

export default function SelecaoSistema({ onConfirmar }) {
  const [sistemas, setSistemas] = useState([]);
  const [sistemaSelecionado, setSistemaSelecionado] = useState(null);
  const [nomePersonagem, setNomePersonagem] = useState('');
  const [carregandoSistemas, setCarregandoSistemas] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    sistemaService.listarTodos()
      .then(setSistemas)
      .catch(() => setErro('Não foi possível carregar os sistemas.'))
      .finally(() => setCarregandoSistemas(false));
  }, []);

  const podeContinuar =
    sistemaSelecionado !== null && nomePersonagem.trim().length >= 2;

  function handleConfirmar() {
    if (!podeContinuar) return;
    onConfirmar({
      sistema: sistemaSelecionado,
      nomePersonagem: nomePersonagem.trim(),
    });
  }

  if (carregandoSistemas) {
    return (
      <div className={styles.centrado}>
        <div className={styles.spinner} />
        <p className={styles.textoAux}>Carregando sistemas...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.brasao}>⚔</div>
        <h1 className={styles.titulo}>Forja do Cavaleiro</h1>
        <p className={styles.subtitulo}>Escolha seu sistema e dê um nome ao cavaleiro</p>
      </header>

      {erro && <p className={styles.erro}>{erro}</p>}

      {/* Sistemas */}
      <section className={styles.secao}>
        <h2 className={styles.secaoTitulo}>
          <span className={styles.secaoNum}>I</span> Sistema
        </h2>
        {sistemas.length === 0 ? (
          <p className={styles.textoAux}>Nenhum sistema disponível no momento.</p>
        ) : (
          <div className={styles.grade}>
            {sistemas.map((s) => (
              <button
                key={s.id}
                className={`${styles.card} ${sistemaSelecionado?.id === s.id ? styles.cardAtivo : ''}`}
                onClick={() => setSistemaSelecionado(s)}
              >
                {s.urlImagem && (
                  <img src={s.urlImagem} alt={s.nome} className={styles.cardImagem} />
                )}
                <span className={styles.cardNome}>{s.nome}</span>
                {s.descricao && (
                  <span className={styles.cardDesc}>{s.descricao}</span>
                )}
                {s.eOficial && <span className={styles.badge}>Oficial</span>}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Nome do personagem — só aparece após escolher sistema */}
      {sistemaSelecionado && (
        <section className={styles.secao}>
          <h2 className={styles.secaoTitulo}>
            <span className={styles.secaoNum}>II</span> Seu Nome
          </h2>
          <div className={styles.inputWrapper}>
            <input
              className={styles.input}
              type="text"
              placeholder="Como será chamado, cavaleiro?"
              value={nomePersonagem}
              onChange={(e) => setNomePersonagem(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleConfirmar()}
              maxLength={60}
              autoFocus
            />
            <span className={styles.inputBorda} />
          </div>
        </section>
      )}

      <div className={styles.rodape}>
        <button
          className={styles.botaoCriar}
          disabled={!podeContinuar}
          onClick={handleConfirmar}
        >
          Iniciar Forja
          <span className={styles.setaBotao}>→</span>
        </button>
      </div>
    </div>
  );
}