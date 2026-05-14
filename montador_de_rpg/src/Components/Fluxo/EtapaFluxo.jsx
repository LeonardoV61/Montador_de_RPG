import { useState } from 'react'
import styles from './styles.Fluxo.module.css'

export default function EtapaFluxo(props) {

  return (
    <>
    <div className={styles.etapa}>
        <div className={styles.etapaNum}>{props.num}</div>
        <div className={styles.etapaTexto}>
            <h3>{props.titulo}</h3>
            <p>{props.texto}</p>
        </div>
    </div>
    </>
  )
}