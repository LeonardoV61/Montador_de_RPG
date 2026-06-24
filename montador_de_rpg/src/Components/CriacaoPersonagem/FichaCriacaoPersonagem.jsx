import { useState, useEffect, useRef } from 'react';
import { procedimentoService } from '../../services/procedimentoService.js';
import { personagemService } from '../../services/personagemService.js';
import { campanhaService } from '../../services/campanhaService.js';
import { sessaoService } from '../../services/sessaoService.js';
import styles from './FichaCriacao.module.css';

// Mapeamento chave do procedimento -> campo da ficha
const MAPEAMENTO = {
  start_type: 'inicio',
  valor_vig: 'VIG',
  valor_cla: 'CLA',
  valor_spi: 'SPI',
  valor_gd: 'GD',
  gloria: 'gloria',
  // nome não vem do procedimento, será preenchido antes
};

export default function FichaCriacaoPersonagem({ sistema, usuarioId, onConcluido, onErro }) {
  const [fase, setFase] = useState('iniciando'); // iniciando | preenchendo | rodando | concluido | erro
  const [atributos, setAtributos] = useState({});
  const [campoAtivo, setCampoAtivo] = useState(null);
  const [opcoes, setOpcoes] = useState(null);
  const [rolagemConfig, setRolagemConfig] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [personagemCriado, setPersonagemCriado] = useState(null);
  const [nomePersonagem, setNomePersonagem] = useState('');
  // const [inicio, setInicio] = useState('');

  const tempIdsRef = useRef({ campanha: null, sessao: null });
  const idSessaoRef = useRef(null);
  const procedimentoIdRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    iniciarProcedimento();
  }, []);

  async function iniciarProcedimento() {
    const temp = { campanha: null, sessao: null };
    tempIdsRef.current = temp;
    try {
      setFase('iniciando');

      const rCamp = await campanhaService.criarTemporariaComSessao(sistema.id);
      const idCampanha = rCamp?.data?.campanhaId ?? rCamp?.campanhaId;
      const idSessao = rCamp?.data?.sessaoId ?? rCamp?.sessaoId;
      if (!idCampanha || !idSessao) throw new Error('IDs não retornados');
      temp.campanha = idCampanha;
      temp.sessao = idSessao;
      idSessaoRef.current = idSessao;

      // Busca a entidade "jogador" do sistema
      const entidades = await personagemService.listarEntidadesPorSistema(sistema.id);
      const jogador = entidades.find(e => e.tipo === 'jogador');
      if (!jogador) throw new Error('Entidade jogador não encontrada');

      // Inicializa atributos com padrões
      const defaults = {};
      if (sistema.schemaAtributos) {
        Object.entries(sistema.schemaAtributos).forEach(([attr, info]) => {
          defaults[attr] = info.tipo === 'int' ? 0 : info.tipo === 'bool' ? false : '';
        });
      }
      setAtributos(defaults);

      const pResp = await personagemService.criarCompleto({
        usuarioId,
        campanhaId: idCampanha,
        entidadeSistemaId: jogador.id,
        tipo: jogador.tipo,
        nome: nomePersonagem || 'Novo Personagem',
        atributosAtuais: defaults,
      });
      const personagem = pResp?.data ?? pResp;
      const instanciaId = personagem?.instanciaId ?? personagem?.id;
      if (!instanciaId) throw new Error('Instância não encontrada');
      setPersonagemCriado(personagem);

      const procs = await procedimentoService.listar(sistema.id);
      const procCriacao = procs.find(p => p.tipo === 'CRIACAO_PERSONAGEM');
      if (!procCriacao) throw new Error('Procedimento de criação não encontrado');
      procedimentoIdRef.current = procCriacao.id;

      const resp = await procedimentoService.iniciarComInstancia(procCriacao.id, idSessao, instanciaId);
      processarCtx(resp?.data ?? resp);
    } catch (e) {
      console.error(e);
      limpar(temp);
      if (mountedRef.current) {
        setFase('erro');
        onErro?.(e.message);
      }
    }
  }

  function processarCtx(ctx) {
    if (!mountedRef.current) return;
    const status = (ctx?.status || '').toUpperCase();
    if (['CONCLUIDO', 'FINALIZADO', 'CONCLUIDA'].includes(status)) {
      limpar(tempIdsRef.current);
      setFase('concluido');
      onConcluido?.(personagemCriado);
      return;
    }
    if (status === 'ERRO') {
      limpar(tempIdsRef.current);
      setFase('erro');
      onErro?.(ctx?.mensagemErro || 'Erro no procedimento');
      return;
    }

    const solicitacao = ctx?.inputSolicitado;
    if (solicitacao) {
      const chave = solicitacao.salvar_em;
      const campo = MAPEAMENTO[chave] || chave;
      setCampoAtivo(campo);
      setOpcoes(solicitacao.opcoes || null);
      setRolagemConfig(solicitacao.rolagem || null);
      setFase('preenchendo');
    } else {
      setFase('rodando');
    }
  }

  async function handleResponder(valor) {
    if (carregando) return;
    setCarregando(true);
    try {
      const resp = await procedimentoService.responder(
        procedimentoIdRef.current,
        idSessaoRef.current,
        valor
      );
      processarCtx(resp?.data ?? resp);
    } catch (e) {
      console.error(e);
      setFase('erro');
    } finally {
      setCarregando(false);
    }
  }

  // function handleNomeConfirmar() {
  //   // A primeira etapa do procedimento provavelmente é start_type, não o nome.
  //   // O nome já foi usado na criação do personagem. Podemos pular.
  //   // Mas se o procedimento pedir o nome, adapte.
  //   // Por enquanto, apenas avance para a primeira solicitação real.
  //   // (No MB, a primeira etapa é escolher tipo de início, então o nome já está definido)
  //   // Não fazemos nada, apenas esperamos o procedimento pedir start_type.
  // }

  function limpar({ campanha }) {
    tempIdsRef.current = { campanha: null, sessao: null };
    if (campanha) {
      campanhaService.deletar(campanha).catch(console.error);
    }
  }

  if (fase === 'iniciando' || fase === 'rodando') {
    return <div className={styles.centrado}><div className={styles.spinner} /> Carregando...</div>;
  }
  if (fase === 'concluido') {
    return (
      <div className={styles.centrado}>
        <h2>Personagem criado!</h2>
        <button onClick={() => onConcluido?.(personagemCriado)}>Ir para Meus Personagens</button>
      </div>
    );
  }
  if (fase === 'erro') {
    return (
      <div className={styles.centrado}>
        <p>Erro na criação. Tente novamente.</p>
        <button onClick={iniciarProcedimento}>Reiniciar</button>
      </div>
    );
  }

  // Render ficha
  return (
    <div className={styles.fichaContainer}>
      <h2>Criação de Personagem – {sistema.nome}</h2>
      <div className={styles.campo} style={{ opacity: campoAtivo === 'nome' ? 1 : 0.5 }}>
        <label>Nome</label>
        <input
          value={nomePersonagem}
          onChange={e => setNomePersonagem(e.target.value)}
          disabled={campoAtivo !== 'nome'}
        />
        {campoAtivo === 'nome' && (
          <button onClick={() => handleResponder(nomePersonagem)}>Confirmar Nome</button>
        )}
      </div>

      <div className={styles.atributosGrid}>
        {Object.entries(atributos).map(([attr, valor]) => {
          const ativo = campoAtivo === attr;
          return (
            <div key={attr} className={`${styles.campo} ${ativo ? styles.ativo : ''}`}>
              <label>{attr}</label>
              {ativo && rolagemConfig ? (
                <RolagemDados config={rolagemConfig} onConfirmar={total => handleResponder(total)} />
              ) : ativo && opcoes ? (
                <select onChange={e => handleResponder(e.target.value)} value={String(valor)}>
                  <option value="">Selecione</option>
                  {opcoes.map(op => <option key={op} value={op}>{op}</option>)}
                </select>
              ) : (
                <input
                  type={typeof valor === 'boolean' ? 'checkbox' : 'number'}
                  checked={typeof valor === 'boolean' ? valor : undefined}
                  value={typeof valor !== 'boolean' ? valor : undefined}
                  disabled={!ativo}
                  onChange={e => {
                    if (typeof valor === 'boolean') handleResponder(e.target.checked);
                    else setAtributos(prev => ({ ...prev, [attr]: e.target.value }));
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
      {campoAtivo && !opcoes && !rolagemConfig && typeof atributos[campoAtivo] !== 'boolean' && (
        <button onClick={() => handleResponder(atributos[campoAtivo])}>Confirmar</button>
      )}
    </div>
  );
}

// Componente de rolagem (simplificado)
function RolagemDados({ config, onConfirmar }) {
  const [resultados, setResultados] = useState(null);
  const dados = config?.dados || [];
  const modificador = config?.modificador || 0;

  function rolar() {
    const novos = dados.map(d => {
      const faces = parseInt(d.replace('d', ''), 10);
      return { dado: d, valor: Math.floor(Math.random() * faces) + 1 };
    });
    setResultados(novos);
  }

  const total = (resultados || []).reduce((s, r) => s + r.valor, 0) + modificador;

  return (
    <div>
      <div style={{ display: 'flex', gap: 10 }}>
        {dados.map((d, i) => (
          <div key={i} style={{ border: '1px solid gold', padding: 5 }}>
            {d} = {resultados ? resultados[i].valor : '?'}
          </div>
        ))}
      </div>
      <p>Total: {resultados ? total : '?'}</p>
      <button onClick={rolar}>Rolar</button>
      <button disabled={!resultados} onClick={() => onConfirmar(total)}>Confirmar</button>
    </div>
  );
}