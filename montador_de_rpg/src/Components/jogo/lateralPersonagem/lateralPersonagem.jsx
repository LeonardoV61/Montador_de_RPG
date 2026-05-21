import { useState } from 'react';
import styles from './styles.lateralPersonagem.module.css';
import aba from '../aba/aba';
import abaPersonagem from '../abaPersonagem/abaPersonagem';
import abaInventario from '../abaInventario/abaInventario';
import abaDados from "../abaDados/abaDados";

export default function lateralPersonagem() {

   return (
      <>
      <aside className={styles.lateralPersonagem}>
         <aba titulo="Cavaleiro">
            <abaPersonagem />
         </aba>
         <aba titulo="Inventário">
            <abaInventario />
         </aba>
         <aba titulo="Dados">
            <abaDados />
         </aba>
      </aside>
      </>
   )
}