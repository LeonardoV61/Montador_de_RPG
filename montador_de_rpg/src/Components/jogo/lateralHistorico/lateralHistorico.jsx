import { useState } from 'react';
import styles from './styles.lateralHistorico.module.css';
import historico from '../historico/historico';

export default function lateralHistorico() {

   const [abaAtiva, setAbaAtiva] = useState("Chat");
   const [tituloAba, setTituloAba] = useState("Início da Sessão")

   return (
      <>
      <aside className={styles.lateralHistorico}>
         <div className={styles.historicoAbas}>
            <button className={`${styles.historicoAba} ${(abaAtiva == "Chat") && styles.ativo}`} onclick={() => {
               setAbaAtiva("Chat");
               setTituloAba("Início da Sessão")
            }}>Chat</button>
            <button className={`${styles.historicoAba} ${(abaAtiva == "Roll") && styles.ativo}`} onclick={() => {
               setAbaAtiva("Roll");
               setTituloAba("Historico");
            }}>Rolagens</button>
            <button className={`${styles.historicoAba} ${(abaAtiva == "Diario") && styles.ativo}`} onclick={() => {
               setAbaAtiva("Diario");
               setTituloAba("");
            }}>Diário</button>
         </div>
         <historico aba={abaAtiva} titulo={tituloAba}/>
      </aside>
      </>
   )
}