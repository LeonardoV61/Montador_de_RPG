import styles from "./styles.TarefaP.module.css"
export default function TarefaP(){
    return(
        <>
          <div className={`${styles.panel} ${styles.large}`}>
            <div className={styles.panelHeader}>
              <h3>PREPARAÇÃO PARA PRÓXIMA SESSÃO</h3>
            </div>
            <ul className={styles.list}>
              <li className={styles.done}>Escrever resumo da sessão anterior</li>
              <li className={styles.done}>Preparar mapa do templo</li>
              <li>Definir estatísticas dos guardas</li>
              <li>Criar cena de introdução</li>
            </ul>
          </div>
        </>
    )
}