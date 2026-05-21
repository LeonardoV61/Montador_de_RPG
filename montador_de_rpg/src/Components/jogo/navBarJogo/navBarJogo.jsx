import { useState } from 'react';
import navBarJogadores from '../navBarJogadores/navBarJogadores';
import styles from './styles.navBarJogo.module.css';

export default function navBarJogo() {

   const [abaAtiva, setAbaAtiva] = useState("Mapa");

   return (
      <>
      <header className={styles.navBar}>
         <div className={styles.logo}><div className={styles.logoSimbolo}><span>✦</span></div>Bastionland</div>
         <div className={styles.titulo}><div className={styles.pontoAtivo}></div>Sessão IV · A Marcha do Bastião Perdido</div>
         <div className={styles.botoes}>
            <button className={`${styles.botao} ${(abaAtiva == "Mapa") && styles.ativo}`} onclick={() => setAbaAtiva("Mapa")}>Mapa</button>
            <button className={`${styles.botao} ${(abaAtiva == "Notas") && styles.ativo}`} onclick={() => setAbaAtiva("Notas")}>Notas</button>
            <button className={`${styles.botao} ${(abaAtiva == "Fichas") && styles.ativo}`} onclick={() => setAbaAtiva("Fichas")}>Fichas</button>
            <button className={`${styles.botao} ${(abaAtiva == "Config") && styles.ativo}`} onclick={() => setAbaAtiva("Config")}>⚙</button>
         </div>
         <navBarJogadores />
      </header>
      </>
   )
}