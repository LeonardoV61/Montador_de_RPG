import styles from "./styles.AtividadeP.module.css"
export default function AtividadeP({ atividade }){
  return(
    <>
      <li className={styles.atividade}>{atividade.descricao}
        <span className={styles.momento}>{atividade.momento}</span>
      </li>
    </>
  )
}

