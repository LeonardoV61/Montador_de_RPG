import { useState } from 'react';
import NavBarJogadores from '../NavBarJogadores/NavBarJogadores';
import styles from './styles.NavBarJogo.module.css';

export default function NavBarJogo({ roleAtiva }) {

   const [abaAtiva, setAbaAtiva] = useState("Mapa");

   return (
      <>
      <header className={styles.navBar}>
         <div className={styles.logo}><div className={styles.logoSimbolo}><span>✦</span></div>Bastionland</div>
         <div className={styles.titulo}><div className={styles.pontoAtivo}></div>Sessão IV · A Marcha do Bastião Perdido</div>
         <NavBarJogadores />
         <div className={styles.botoes}>
            {roleAtiva == "mestre" ? (
               <button className={`${styles.botao} ${(abaAtiva == "Mapa") && styles.ativo}`} onClick={() => setAbaAtiva("Mapa")}>Mapa</button>
            ):null}
            <button className={`${styles.botao} ${(abaAtiva == "Config") && styles.ativo}`} onClick={() => setAbaAtiva("Config")}>⚙</button>
         </div>
      </header>
      </>
   )
}