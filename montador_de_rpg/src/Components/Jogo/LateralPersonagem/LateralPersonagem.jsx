import { useState } from 'react';
import styles from './styles.LateralPersonagem.module.css';
import Aba from '../Aba/Aba';
import AbaPersonagem from '../AbaPersonagem/AbaPersonagem';
import AbaInventario from '../AbaInventario/AbaInventario';
import AbaDados from "../AbaDados/AbaDados";

export default function LateralPersonagem() {

   return (
      <>
      <aside className={styles.lateralPersonagem}>
         <Aba titulo="Cavaleiro">
            <AbaPersonagem />
         </Aba>
         <Aba titulo="Inventário">
            <AbaInventario />
         </Aba>
         <Aba titulo="Dados">
            <AbaDados />
         </Aba>
      </aside>
      </>
   )
}