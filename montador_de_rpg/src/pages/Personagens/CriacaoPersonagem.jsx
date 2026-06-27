import { useState, useEffect } from 'react';
import { usuarioService } from '../../services/usuarioService.js';
import { personagemService } from '../../services/personagemService.js';
import SelecaoSistema from '../../Components/CriacaoPersonagem/SelecaoSistema.jsx';
import ExecucaoProcedimento from '../../Components/CriacaoPersonagem/ExecucaoProcedimento.jsx';
import styles from './CriacaoPersonagem.module.css';

const TIPO_ENTIDADE_JOGADOR = 'jogador';

export default function CriacaoPersonagem({ setMenuAtivo }) {

  const [usuarioId, setUsuarioId] = useState(null);
  const [carregandoUsuario, setCarregandoUsuario] = useState(true);
  const [erroGlobal, setErroGlobal] = useState(null);

  // ── Inicialização limpa (sem localStorage) ──────
  const [fase, setFase] = useState('selecao');
  const [selecao, setSelecao] = useState(null);
  const [entidadeJogador, setEntidadeJogador] = useState(null);
  const [personagemFinal, setPersonagemFinal] = useState(null);

  // ── carrega usuário ──────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const res = await usuarioService.perfil();
        const perfil = res?.data?.data || res?.data || res;
        const id = perfil?.id ?? perfil?.usuarioId ?? null;
        setUsuarioId(id);
        if (!id) setErroGlobal('Não foi possível identificar o usuário. Faça login novamente.');
      } catch {
        setErroGlobal('Sessão inválida. Faça login novamente.');
      } finally {
        setCarregandoUsuario(false);
      }
    })();
  }, []);

  // ── ao confirmar sistema + nome, busca entidade jogador ─────────
  async function handleSelecaoConfirmada({ sistema, nomePersonagem }) {
    if (!usuarioId) {
      setErroGlobal('Usuário não identificado. Recarregue a página.');
      return;
    }

    setErroGlobal(null);
    setFase('buscandoEntidade');

    try {
      let entidade = buscarEntidadeJogadorNoSchema(sistema);

      if (!entidade || entidade._fromSchema) {
        const entidades = await personagemService.listarEntidadesPorSistema(sistema.id);
        const entidadeApi = entidades.find(e => e.tipo === TIPO_ENTIDADE_JOGADOR) ?? null;
        if (entidadeApi) entidade = entidadeApi;
      }

      if (!entidade) {
        throw new Error(`Nenhuma entidade do tipo "${TIPO_ENTIDADE_JOGADOR}" encontrada no sistema.`);
      }

      setSelecao({ sistema, nomePersonagem });
      setEntidadeJogador(entidade);
      setFase('procedimento');
    } catch (e) {
      setErroGlobal(e.message);
      setFase('selecao');
    }
  }

  function handleConcluido(personagem) {
    setPersonagemFinal(personagem);
    setFase('concluido');
  }

  function handleErro(msg) {
    setErroGlobal(msg);
  }

  function voltarParaSelecao() {
    setFase('selecao');
    setSelecao(null);
    setEntidadeJogador(null);
    setErroGlobal(null);
  }

  // Sair da tela
  function irParaMenuPersonagens(e) {
    if (e) e.preventDefault();
    setMenuAtivo('personagens');
  }

  // ── loading inicial ──────────────────────────────────────────────
  if (carregandoUsuario) {
    return (
      <div className={styles.centradoFull}>
        <div className={styles.spinner} />
      </div>
    );
  }

  return (
    <div className={styles.pagina}>
      {(fase === 'procedimento' || fase === 'buscandoEntidade') && (
        <button className={styles.botaoVoltar} onClick={voltarParaSelecao}>
          ← Voltar
        </button>
      )}

      {erroGlobal && (
        <div className={styles.erroGlobal}>
          <span>{erroGlobal}</span>
          <button onClick={() => setErroGlobal(null)}>✕</button>
        </div>
      )}

      {fase === 'selecao' && (
        <SelecaoSistema onConfirmar={handleSelecaoConfirmada} />
      )}

      {fase === 'buscandoEntidade' && (
        <div className={styles.centradoFull}>
          <div className={styles.spinner} />
          <p>Preparando ficha...</p>
        </div>
      )}

      {fase === 'procedimento' && selecao && entidadeJogador && usuarioId && (
        <ExecucaoProcedimento
          sistema={selecao.sistema}
          entidade={entidadeJogador}
          nomePersonagem={selecao.nomePersonagem}
          usuarioId={usuarioId}
          campanhaAtivaId={null}
          onConcluido={handleConcluido}
          onErro={handleErro}
        />
      )}

      {fase === 'concluido' && personagemFinal && (
        <div className={styles.concluidoPagina}>
          <span className={styles.icone}>✦</span>
          <h1 className={styles.tituloConcluido}>
            {personagemFinal.instanciaNome || selecao?.nomePersonagem}
          </h1>
          <p className={styles.subtitulo}>O cavaleiro está forjado</p>
          <div className={styles.acoes}>
            <button className={styles.botaoPrimario} onClick={irParaMenuPersonagens}>
              Ir para o Menu
            </button>
            <button className={styles.botaoSecundario} onClick={voltarParaSelecao}>
              Criar outro
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function buscarEntidadeJogadorNoSchema(sistema) {
  const schema = sistema?.schemaEntidades;
  if (!schema || typeof schema !== 'object') return null;

  const entry = Object.entries(schema).find(
    ([chave, def]) => chave === TIPO_ENTIDADE_JOGADOR || def?.tipo === TIPO_ENTIDADE_JOGADOR
  );
  if (!entry) return null;

  const [chave, def] = entry;
  return {
    id: null,
    tipo: TIPO_ENTIDADE_JOGADOR,
    nome: def?.label ?? chave,
    atributos: def?.atributos ?? [],
    obrigatorios: def?.obrigatorios ?? [],
    _fromSchema: true,
  };
}