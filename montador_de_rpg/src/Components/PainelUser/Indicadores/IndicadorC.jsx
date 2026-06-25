import styles from "./styles.indicadorC.module.css"

export default function IndicadorC({ dados }) {
  const { campanhasAtivas, jogadores, cenasCriadas, sessoesEsteMes, cenasParaPreparar } = dados || {};
  return (
    <section className={styles.cards}>
      <div className={styles.card}>
        <h2>{campanhasAtivas ?? '-'}</h2>
        <span>CAMPANHAS ATIVAS</span>
      </div>
      <div className={styles.card}>
        <h2>{jogadores ?? '-'}</h2>
        <span>JOGADORES</span>
      </div>
      <div className={styles.card}>
        <h2>{cenasCriadas ?? '-'}</h2>
        <span>CENAS CRIADAS</span>
      </div>
      <div className={styles.card}>
        <h2>{sessoesEsteMes ?? '-'}</h2>
        <span>SESSÕES ESTE MÊS</span>
      </div>
      <div className={`${styles.card} ${styles.danger}`}>
        <h2>{cenasParaPreparar ?? '-'}</h2>
        <span>CENAS P/ PREPARAR</span>
      </div>
    </section>
  );
}