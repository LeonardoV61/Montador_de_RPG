import { useState, useEffect, useRef } from 'react';
import { sistemaService } from '../../services/sistemaService.js';
import {personagemService} from '../../services/personagemService.js';
import styles from './SelecaoSistema.module.css';

export default function SelecaoSistema({ onConfirmar }) {
  const [sistemas, setSistemas] = useState([]);
  const [sistemaSelecionado, setSistemaSelecionado] = useState(null);
  const [entidades, setEntidades] = useState([]);
  const [entidadeSelecionada, setEntidadeSelecionada] = useState(null);
  const [nomePersonagem, setNomePersonagem] = useState('');
  const [carregandoSistemas, setCarregandoSistemas] = useState(true);
  const [carregandoEntidades, setCarregandoEntidades] = useState(false);
  const [erro, setErro] = useState(null);

  // Ref para abortar fetch anterior ao trocar sistema
  const abortRef = useRef(null);

  useEffect(() => {
    sistemaService.listarTodos()
      .then(setSistemas)
      .catch(() => setErro('Não foi possível carregar os sistemas.'))
      .finally(() => setCarregandoSistemas(false));
  }, []);

  // Corrigido: estados de loading controlados dentro da promise, não sincronamente no body
  function handleSelecionarSistema(sistema) {
    // Cancela fetch anterior se ainda estiver em andamento
    if (abortRef.current) abortRef.current();

    setSistemaSelecionado(sistema);
    setEntidadeSelecionada(null);
    setEntidades([]);

    let cancelado = false;
    abortRef.current = () => { cancelado = true; };

    setCarregandoEntidades(true);

    personagemService.listarEntidadesPorSistema(sistema.id)
      .then(data => { if (!cancelado) setEntidades(data); })
      .catch(() => { if (!cancelado) setErro('Não foi possível carregar as entidades.'); })
      .finally(() => { if (!cancelado) setCarregandoEntidades(false); });
  }

  const podeContinuar = sistemaSelecionado && entidadeSelecionada && nomePersonagem.trim().length >= 2;

  function handleConfirmar() {
    if (!podeContinuar) return;
    onConfirmar({
      sistema: sistemaSelecionado,
      entidade: entidadeSelecionada,
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
        <p className={styles.subtitulo}>Escolha seu sistema e sua linhagem</p>
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
                onClick={() => handleSelecionarSistema(s)}
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

      {/* Entidades */}
      {sistemaSelecionado && (
        <section className={styles.secao}>
          <h2 className={styles.secaoTitulo}>
            <span className={styles.secaoNum}>II</span> Linhagem
          </h2>
          {carregandoEntidades ? (
            <div className={styles.centrado}>
              <div className={styles.spinner} />
            </div>
          ) : entidades.length === 0 ? (
            <p className={styles.textoAux}>Nenhuma linhagem disponível neste sistema.</p>
          ) : (
            <div className={styles.grade}>
              {entidades.map((e) => (
                <button
                  key={e.id}
                  className={`${styles.card} ${entidadeSelecionada?.id === e.id ? styles.cardAtivo : ''}`}
                  onClick={() => setEntidadeSelecionada(e)}
                >
                  {e.urlImagem && (
                    <img src={e.urlImagem} alt={e.nome} className={styles.cardImagem} />
                  )}
                  <span className={styles.cardNome}>{e.nome}</span>
                  {e.descricao && (
                    <span className={styles.cardDesc}>{e.descricao}</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Nome do personagem */}
      {entidadeSelecionada && (
        <section className={styles.secao}>
          <h2 className={styles.secaoTitulo}>
            <span className={styles.secaoNum}>III</span> Seu Nome
          </h2>
          <div className={styles.inputWrapper}>
            <input
              className={styles.input}
              type="text"
              placeholder="Como será chamado, cavaleiro?"
              value={nomePersonagem}
              onChange={(e) => setNomePersonagem(e.target.value)}
              maxLength={60}
              autoFocus
            />
            <span className={styles.inputBorda} />
          </div>
        </section>
      )}

      {/* Botão */}
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