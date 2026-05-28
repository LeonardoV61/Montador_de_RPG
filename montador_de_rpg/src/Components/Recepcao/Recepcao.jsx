import styles from "./styles.Recepcao.module.css"
export default function Recepcao({nome}){
    return(
        <>
          <section className={styles.reception}>
            <h1>BEM-VINDO, {nome}</h1>
            <p>
              Você tem uma sessão agendada para amanhã.
              Falta preparar 2 itens.
            </p>
          </section>
        </>
    )
}