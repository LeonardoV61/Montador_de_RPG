import { useState } from 'react'
import styles from './NavBar.css'

export default function NavBar() {

  return (
    <>
    <nav>
        <a className={styles.logo} href="#">
            <div><span>✦</span></div>
        </a>
        <div className={styles.links}>
            <a href="#">Como funciona</a>
            <a href="#">Sistemas</a>
            <a href="#">Mesa</a>
            <a className={entrar} href="#">Entrar</a>
        </div>
    </nav>
    </>
  )
}