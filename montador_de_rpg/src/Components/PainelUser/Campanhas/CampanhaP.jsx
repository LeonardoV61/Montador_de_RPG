import styles from "./styles.CampanhaP.module.css"
export default function CampanhaP(){
    return(
        <>
          <div className={`${styles.panel} ${styles.large}`}>
            <div className={styles.panelHeader}>
              <h3>MINHAS CAMPANHAS</h3>
              <button>+ Nova Campanha</button>
            </div>

            <div className={styles.campaign}>
              <div>
                <h4>O REINO ARRUINADO</h4>
                <p>Mythic Bastionland • 4 jogadores</p>
              </div>
              <span className={`${styles.status} ${styles.activeStatus}`}>ATIVA</span>
            </div>

            <div className={styles.campaign}>
              <div>
                <h4>CINZAS DA VELHA CIDADE</h4>
                <p>Rune 2e • 3 jogadores</p>
              </div>
              <span className={`${styles.status} ${styles.activeStatus}`}>ATIVA</span>
            </div>

            <div className={styles.campaign}>
              <div>
                <h4>O TEMPLO SUBMERSO</h4>
                <p>OSE • 2 jogadores</p>
              </div>
              <span className={`${styles.status} ${styles.paused}`}>PAUSADA</span>
            </div>
          </div>
        </>
    )
}