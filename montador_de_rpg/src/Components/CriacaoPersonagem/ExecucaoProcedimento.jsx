import { useState, useEffect, useCallback, useRef } from 'react';
import { procedimentoService } from '../../services/procedimentoService.js';
import { personagemService } from '../../services/personagemService.js';
import { campanhaService } from '../../services/campanhaService.js';
import { sessaoService } from '../../services/sessaoService.js';
import FormularioInput from './FormularioInput.jsx';
import styles from './ExecucaoProcedimento.module.css';

/**
 * Props:
 *  - sistema: { id, nome }
 *  - entidade: { id, nome, atributos, tipo }
 *  - nomePersonagem: string
 *  - usuarioId: number
 *  - campanhaAtivaId?: number | null
 *  - onConcluido: fn(personagem)
 *  - onErro: fn(mensagem)
 */
export default function ExecucaoProcedimento({
  sistema,
  entidade,
  nomePersonagem,
  usuarioId,
  campanhaAtivaId = null,
  onConcluido,
  onErro,
}) {
  const [fase, setFase] = useState('iniciando');
  const [contexto, setContexto] = useState(null);
  const [etapaAtual, setEtapaAtual] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [personagemCriado, setPersonagemCriado] = useState(null);

  const tempIdsRef = useRef({ campanha: null, sessao: null });
  const idSessaoRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      limparTemporarios(tempIdsRef.current);
    };
  }, []);

  async function limparTemporarios({ campanha, sessao }) {
    if (sessao) {
      try { await sessaoService.encerrar(sessao); }
      catch (e) { console.error(e); }
    }
    if (campanha) {
      try { await campanhaService.deletar(campanha); }
      catch (e) { console.error(e); }
    }
  }

  useEffect(() => {
    iniciar();
  }, []);

  async function iniciar() {
    const temporarios = { campanha: null, sessao: null };
    tempIdsRef.current = temporarios;

    try {
      setFase('iniciando');

      // 1. Obter ou criar campanha
      let idCampanha = campanhaAtivaId;
      if (!idCampanha) {
        const novaCamp = await campanhaService.criar({
          nome: `Temp-Char-${Date.now()}`,
          sistemaId: sistema.id,
          criadorId: usuarioId,
        });
        idCampanha = novaCamp.data.id;
        temporarios.campanha = idCampanha;
      }

      // 2. Iniciar sessão temporária
      const sessaoResp = await sessaoService.iniciar(idCampanha);
      const idSessao = sessaoResp.data.id;
      temporarios.sessao = idSessao;
      idSessaoRef.current = idSessao;

      // 3. Criar personagem
      const atributosIniciais = entidade.atributos || {};
      const personagem = await personagemService.criarCompleto({
        usuarioId,
        campanhaId: idCampanha,
        entidadeSistemaId: entidade.id,
        tipo: entidade.tipo || entidade.nome,
        nome: nomePersonagem,
        atributosAtuais: atributosIniciais,
      });
      setPersonagemCriado(personagem);

      // 4. Buscar procedimento de criação
      const procedimentos = await procedimentoService.listar(sistema.id);
      const procCriacao = procedimentos.find(
        (p) => p.tipo === 'CRIACAO_PERSONAGEM'
      );

      if (!procCriacao) {
        throw new Error('Nenhum procedimento de criação encontrado para este sistema.');
      }

      // 5. Iniciar procedimento — NÃO limpa no finally, sessão ainda é necessária
      const ctx = await procedimentoService.iniciarComInstancia(
        procCriacao.id,
        idSessao,
        personagem.instanciaId
      );

      processarContexto(ctx);

    } catch (e) {
      // Só limpa se falhou na inicialização
      await limparTemporarios(temporarios);
      tempIdsRef.current = { campanha: null, sessao: null };

      if (mountedRef.current) {
        setFase('erro');
        onErro?.(e.message || 'Erro ao iniciar a criação.');
      }
    }
    // ✅ Sem finally de limpeza — sessão precisa continuar viva durante o procedimento
  }

  const processarContexto = useCallback((ctx) => {
    if (!mountedRef.current) return;
    setContexto(ctx);

    const status = ctx?.status || ctx?.estadoAtual;

    if (status === 'CONCLUIDO' || status === 'FINALIZADO') {
      limparTemporarios(tempIdsRef.current).then(() => {
        tempIdsRef.current = { campanha: null, sessao: null };
      });
      setFase('concluido');
      return;
    }

    if (status === 'ERRO') {
      limparTemporarios(tempIdsRef.current).then(() => {
        tempIdsRef.current = { campanha: null, sessao: null };
      });
      setFase('erro');
      onErro?.(ctx?.mensagemErro || 'Erro no procedimento.');
      return;
    }

    if (status === 'AGUARDANDO_INPUT') {
      const etapa = ctx?.etapaAtual || ctx?.etapa;
      setEtapaAtual(etapa);
      setFase('aguardando');
      return;
    }

    setFase('rodando');
  }, [onErro]);

  async function handleResponder(resposta) {
    if (carregando) return;
    setCarregando(true);

    if (etapaAtual) {
      const label = etapaAtual.parametrosEtapa?.campo_pedido || etapaAtual.nome || 'Etapa';
      setHistorico((h) => [...h, { label, resposta: resposta ?? '—' }]);
    }

    try {
      // ⚠️ Endpoint /responder ainda não existe no back-end
      throw new Error('Funcionalidade de resposta ainda não implementada no servidor.');

      // const ctx = await procedimentoService.responder(idSessaoRef.current, resposta);
      // processarContexto(ctx);
    } catch (e) {
      await limparTemporarios(tempIdsRef.current);
      tempIdsRef.current = { campanha: null, sessao: null };
      setFase('erro');
      onErro?.(e.message || 'Erro ao enviar resposta.');
    } finally {
      setCarregando(false);
    }
  }

  async function handleConcluirPersonagem() {
    await limparTemporarios(tempIdsRef.current);
    tempIdsRef.current = { campanha: null, sessao: null };
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
        <p className={styles.textoFase}>Algo deu errado</p>
        <button className={styles.botaoTentar} onClick={iniciar}>
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
        <button
          className={styles.botaoConcluir}
          onClick={handleConcluirPersonagem}
        >
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
              <div
                className={styles.progressoFill}
                style={{ width: `${progresso}%` }}
              />
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