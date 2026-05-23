import styles from "./styles.indicadorC.module.css"
export default function indicadorC(){
    return(
        <>
          <section className={styles.cards}>
            <div className={styles.card}>
                <h2>3</h2>
                <span>CAMPANHAS ATIVAS</span>
            </div>
            <div className={styles.card}>
                <h2>9</h2>
                <span>JOGADORES</span>
            </div>
            <div className={styles.card}>
                <h2>14</h2>
                <span>CENAS CRIADAS</span>
            </div>
            <div className={styles.card}>
                <h2>8</h2>
                <span>SESSÕES ESTE MÊS</span>
            </div>
            <div className={`${styles.card} ${styles.danger}`}>
                <h2>2</h2>
                <span>ITENS P/ PREPARAR</span>
            </div>
          </section>
        </>
    )
}