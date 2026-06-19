import styles from "./styles.AmigoP.module.css"
export default function AmigoP({ amigo }){
  return(
    <>
        <li className={styles.amigo}>{amigo.nome}
          <div className={`${styles.ponto} ${amigo.online ? styles.online : styles.offline}`}></div>
        </li>
    </>
  )
}