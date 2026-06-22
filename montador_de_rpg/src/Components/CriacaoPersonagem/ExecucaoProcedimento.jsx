import { useState, useEffect, useRef } from 'react';
import { procedimentoService } from '../../services/procedimentoService.js';
import { personagemService } from '../../services/personagemService.js';
import { campanhaService } from '../../services/campanhaService.js';
import { sessaoService } from '../../services/sessaoService.js';
import FormularioInput from './FormularioInput.jsx';
import styles from './ExecucaoProcedimento.module.css';

export default function ExecucaoProcedimento({
  sistema, entidade, nomePersonagem, usuarioId,
  campanhaAtivaId = null, onConcluido, onErro,
}) {
  const [fase, setFase] = useState('iniciando');
  const [contexto, setContexto] = useState(null);
  const [etapaAtual, setEtapaAtual] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [personagemCriado, setPersonagemCriado] = useState(null);

  const tempIdsRef = useRef({ campanha: null, sessao: null });
  const idSessaoRef = useRef(null);
  const procedimentoIdRef = useRef(null);
  const mountedRef = useRef(true);
  const jaIniciouRef = useRef(false);
  const respondendoRef = useRef(false);
  const faseRef = useRef(fase);

  useEffect(() => {
    faseRef.current = fase;
  }, [fase]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (faseRef.current === 'concluido' || faseRef.current === 'erro') {
        if (tempIdsRef.current.campanha) {
          campanhaService.deletar(tempIdsRef.current.campanha).catch(console.error);
        }
      }
    };
  }, []);

  useEffect(() => {
    if (jaIniciouRef.current) return;
    jaIniciouRef.current = true;
    iniciar();
  }, []);

  async function iniciar() {
    const temp = { campanha: null, sessao: null };
    tempIdsRef.current = temp;

    try {
      setFase('iniciando');

      let idCampanha, idSessao;
      if (campanhaAtivaId) {
        idCampanha = campanhaAtivaId;
        const r = await sessaoService.iniciar(idCampanha);
        idSessao = r?.data?.idSessao ?? r?.data?.id ?? r?.id;
        temp.sessao = idSessao;
      } else {
        const r = await campanhaService.criarTemporariaComSessao(sistema.id);
        idCampanha = r?.data?.campanhaId ?? r?.campanhaId;
        idSessao = r?.data?.sessaoId ?? r?.sessaoId;
        if (!idCampanha || !idSessao) throw new Error('IDs não retornados');
        temp.campanha = idCampanha;
        temp.sessao = idSessao;
      }
      idSessaoRef.current = idSessao;

      const pResp = await personagemService.criarCompleto({
        usuarioId, campanhaId: idCampanha,
        entidadeSistemaId: entidade.id,
        tipo: entidade.tipo || entidade.nome,
        nome: nomePersonagem,
        atributosAtuais: entidade.atributos || {},
      });
      const personagem = pResp?.data ?? pResp;
      const instanciaId = personagem?.instanciaId ?? personagem?.id;
      if (!instanciaId) throw new Error('Instância não encontrada');
      setPersonagemCriado(personagem);

      const procs = await procedimentoService.listar(sistema.id);
      const procCriacao = procs.find(p => p.tipo === 'CRIACAO_PERSONAGEM');
      if (!procCriacao) throw new Error('Procedimento não encontrado');
      procedimentoIdRef.current = procCriacao.id;

      const resp = await procedimentoService.iniciarComInstancia(procCriacao.id, idSessao, instanciaId);
      const ctx = resp?.data ?? resp;

      if (!mountedRef.current) return;
      processarNovoContexto(ctx);
    } catch (e) {
      console.error('Erro na criação:', e);
      await limparTemporarios(temp);
      if (mountedRef.current) {
        setFase('erro');
        onErro?.(e.message || 'Erro inesperado');
      }
    }
  }

  async function limparTemporarios({ campanha }) {
    tempIdsRef.current = { campanha: null, sessao: null };
    if (campanha) {
      try { await campanhaService.deletar(campanha); } catch (e) {  console.error('Erro:', e);}
    }
  }

  async function handleResponder(resposta) {
    if (carregando || respondendoRef.current) return;
    respondendoRef.current = true;
    setCarregando(true);

    if (etapaAtual) {
      setHistorico(h => [...h, {
        label: etapaAtual.parametrosEtapa?.campo_pedido || etapaAtual.nome,
        resposta: resposta ?? '—'
      }]);
    }

    try {
      const resp = await procedimentoService.responder(
        procedimentoIdRef.current,
        idSessaoRef.current,
        resposta
      );
      const novoCtx = resp?.data ?? resp;
      if (!mountedRef.current) return;
      processarNovoContexto(novoCtx);
    } catch (e) {
      limparTemporarios(tempIdsRef.current);
      console.error('Erro ao enviar resposta:', e);
      // setFase('erro');
    } finally {
      respondendoRef.current = false;
      setCarregando(false);
    }
  }

  function processarNovoContexto(ctx) {
    console.log('=== processarNovoContexto ===', JSON.stringify(ctx, null, 2));
    setContexto(ctx);
    
    const status = (ctx?.status || '').toUpperCase().trim();
    console.log('status detectado:', status);
    console.log('inputSolicitado:', ctx?.inputSolicitado);
    console.log('erro:', ctx?.erro);

    if (['CONCLUIDO', 'FINALIZADO', 'CONCLUIDA'].includes(status)) {
      limparTemporarios(tempIdsRef.current).then(() => {
        tempIdsRef.current = { campanha: null, sessao: null };
        setFase('concluido');
      });
      return;
    }

    if (status === 'ERRO') {
      limparTemporarios(tempIdsRef.current);
      console.log('Indo para ERRO. mensagem:', ctx?.erro);
      setFase('erro');
      return;
    }

    // EM_ANDAMENTO ou AGUARDANDO_INPUT
    const solicitacao = ctx?.inputSolicitado;
    console.log('solicitacao encontrada:', solicitacao);

    if (solicitacao) {
      setEtapaAtual({
        nome: solicitacao.campoPedido,
        tipoEtapa: 'SOLICITAR_INPUT',
        parametrosEtapa: {
          campo_pedido: solicitacao.campoPedido,
          salvar_em:    solicitacao.salvar_em,
          pode_passar:  solicitacao.pode_passar ?? false,
          opcoes_estatico: solicitacao.opcoes || [],
          rolagem:         solicitacao.rolagem || null,
        },
      });
      setFase('aguardando');
      return;
    }

    console.log('Nenhuma solicitação — indo para rodando');
    setFase('rodando');
  }

  async function handleConcluirPersonagem() {
    await limparTemporarios(tempIdsRef.current);
    onConcluido?.(personagemCriado);
  }

  const totalEtapas = contexto?.totalEtapas || contexto?.etapas?.length || 0;
  const etapaIndex = contexto?.etapaIndex ?? contexto?.ordemAtual ?? 0;
  const progresso = totalEtapas > 0 ? Math.round((etapaIndex / totalEtapas) * 100) : 0;

  if (fase === 'iniciando') {
    return (
      <div className={styles.centrado}>
        <div className={styles.spinnerGrande} />
        <p className={styles.textoFase}>Preparando a forja...</p>
        <p className={styles.textoAux}>Criando {nomePersonagem}</p>
      </div>
    );
  }

  if (fase === 'erro') {
    return (
      <div className={styles.centrado}>
        <span className={styles.iconeErro}>✕</span>
        <p className={styles.textoFase}>{contexto?.mensagemErro || 'Algo deu errado'}</p>
        <button className={styles.botaoTentar} onClick={() => setFase('aguardando')}>
          Tentar novamente
        </button>
      </div>
    );
  }

  if (fase === 'concluido') {
    return (
      <div className={styles.centrado}>
        <span className={styles.iconeConcluido}>✦</span>
        <h2 className={styles.tituloConcluido}>{nomePersonagem}</h2>
        <p className={styles.textoFase}>está pronto para cavalgar</p>
        <button className={styles.botaoConcluir} onClick={handleConcluirPersonagem}>
          Ver Personagem →
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerInfo}>
          <span className={styles.nomePersonagem}>{nomePersonagem}</span>
          <span className={styles.separador}>·</span>
          <span className={styles.sistemaLabel}>{entidade.nome}</span>
        </div>
        {totalEtapas > 0 && (
          <div className={styles.progressoWrapper}>
            <div className={styles.progressoBarra}>
              <div className={styles.progressoFill} style={{ width: `${progresso}%` }} />
            </div>
            <span className={styles.progressoTexto}>{progresso}%</span>
          </div>
        )}
      </header>

      <main className={styles.main}>
        {historico.length > 0 && (
          <div className={styles.historico}>
            {historico.map((h, i) => (
              <div key={i} className={styles.historicoItem}>
                <span className={styles.historicoLabel}>{h.label}</span>
                <span className={styles.historicoValor}>{String(h.resposta)}</span>
              </div>
            ))}
          </div>
        )}

        {fase === 'aguardando' && etapaAtual && (
          <div className={styles.formularioWrapper}>
            <FormularioInput
              etapa={etapaAtual}
              onResponder={handleResponder}
              carregando={carregando}
            />
          </div>
        )}

        {fase === 'rodando' && (
          <div className={styles.centradoInline}>
            <div className={styles.spinner} />
            <span className={styles.textoAux}>Processando...</span>
          </div>
        )}
      </main>
    </div>
  );
}