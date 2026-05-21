import { useState } from 'react'
import styles from './styles.menuContexto.module.css'

export default function menuContexto(props) {

  return (
    <>
    <div className={styles.menuContexto} id="menuContexto">
      <div className={styles.menuContextoItem} onclick={() => props.setContextoAberto(false)}>✦ Mover para cá</div>
      <div className={styles.menuContextoItem} onclick={() => props.setContextoAberto(false)}>🎲 Rolar Exploração</div>
      <div className={styles.menuContextoDivisor}></div>
      <div className={styles.menuContextoItem} onclick={() => props.setContextoAberto(false)}>🌫 Revelar Hex</div>
      <div className={styles.menuContextoItem} onclick={() => props.setContextoAberto(false)}>📍 Marcar Local</div>
      <div className={styles.menuContextoDivisor}></div>
      <div className={styles.menuContextoItem} onclick={() => props.setContextoAberto(false)}>📏 Medir Distância</div>
    </div>
    </>
  )
}