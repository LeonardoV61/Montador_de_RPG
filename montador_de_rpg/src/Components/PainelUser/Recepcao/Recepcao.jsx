import styles from "./styles.Recepcao.module.css"
export default function Recepcao(){
    return(
        <>
          <section className={styles.reception}>
            <h1>BEM-VINDO, HERON</h1>
            <p>
              Você tem uma sessão agendada para amanhã.
              Falta preparar 2 itens.
            </p>
          </section>
        </>
    )
}