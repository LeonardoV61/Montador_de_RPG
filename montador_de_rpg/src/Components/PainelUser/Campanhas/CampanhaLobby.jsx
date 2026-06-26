import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles.CampanhaLobby.module.css";

// Importando os services que você já possui
import { sessaoService } from "../../../services/sessaoService.js";
import { cenaService } from "../../../services/cenaService.js";
import { campanhaService } from "../../../services/campanhaService.js";
import { usuarioService } from "../../../services/usuarioService.js";

export default function CampanhaLobby({ campanha, roleAtiva, usuarioId, onVoltar }) {
  const navigate = useNavigate();
  const ehMestre = roleAtiva === "mestre";

  const [participantes, setParticipantes] = useState([]);
  const [sessoes, setSessoes] = useState([]);
  const [meuPersonagem, setMeuPersonagem] = useState(null);
  const [meusPersonagens, setMeusPersonagens] = useState([]);

  const [modalAddJogador, setModalAddJogador] = useState(false);
  const [modalAgendarSessao, setModalAgendarSessao] = useState(false);
  const [emailConvite, setEmailConvite] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  // Carrega dados da campanha
  useEffect(() => {
    if (!campanha?.id) return;

    // Participantes
    campanhaService.listarParticipantes(campanha.id)
      .then(res => setParticipantes(res?.data || res || []))
      .catch(() => setParticipantes([]));

    // Sessões agendadas/ativas
    sessaoService.listarPorCampanha(campanha.id)
      .then(res => setSessoes(res?.data || res || []))
      .catch(() => setSessoes([]));

    // Se jogador, busca personagem vinculado e personagens do usuário
    if (!ehMestre) {
      campanhaService.buscarMeuPersonagem(campanha.id)
        .then(res => setMeuPersonagem(res?.data || res || null))
        .catch(() => setMeuPersonagem(null));

      campanhaService.listarMinhasInstancias()
        .then(res => setMeusPersonagens(res?.data || res || []))
        .catch(() => setMeusPersonagens([]));
    }
  }, [campanha?.id, ehMestre]);

  // Mestre: adiciona jogador
  const handleAdicionarJogador = async () => {
  if (!emailConvite.trim()) return;
  setCarregando(true);
  setErro(null);
  try {
    const res = await usuarioService.buscarIdPorEmail(emailConvite.trim());
    const usuarioIdAdd = res?.data ?? res; // ← .data pode estar aninhado pelo axios
    const novo = await campanhaService.adicionarJogador(campanha.id, { usuarioId: usuarioIdAdd });
    setParticipantes(prev => [...prev, novo?.data || novo]);
    setEmailConvite("");
    setModalAddJogador(false);
  } catch {
    setErro("Não foi possível adicionar o jogador.");
  } finally {
    setCarregando(false);
  }
};

  // Mestre: agenda uma sessão
  const handleAgendarSessao = async () => {
    if (!dataInicio) return;
    setCarregando(true);
    setErro(null);
    try {
      const nova = await sessaoService.agendar(campanha.id, dataInicio);
      setSessoes(prev => [...prev, nova?.data || nova]);
      setDataInicio("");
      setModalAgendarSessao(false);
    } catch {
      setErro("Não foi possível agendar a sessão.");
    } finally {
      setCarregando(false);
    }
  };

  // Mestre: inicia sessão agendada
  const handleIniciarSessao = async (sessao) => {
    setCarregando(true);
    setErro(null);
    try {
      const respSessao = await sessaoService.iniciar(campanha.id);
      const sessaoAtiva = respSessao?.data || respSessao;

      localStorage.setItem("role_sessao_ativa", "mestre");
      localStorage.setItem("idCampanhaAtiva", campanha.id);
      localStorage.setItem("idSessaoAtiva", sessaoAtiva.id);

      const respCena = await cenaService.criar({ sessaoId: sessaoAtiva.id, nome: "Cena Inicial" });
      const cena = respCena?.data || respCena;
      localStorage.setItem("idCenaAtiva", cena.id);

      navigate("/jogo");
    } catch {
      setErro("Erro ao iniciar sessão.");
    } finally {
      setCarregando(false);
    }
  };

  // Jogador: vincula personagem
  const handleVincularPersonagem = async (instanciaId) => {
    setCarregando(true);
    setErro(null);
    try {
      const res = await campanhaService.vincularPersonagem(campanha.id, instanciaId);
      setMeuPersonagem(res?.data || res);
    } catch {
      setErro("Não foi possível vincular o personagem.");
    } finally {
      setCarregando(false);
    }
  };

  // Jogador: entra na sessão
  const handleEntrarNaSessao = async (sessao) => {
    setCarregando(true);
    setErro(null);
    try {
      await sessaoService.entrar(sessao.id);

      localStorage.setItem("role_sessao_ativa", "jogador");
      localStorage.setItem("idCampanhaAtiva", campanha.id);
      localStorage.setItem("idSessaoAtiva", sessao.id);
      if (meuPersonagem?.id) localStorage.setItem("instanciaAtiva", meuPersonagem.id);

      const respCena = await cenaService.buscarCenaAtiva(sessao.id).catch(() => null);
      const cena = respCena?.data || respCena;
      if (cena?.id) localStorage.setItem("idCenaAtiva", cena.id);

      navigate("/jogo");
    } catch {
      setErro("Erro ao entrar na sessão.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className={styles.lobby}>
      <header className={styles.cabecalho}>
        <button className={styles.voltar} onClick={onVoltar}>← Voltar</button>
        <div>
          <h2 className={styles.titulo}>{campanha.nome}</h2>
          <p className={styles.descricao}>{campanha.descricao}</p>
        </div>
        <span className={[styles.status, styles[campanha.status?.toLowerCase()]].filter(Boolean).join(' ')}>
          {campanha.status}
        </span>
      </header>

      {erro && <p className={styles.erro}>{erro}</p>}

      <div className={styles.conteudo}>
        <section className={styles.secao}>
          <div className={styles.secaoHeader}>
            <h3>Participantes</h3>
            {ehMestre && (
              <button className={styles.btnSecundario} onClick={() => setModalAddJogador(true)}>+ Adicionar</button>
            )}
          </div>
          <ul className={styles.lista}>
            {participantes.length === 0
              ? <li className={styles.vazio}>Nenhum participante ainda.</li>
              : participantes.map((p, i) => (
                  <li key={p.id ?? p.usuarioId ?? i} className={styles.participante}>
                  <span className={styles.avatar}>⚔</span>
                  <span>{p.apelido || p.nome || `Jogador ${p.usuarioId}`}</span>
                  {p.personagemNome && <span className={styles.personagemNome}>— {p.personagemNome}</span>}
                </li>
              ))
            }
          </ul>
        </section>

        <div className={styles.colunaDir}>
          <section className={styles.secao}>
            <div className={styles.secaoHeader}>
              <h3>Sessões</h3>
              {ehMestre && (
                <button className={styles.btnSecundario} onClick={() => setModalAgendarSessao(true)}>+ Agendar</button>
              )}
            </div>
            <ul className={styles.lista}>
              {sessoes.length === 0
                ? <li className={styles.vazio}>Nenhuma sessão agendada.</li>
                : sessoes.map(s => (
                  <li key={s.id} className={styles.sessao}>
                    <div>
                      <span className={styles.sessaoData}>
                        {s.dataInicio ? new Date(s.dataInicio).toLocaleString("pt-BR") : "Data não definida"}
                      </span>
                      <span className={`${styles.sessaoStatus} ${styles[s.status?.toLowerCase()]}`}>
                        {s.status}
                      </span>
                    </div>
                    {ehMestre && s.status !== "ENCERRADA" && (
                      <button className={styles.btnPrimario} disabled={carregando} onClick={() => handleIniciarSessao(s)}>
                        {s.status === "ATIVA" ? "Retomar" : "Iniciar"}
                      </button>
                    )}
                    {!ehMestre && s.status === "ATIVA" && (
                      <button className={styles.btnPrimario} disabled={carregando || !meuPersonagem} onClick={() => handleEntrarNaSessao(s)}>
                        Entrar
                      </button>
                    )}
                  </li>
                ))
              }
            </ul>
          </section>

          {!ehMestre && (
            <section className={styles.secao}>
              <h3>Meu Personagem</h3>
              {meuPersonagem ? (
                <div className={styles.personagemCard}>
                  <span className={styles.avatar}>🛡</span>
                  <div>
                    <p className={styles.personagemNomeGrande}>{meuPersonagem.nome}</p>
                    <p className={styles.personagemTipo}>{meuPersonagem.tipo}</p>
                  </div>
                </div>
              ) : (
                <div className={styles.semPersonagem}>
                  <p>Você ainda não tem um personagem nesta campanha.</p>
                  {meusPersonagens.length > 0 && (
                    <>
                      <p className={styles.subLabel}>Vincular existente:</p>
                      <ul className={styles.listaPersonagens}>
                        {meusPersonagens.map(p => (
                          <li key={p.id} className={styles.opcaoPersonagem}>
                            <span>{p.nome} — {p.tipo}</span>
                            <button className={styles.btnSecundario} disabled={carregando} onClick={() => handleVincularPersonagem(p.id)}>
                              Usar este
                            </button>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  <button className={styles.btnPrimario} onClick={() => {
                    localStorage.setItem("idCampanhaParaCriarPersonagem", campanha.id);
                    onVoltar();
                  }}>
                    + Criar Personagem
                  </button>
                </div>
              )}
            </section>
          )}
        </div>
      </div>

      {modalAddJogador && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Adicionar Jogador</h3>
            <input className={styles.input} placeholder="E-mail ou ID do usuário" value={emailConvite} onChange={e => setEmailConvite(e.target.value)} />
            <div className={styles.modalBotoes}>
              <button className={styles.btnSecundario} onClick={() => setModalAddJogador(false)}>Cancelar</button>
              <button className={styles.btnPrimario} disabled={carregando} onClick={handleAdicionarJogador}>Adicionar</button>
            </div>
          </div>
        </div>
      )}

      {modalAgendarSessao && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Agendar Sessão</h3>
            <input className={styles.input} type="datetime-local" value={dataInicio} onChange={e => setDataInicio(e.target.value)} />
            <div className={styles.modalBotoes}>
              <button className={styles.btnSecundario} onClick={() => setModalAgendarSessao(false)}>Cancelar</button>
              <button className={styles.btnPrimario} disabled={carregando} onClick={handleAgendarSessao}>Agendar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}