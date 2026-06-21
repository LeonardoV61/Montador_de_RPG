import { useState } from 'react';
import styles from './FormularioInput.module.css';

/**
 * Renderiza dinamicamente o campo de input baseado nos parâmetros da etapa.
 *
 * Props:
 *  - etapa: objeto com { tipoEtapa, parametrosEtapa, nome }
 *  - contexto: o ProcedimentoContexto retornado pelo backend
 *  - onResponder: fn(valor) — chama o backend com a resposta
 *  - carregando: boolean
 */
export default function FormularioInput({ etapa, onResponder, carregando }) {
  const params = etapa?.parametrosEtapa || {};
  const [valor, setValor] = useState('');
  const [erro, setErro] = useState('');

  // Opções estáticas definidas na etapa
  const opcoesEstatico = params.opcoes_estatico || null;

  // Título exibido ao usuário
  const titulo = params.campo_pedido || etapa?.nome || 'Responda';

  // Pode pular etapa?
  const podePular = params.pode_passar === true;

  function validar(v) {
    if (!v || String(v).trim() === '') return 'Por favor, preencha este campo.';
    return '';
  }

  function handleSubmit() {
    if (!opcoesEstatico) {
      const erroVal = validar(valor);
      if (erroVal) { setErro(erroVal); return; }
    }
    setErro('');
    onResponder(valor || null);
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

  // ── Render de opções estáticas (seleção) ──
  if (opcoesEstatico && Array.isArray(opcoesEstatico)) {
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

  // ── Detecção de tipo pelo campo_pedido ou nome ──
  const campoLower = (titulo || '').toLowerCase();
  const isNumero = ['vig', 'cla', 'spi', 'gd', 'guard', 'vigor', 'clarity', 'spirit', 'número', 'numero', 'valor']
    .some(k => campoLower.includes(k));

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