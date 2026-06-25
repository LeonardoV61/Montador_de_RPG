import styles from "./styles.Divisor.module.css"
export default function Divisor(props){
    return(
        <>
        <div ref={props.ref} className={styles.divisor}>
            <div className={styles.divisorCentro}></div>
        </div>
        </>
    )
}

