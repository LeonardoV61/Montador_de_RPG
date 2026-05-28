import styles from "./styles.AmigoP.module.css"
export default function AmigoP(){
    return(
        <>
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <h3>JOGADORES ONLINE</h3>
              <span>5 online</span>
            </div>
            <ul className={styles.list}>
              <li>Erik Guilherme</li>
              <li>Leonardo ProPlayer</li>
              <li>Lucas Carril</li>
              <li>Oséias Augusto</li>
              <li>Vinícius Lemos</li>
            </ul>
          </div>
        </>
    )
}