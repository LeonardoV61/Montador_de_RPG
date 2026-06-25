import { useState } from 'react'
import styles from './styles.Recursos.module.css'

export default function Recurso(props) {

  return (
    <>
    <div className={styles.recurso}>
      <div className={styles.cabecalho}>
        <div className={styles.icone}>{props.emoji}</div>
        <p className={styles.titulo}>{props.titulo}</p>
      </div>
        <p className={styles.texto}>{props.texto}</p>
    </div>
    </>
  )
}