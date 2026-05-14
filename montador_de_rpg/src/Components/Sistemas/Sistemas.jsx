import { useState } from 'react'
import styles from './styles.Sistemas.module.css'

export default function Sistemas() {

  return (
    <>
    <div className={styles.sistemas}>
        <p className={styles.titulo}>Sistemas disponíveis</p>
        <div className={styles.listagem}>
            <span className={styles.sistema}>✦ Mythic Bastionland</span>
            <span className={`${styles.sistema} ${styles.emBreve}`}>+ D&D 5e (em breve)</span>
            <span className={`${styles.sistema} ${styles.emBreve}`}>+ Call of Cthulhu (em breve)</span>
            <span className={`${styles.sistema} ${styles.emBreve}`}>+ Seu sistema favorito…</span>
        </div>
    </div>
    </>
  )
}