import { useState } from 'react';
import styles from './FormularioInput.module.css';

// ─── helper para extrair faces de "d12", "d6" etc. ───
function parseDado(str) {
  // 1. .trim() remove espaços extras
  // 2. O regex /d(\d+)/i busca por 'd' seguido de números
  // 3. A flag 'i' torna a busca case-insensitive (aceita D ou d)
  const match = str.toString().trim().match(/d(\d+)/i);
  
  // match[1] pegará o valor numérico após o 'd'
  return match ? parseInt(match[1], 10) : 0;
}

// ─── componente interno de rolagem ───
function RolagemDados({ config, onConfirmar }) {
  const [resultados, setResultados] = useState(null);
  const [rolou, setRolou] = useState(false);

  const dados = config?.dados || [];
  const modificador = config?.modificador || 0;

  function rolar() {
    const novos = dados.map(d => {
      const faces = parseDado(d);
      if (faces <= 0) return { dado: d, valor: 0 };
      return { dado: d, valor: Math.floor(Math.random() * faces) + 1 };
    });
    setResultados(novos);
    setRolou(true);
  }

  const total = (resultados || []).reduce((s, r) => s + (r?.valor ?? 0), 0) + modificador;

  return (
    <div className={styles.rolagemContainer}>
      <div className={styles.rolagemDados}>
        {dados.map((d, i) => (
          <div key={i} className={styles.dadoVisual}>
            <span className={styles.dadoTipo}>{d}</span>
            <span className={styles.dadoValor}>
              {resultados && resultados[i] ? resultados[i].valor : '?'}
            </span>
          </div>
        ))}
        {modificador !== 0 && (
          <div className={styles.dadoVisual}>
            <span className={styles.dadoTipo}>+{modificador}</span>
            <span className={styles.dadoValor}>{modificador}</span>
          </div>
        )}
      </div>

      <div className={styles.totalDisplay}>
        Total: <strong>{resultados ? total : '?'}</strong>
      </div>

      <div className={styles.acoes}>
        <button
          className={styles.botaoRolar}
          onClick={rolar}
        >
          {rolou ? 'Rolar novamente' : 'Rolar dados'}
        </button>
        <button
          className={styles.botaoConfirmar}
          onClick={() => onConfirmar(total)}
          disabled={!resultados}
        >
          Confirmar
        </button>
      </div>
    </div>
  );
}

// ─── componente principal ───
export default function FormularioInput({ etapa, onResponder, carregando }) {
  const params = etapa?.parametrosEtapa || {};
  const [valor, setValor] = useState('');
  const [erro, setErro] = useState('');

  const opcoesEstatico = params.opcoes_estatico || null;
  const titulo = params.campoPedido || etapa?.nome || 'Responda';
  const podePular = params.pode_passar === true;
  const rolagemConfig = params.rolagem;

  const campoLower = (titulo || '').toLowerCase();
  const isNumero = ['vig', 'cla', 'spi', 'gd', 'guard', 'vigor', 'clarity', 'spirit', 'número', 'numero', 'valor']
    .some(k => campoLower.includes(k));

  function validar(v) {
    if (!v || String(v).trim() === '') return 'Por favor, preencha este campo.';
    if (isNumero && isNaN(Number(v))) return 'Digite um número válido.';
    return '';
  }

  function handleSubmit() {
    const erroVal = validar(valor);
    if (erroVal) { setErro(erroVal); return; }
    setErro('');
    const resposta = isNumero ? Number(valor) : valor;
    onResponder(resposta);
    setValor('');
  }

  function handleOpcao(opcao) {
    onResponder(opcao);
    setValor('');
  }

  function handlePular() {
    onResponder(null);
    setValor('');
  }

  // ── renderização ─────────────────────────────────────────────────

  // 1. Opções estáticas (seleção)
  if (opcoesEstatico && Array.isArray(opcoesEstatico) && opcoesEstatico.length > 0) {
    return (
      <div className={styles.container}>
        <p className={styles.pergunta}>{titulo}</p>
        <div className={styles.opcoes}>
          {opcoesEstatico.map((op, i) => {
            const label = typeof op === 'object' ? (op.label || op.nome || op.valor || JSON.stringify(op)) : String(op);
            const valorOp = typeof op === 'object' ? (op.valor ?? op.id ?? op) : op;
            return (
              <button
                key={i}
                className={`${styles.opcaoBotao} ${valor === String(valorOp) ? styles.opcaoAtiva : ''}`}
                onClick={() => handleOpcao(valorOp)}
                disabled={carregando}
              >
                <span className={styles.opcaoLabel}>{label}</span>
                {typeof op === 'object' && op.descricao && (
                  <span className={styles.opcaoDesc}>{op.descricao}</span>
                )}
              </button>
            );
          })}
        </div>
        {podePular && (
          <button className={styles.botaoPular} onClick={handlePular} disabled={carregando}>
            Pular esta etapa
          </button>
        )}
      </div>
    );
  }

  // 2. Rolagem de dados
  if (rolagemConfig) {
    return (
      <div className={styles.container}>
        <p className={styles.pergunta}>{titulo}</p>
        <RolagemDados
          config={rolagemConfig}
          onConfirmar={(total) => {
            onResponder(total);
            setValor('');
          }}
        />
        {podePular && (
          <button className={styles.botaoPular} onClick={handlePular} disabled={carregando}>
            Pular esta etapa
          </button>
        )}
      </div>
    );
  }

  // 3. Input numérico ou textual
  return (
    <div className={styles.container}>
      <p className={styles.pergunta}>{titulo}</p>

      {isNumero ? (
        <div className={styles.inputWrapper}>
          <input
            className={styles.input}
            type="number"
            min={0}
            max={999}
            value={valor}
            onChange={e => { setValor(e.target.value); setErro(''); }}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="0"
            disabled={carregando}
            autoFocus
          />
        </div>
      ) : (
        <div className={styles.inputWrapper}>
          <input
            className={styles.input}
            type="text"
            value={valor}
            onChange={e => { setValor(e.target.value); setErro(''); }}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="Sua resposta..."
            disabled={carregando}
            autoFocus
            maxLength={200}
          />
        </div>
      )}

      {erro && <p className={styles.erro}>{erro}</p>}

      <div className={styles.acoes}>
        {podePular && (
          <button className={styles.botaoPular} onClick={handlePular} disabled={carregando}>
            Pular
          </button>
        )}
        <button
          className={styles.botaoConfirmar}
          onClick={handleSubmit}
          disabled={carregando || !valor.trim()}
        >
          {carregando ? <span className={styles.spinner} /> : 'Confirmar'}
        </button>
      </div>
    </div>
  );
}