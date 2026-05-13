import { useState } from 'react'
import styles from './Recursos.css'

export default function Recurso(props) {

  return (
    <>
    <div className={styles.recurso}>
        <div className={styles.icone}>{props.emoji}</div>
        <p className={styles.titulo}>{props.titulo}</p>
        <p className={styles.texto}>{props.texto}</p>
    </div>
    </>
  )
}