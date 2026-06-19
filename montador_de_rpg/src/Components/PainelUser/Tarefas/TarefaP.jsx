import styles from "./styles.TarefaP.module.css"
export default function TarefaP({ tarefa }){
  return(
    <>
      <li className={tarefa.feito && styles.feito}>{tarefa.descricao}</li>
    </>
  )
}