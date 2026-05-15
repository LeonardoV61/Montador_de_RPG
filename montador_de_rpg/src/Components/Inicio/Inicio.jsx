import styles from './styles.Inicio.module.css'

export default function Inicio({ onExplorar }) {
  return (
    <>
    <section className={styles.inicio}>
        <div className={styles.fundo}></div>
        <div className={styles.textContent}>
            <p className={`${styles.nome} ${styles.aparecendo}`}>Mythic Bastionland · TTRPG Online</p>
            <div className={`${styles.ornamento} ${styles.aparecendo}`}>Sua saga começa aqui</div>
            <h1 className={styles.aparecendo}>Forje Lendas<em>sem fronteiras</em></h1>
            <p className={`${styles.texto} ${styles.aparecendo}`}>
            Uma plataforma completa para jogar RPG de mesa online - crie personagens, construa cenas, gerencie mapas e viva aventuras épicas com seus companheiros de jornada.
            </p>
            <div className={`${styles.cta} ${styles.aparecendo}`}>
              <button className={styles.btnDouradoCheio}>Criar personagem ↗</button>
              <button className={styles.btnContorno}>Ver a mesa →</button>
            </div>
        </div>
        <button className={styles.explorar} onClick={onExplorar}>Explorar</button>
    </section>
    </>
  )
}