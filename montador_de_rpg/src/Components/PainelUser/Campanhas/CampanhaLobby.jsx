import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles.CampanhaLobby.module.css";

import { sessaoService } from "../../../services/sessaoService.js";
import { cenaService } from "../../../services/cenaService.js";
import { campanhaService } from "../../../services/campanhaService.js";
import { usuarioService } from "../../../services/usuarioService.js";
import { sistemaService } from "../../../services/sistemaService.js";

// ─── constantes de status disponíveis para o mestre ───────────────────────────
const STATUS_OPCOES = ["ATIVA", "PAUSADA", "FINALIZADA"];

export default function CampanhaLobby({ campanha, usuarioId, onVoltar }) {
  const navigate = useNavigate();

  // ── role vem do back-end, nunca do estado local do UserMenu ─────────────────
  const [roleNaCampanha, setRoleNaCampanha] = useState(null); // "mestre" | "jogador"
  const [carregandoRole, setCarregandoRole] = useState(true);

  const ehMestre = roleNaCampanha === "mestre";

  // ── dados da campanha ────────────────────────────────────────────────────────
  const [campanhaLocal, setCampanhaLocal] = useState(campanha);
  const [sistema, setSistema] = useState(null);

  // ── participantes com papéis reais ──────────────────────────────────────────
  const [participantes, setParticipantes] = useState([]);

  // ── sessões ──────────────────────────────────────────────────────────────────
  const [sessoes, setSessoes] = useState([]);

  // ── personagens (jogador) ────────────────────────────────────────────────────
  const [meuPersonagem, setMeuPersonagem] = useState(null);
  const [meusPersonagens, setMeusPersonagens] = useState([]);

  // ── UI ───────────────────────────────────────────────────────────────────────
  const [modalAddJogador, setModalAddJogador] = useState(false);
  const [modalAgendarSessao, setModalAgendarSessao] = useState(false);
  const [editandoStatus, setEditandoStatus] = useState(false);
  const [modalSistema, setModalSistema] = useState(false);
  const [sistemasDisponiveis, setSistemasDisponiveis] = useState([]);
  const [carregandoSistemas, setCarregandoSistemas] = useState(false);
  const [sistemaSelecionadoId, setSistemaSelecionadoId] = useState(null);
  const [emailConvite, setEmailConvite] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  // ── 1. Busca a role real do usuário nesta campanha ───────────────────────────
  useEffect(() => {
    if (!campanha?.id) return;

    async function buscarRole() {
      setCarregandoRole(true);
      try {
        const res = await campanhaService.buscarMinhaRole(campanha.id);
        const papel = res?.data?.papel ?? res?.papel ?? res; // back retorna { papel: "MESTRE" }
        setRoleNaCampanha(typeof papel === "string" ? papel.toLowerCase() : "jogador");
      } catch {
        setRoleNaCampanha("jogador"); // fallback seguro
      } finally {
        setCarregandoRole(false);
      }
    }

    buscarRole();
  }, [campanha?.id]);

  // ── 2. Carrega dados da campanha assim que a role estiver disponível ─────────
  useEffect(() => {
    if (!campanha?.id || carregandoRole) return;

    // Participantes com papéis reais (retorna: [{usuarioId, apelido, papel, personagemNome}])
    campanhaService
      .listarParticipantes(campanha.id)
      .then((res) => setParticipantes(res?.data || res || []))
      .catch(() => setParticipantes([]));

    // Sessões
    sessaoService
      .listarPorCampanha(campanha.id)
      .then((res) => setSessoes(res?.data || res || []))
      .catch(() => setSessoes([]));

    // Sistema da campanha
    campanhaService
      .buscarPorId(campanha.id)
      .then((res) => {
        const dados = res?.data || res;
        if (dados) {
          setCampanhaLocal(dados);
          setSistema(dados.sistema || null);
        }
      })
      .catch(() => {});

    // Se jogador, busca personagem vinculado e lista de personagens disponíveis
    if (!ehMestre) {
      campanhaService
        .obterMeuPersonagem(campanha.id)
        .then((res) => setMeuPersonagem(res?.data || res || null))
        .catch(() => setMeuPersonagem(null));

      campanhaService
        .listarMinhasInstancias?.()
        .then((res) => setMeusPersonagens(res?.data || res || []))
        .catch(() => setMeusPersonagens([]));
    }
  }, [campanha?.id, carregandoRole, ehMestre]);

  // ── Handlers ─────────────────────────────────────────────────────────────────

  // Mestre: abre modal de seleção de sistema
  const handleAbrirModalSistema = async () => {
    setModalSistema(true);
    if (sistemasDisponiveis.length > 0) return; // já carregados
    setCarregandoSistemas(true);
    try {
      const res = await sistemaService.listarTodos();
      setSistemasDisponiveis(res?.data || res || []);
    } catch {
      setErro("Não foi possível carregar os sistemas.");
    } finally {
      setCarregandoSistemas(false);
    }
  };

  // Mestre: vincula sistema escolhido à campanha
  const handleVincularSistema = async () => {
    if (!sistemaSelecionadoId) return;
    setCarregando(true);
    setErro(null);
    try {
      const res = await campanhaService.atualizar(campanha.id, { sistemaId: sistemaSelecionadoId });
      const atualizada = res?.data || res;
      // Busca objeto completo do sistema na lista local
      const sistemaObj = sistemasDisponiveis.find(s => s.id === sistemaSelecionadoId) || null;
      setSistema(sistemaObj);
      setCampanhaLocal(prev => ({ ...prev, sistemaId: sistemaSelecionadoId, sistemaNome: sistemaObj?.nome }));
      setModalSistema(false);
      setSistemaSelecionadoId(null);
    } catch {
      setErro("Não foi possível vincular o sistema.");
    } finally {
      setCarregando(false);
    }
  };

  const handleAdicionarJogador = async () => {
    if (!emailConvite.trim()) return;
    setCarregando(true);
    setErro(null);
    try {
      const res = await usuarioService.buscarIdPorEmail(emailConvite.trim());
      const idAdd = res?.data ?? res;
      const novo = await campanhaService.adicionarJogador(campanha.id, { usuarioId: idAdd });
      setParticipantes((prev) => [...prev, novo?.data || novo]);
      setEmailConvite("");
      setModalAddJogador(false);
    } catch {
      setErro("Não foi possível adicionar o jogador.");
    } finally {
      setCarregando(false);
    }
  };

  const handleAgendarSessao = async () => {
    if (!dataInicio) return;
    setCarregando(true);
    setErro(null);
    try {
      const nova = await sessaoService.agendar(campanha.id, dataInicio);
      setSessoes((prev) => [...prev, nova?.data || nova]);
      setDataInicio("");
      setModalAgendarSessao(false);
    } catch {
      setErro("Não foi possível agendar a sessão.");
    } finally {
      setCarregando(false);
    }
  };

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

  // Mestre: atualiza status da campanha
  const handleAtualizarStatus = async (novoStatus) => {
    setCarregando(true);
    setErro(null);
    try {
      const res = await campanhaService.atualizar(campanha.id, { Status: novoStatus });
      const atualizada = res?.data || res;
      setCampanhaLocal((prev) => ({ ...prev, Status: atualizada?.status ?? novoStatus }));
      setEditandoStatus(false);
    } catch {
      setErro("Não foi possível atualizar o status da campanha.");
    } finally {
      setCarregando(false);
    }
  };

  // ── Loading state da role ─────────────────────────────────────────────────────
  if (carregandoRole) {
    return (
      <div className={styles.lobby}>
        <div className={styles.carregandoRole}>
          <div className={styles.spinner} />
          <p>Verificando acesso...</p>
        </div>
      </div>
    );
  }

  const statusAtual = (campanhaLocal?.Status ?? campanha?.Status ?? "").toLowerCase();

  return (
    <div className={styles.lobby}>

      {/* ── Cabeçalho ──────────────────────────────────────────────────────────── */}
      <header className={styles.cabecalho}>
        <button className={styles.voltar} onClick={onVoltar}>← Voltar</button>

        <div className={styles.cabecalhoInfo}>
          <h2 className={styles.titulo}>{campanhaLocal?.nome ?? campanha.nome}</h2>
          <p className={styles.descricao}>{campanhaLocal?.descricao ?? campanha.descricao}</p>
        </div>

        <div className={styles.cabecalhoAcoes}>
          {/* Status — mestre pode editar */}
          <div className={styles.statusWrapper}>
            <span className={[styles.status, styles[statusAtual]].filter(Boolean).join(" ")}>
              {(campanhaLocal?.Status ?? campanha?.Status) || "—"}
            </span>

            {ehMestre && !editandoStatus && (
              <button
                className={styles.btnIcone}
                title="Alterar status"
                onClick={() => setEditandoStatus(true)}
              >
                ✎
              </button>
            )}

            {ehMestre && editandoStatus && (
              <div className={styles.statusDropdown}>
                {STATUS_OPCOES.map((s) => (
                  <button
                    key={s}
                    className={[
                      styles.statusOpcao,
                      s.toLowerCase() === statusAtual ? styles.statusOpcaoAtiva : "",
                    ].join(" ")}
                    disabled={carregando}
                    onClick={() => handleAtualizarStatus(s)}
                  >
                    {s}
                  </button>
                ))}
                <button
                  className={styles.statusOpcaoCancelar}
                  onClick={() => setEditandoStatus(false)}
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>

          <button className={styles.btnPrimario} onClick={() => navigate("/jogo")}>
            Ir para o Jogo →
          </button>
        </div>
      </header>

      {erro && <p className={styles.erro}>{erro}</p>}

      {/* ── Sistema da campanha ────────────────────────────────────────────────── */}
      <section className={styles.sistemaFaixa}>
        <span className={styles.sistemaLabel}>Sistema</span>

        {sistema ? (
          <>
            {sistema.urlImagem && (
              <img src={sistema.urlImagem} alt={sistema.nome} className={styles.sistemaImagem} />
            )}
            <span className={styles.sistemaNome}>{sistema.nome}</span>
            {sistema.descricao && (
              <span className={styles.sistemaDesc}>{sistema.descricao}</span>
            )}
            {sistema.eOficial && <span className={styles.sistemaBadge}>Oficial</span>}
            {ehMestre && (
              <button
                className={styles.btnSistemaTrocar}
                onClick={handleAbrirModalSistema}
                title="Trocar sistema"
              >
                Trocar
              </button>
            )}
          </>
        ) : (
          <>
            <span className={styles.sistemaSemDef}>Nenhum sistema definido</span>
            {ehMestre && (
              <button
                className={styles.btnPrimario}
                onClick={handleAbrirModalSistema}
              >
                + Definir sistema
              </button>
            )}
          </>
        )}
      </section>

      {/* ── Conteúdo principal ────────────────────────────────────────────────── */}
      <div className={styles.conteudo}>

        {/* ── Participantes ─────────────────────────────────────────────────────── */}
        <section className={styles.secao}>
          <div className={styles.secaoHeader}>
            <h3>Participantes</h3>
            {ehMestre && (
              <button className={styles.btnSecundario} onClick={() => setModalAddJogador(true)}>
                + Adicionar
              </button>
            )}
          </div>
          <ul className={styles.lista}>
            {participantes.length === 0 ? (
              <li className={styles.vazio}>Nenhum participante ainda.</li>
            ) : (
              participantes.map((p, i) => {
                const papel = (p.papel ?? p.role ?? "jogador").toLowerCase();
                const ehMestreParticipante = papel === "mestre";
                return (
                  <li key={p.id ?? p.usuarioId ?? i} className={styles.participante}>
                    <span className={styles.avatar}>
                      {ehMestreParticipante ? (
                        /* Livro aberto — narrador/mestre */
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-label="Mestre">
                          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                        </svg>
                      ) : (
                        /* Espada — jogador */
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-label="Jogador">
                          <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
                          <line x1="13" y1="19" x2="19" y2="13" />
                          <line x1="16" y1="16" x2="20" y2="20" />
                          <line x1="19" y1="21" x2="21" y2="19" />
                        </svg>
                      )}
                    </span>
                    <div className={styles.participanteInfo}>
                      <span className={styles.participanteNome}>
                        {p.apelido || p.nome || `Jogador ${p.usuarioId}`}
                      </span>
                      {p.personagemNome && (
                        <span className={styles.personagemNome}>— {p.personagemNome}</span>
                      )}
                    </div>
                    <span className={[styles.papelBadge, styles[`papel_${papel}`]].join(" ")}>
                      {ehMestreParticipante ? "Mestre" : "Jogador"}
                    </span>
                  </li>
                );
              })
            )}
          </ul>
        </section>

        {/* ── Coluna direita ────────────────────────────────────────────────────── */}
        <div className={styles.colunaDir}>

          {/* Sessões */}
          <section className={styles.secao}>
            <div className={styles.secaoHeader}>
              <h3>Sessões</h3>
              {ehMestre && (
                <button className={styles.btnSecundario} onClick={() => setModalAgendarSessao(true)}>
                  + Agendar
                </button>
              )}
            </div>
            <ul className={styles.lista}>
              {sessoes.length === 0 ? (
                <li className={styles.vazio}>Nenhuma sessão agendada.</li>
              ) : (
                sessoes.map((s) => (
                  <li key={s.id} className={styles.sessao}>
                    <div>
                      <span className={styles.sessaoData}>
                        {s.dataInicio
                          ? new Date(s.dataInicio).toLocaleString("pt-BR")
                          : "Data não definida"}
                      </span>
                      <span className={`${styles.sessaoStatus} ${styles[s.status?.toLowerCase()]}`}>
                        {s.status}
                      </span>
                    </div>
                    {ehMestre && s.status !== "ENCERRADA" && (
                      <button
                        className={styles.btnPrimario}
                        disabled={carregando}
                        onClick={() => handleIniciarSessao(s)}
                      >
                        {s.status === "ATIVA" ? "Retomar" : "Iniciar"}
                      </button>
                    )}
                    {!ehMestre && s.status === "ATIVA" && (
                      <button
                        className={styles.btnPrimario}
                        disabled={carregando || !meuPersonagem}
                        onClick={() => handleEntrarNaSessao(s)}
                      >
                        Entrar
                      </button>
                    )}
                  </li>
                ))
              )}
            </ul>
          </section>

          {/* Meu Personagem (só para jogadores) */}
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
                        {meusPersonagens.map((p) => (
                          <li key={p.id} className={styles.opcaoPersonagem}>
                            <span>{p.nome} — {p.tipo}</span>
                            <button
                              className={styles.btnSecundario}
                              disabled={carregando}
                              onClick={() => handleVincularPersonagem(p.id)}
                            >
                              Usar este
                            </button>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  <button
                    className={styles.btnPrimario}
                    onClick={() => {
                      localStorage.setItem("idCampanhaParaCriarPersonagem", campanha.id);
                      onVoltar();
                    }}
                  >
                    + Criar Personagem
                  </button>
                </div>
              )}
            </section>
          )}

        </div>
      </div>

      {/* ── Modal: Adicionar Jogador ─────────────────────────────────────────────── */}
      {modalAddJogador && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Adicionar Jogador</h3>
            <input
              className={styles.input}
              placeholder="E-mail ou ID do usuário"
              value={emailConvite}
              onChange={(e) => setEmailConvite(e.target.value)}
            />
            <div className={styles.modalBotoes}>
              <button className={styles.btnSecundario} onClick={() => setModalAddJogador(false)}>
                Cancelar
              </button>
              <button className={styles.btnPrimario} disabled={carregando} onClick={handleAdicionarJogador}>
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Selecionar Sistema ───────────────────────────────────────────── */}
      {modalSistema && (
        <div className={styles.modalOverlay}>
          <div className={[styles.modal, styles.modalSistema].join(" ")}>
            <h3>Selecionar Sistema</h3>

            {carregandoSistemas ? (
              <div className={styles.modalSpinnerWrap}>
                <div className={styles.spinner} />
                <p>Carregando sistemas...</p>
              </div>
            ) : sistemasDisponiveis.length === 0 ? (
              <p className={styles.vazio}>Nenhum sistema disponível.</p>
            ) : (
              <ul className={styles.listaSistemas}>
                {sistemasDisponiveis.map(s => (
                  <li
                    key={s.id}
                    className={[
                      styles.sistemaOpcao,
                      sistemaSelecionadoId === s.id ? styles.sistemaOpcaoAtiva : "",
                    ].join(" ")}
                    onClick={() => setSistemaSelecionadoId(s.id)}
                  >
                    {s.urlImagem && (
                      <img src={s.urlImagem} alt={s.nome} className={styles.sistemaOpcaoImg} />
                    )}
                    <div className={styles.sistemaOpcaoInfo}>
                      <span className={styles.sistemaOpcaoNome}>{s.nome}</span>
                      {s.descricao && (
                        <span className={styles.sistemaOpcaoDesc}>{s.descricao}</span>
                      )}
                    </div>
                    {s.eOficial && <span className={styles.sistemaBadge}>Oficial</span>}
                    {sistemaSelecionadoId === s.id && (
                      <span className={styles.sistemaOpcaoCheck}>✓</span>
                    )}
                  </li>
                ))}
              </ul>
            )}

            <div className={styles.modalBotoes}>
              <button
                className={styles.btnSecundario}
                onClick={() => { setModalSistema(false); setSistemaSelecionadoId(null); }}
              >
                Cancelar
              </button>
              <button
                className={styles.btnPrimario}
                disabled={!sistemaSelecionadoId || carregando}
                onClick={handleVincularSistema}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Agendar Sessão ────────────────────────────────────────────────── */}
      {modalAgendarSessao && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Agendar Sessão</h3>
            <input
              className={styles.input}
              type="datetime-local"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
            />
            <div className={styles.modalBotoes}>
              <button className={styles.btnSecundario} onClick={() => setModalAgendarSessao(false)}>
                Cancelar
              </button>
              <button className={styles.btnPrimario} disabled={carregando} onClick={handleAgendarSessao}>
                Agendar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}