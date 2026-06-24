import { useState } from 'react'
import styles from './styles.Footer.module.css'

export default function Footer() {

  return (
    <>
    <footer className={styles.rodape}>
        <p>Projeto Acadêmico · TTRPG Online · 2026</p>
        <div>
            <a href="https://github.com/LeonardoV61/Montador_de_RPG/blob/main/README.md">Sobre</a>
            <a href="https://github.com/LeonardoV61/Montador_de_RPG">GitHub</a>
            <a href="mailto:montadorderpg@gmail.com">Contato</a>
        </div>
    </footer>
    </>
  )
}