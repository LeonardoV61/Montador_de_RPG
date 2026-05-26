import { useState } from 'react';
import styles from './styles.LateralHistorico.module.css';
import Historico from '../Historico/Historico';

export default function LateralHistorico() {

   const [abaAtiva, setAbaAtiva] = useState("Chat");
   const [tituloAba, setTituloAba] = useState("Início da Sessão")

   return (
      <>
      <aside className={styles.lateralHistorico}>
         <div className={styles.historicoAbas}>
            <button className={`${styles.historicoAba} ${(abaAtiva == "Chat") && styles.ativo}`} onClick={() => {
               setAbaAtiva("Chat");
               setTituloAba("Início da Sessão")
            }}>Chat</button>
            <button className={`${styles.historicoAba} ${(abaAtiva == "Roll") && styles.ativo}`} onClick={() => {
               setAbaAtiva("Roll");
               setTituloAba("Historico");
            }}>Rolagens</button>
            <button className={`${styles.historicoAba} ${(abaAtiva == "Diario") && styles.ativo}`} onClick={() => {
               setAbaAtiva("Diario");
               setTituloAba("Diario");
            }}>Diário</button>
         </div>
         <historico aba={abaAtiva} titulo={tituloAba}/>
      </aside>
      </>
   )
}