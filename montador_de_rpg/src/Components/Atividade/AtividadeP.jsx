import styles from "./styles.AtividadeP.module.css"
export default function AtividadeP(){
    return(
        <>
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <h3>ATIVIDADE RECENTE</h3>
            </div>
            <ul className={styles.list}>
              <li>Oséias atualizou a ficha</li>
              <li>Erik Guilherme criou personagem</li>
              <li>Sessão VII finalizada</li>
            </ul>
          </div>
        </>
    )
}

