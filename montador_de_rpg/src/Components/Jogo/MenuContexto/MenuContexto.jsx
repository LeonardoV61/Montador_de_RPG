import { useState } from 'react'
import styles from './styles.MenuContexto.module.css'

export default function MenuContexto(props) {

  return (
    <>
    <div className={styles.menuContexto} id="menuContexto">
      <div className={styles.menuContextoItem} onClick={() => props.setContextoAberto(false)}>✦ Mover para cá</div>
      <div className={styles.menuContextoItem} onClick={() => props.setContextoAberto(false)}>🎲 Rolar Exploração</div>
      <div className={styles.menuContextoDivisor}></div>
      <div className={styles.menuContextoItem} onClick={() => props.setContextoAberto(false)}>🌫 Revelar Hex</div>
      <div className={styles.menuContextoItem} onClick={() => props.setContextoAberto(false)}>📍 Marcar Local</div>
      <div className={styles.menuContextoDivisor}></div>
      <div className={styles.menuContextoItem} onClick={() => props.setContextoAberto(false)}>📏 Medir Distância</div>
    </div>
    </>
  )
}