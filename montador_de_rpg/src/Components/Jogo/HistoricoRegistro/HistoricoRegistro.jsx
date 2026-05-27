import { useState } from 'react';
import styles from './styles.HistoricoRegistro.module.css';

export default function HistoricoRegistro(props) {

   return (
      <>
      <div className={styles.historicoRegistro}>
         <div className={styles.historicoRegistroAssinatura}>
            <span className={`${styles.historicoRegistroAutor} ${(props.autor == "Mestre") && styles.mestre}`}>{props.autor}</span>
            <span className={styles.historicoRegistroHorario}>{props.horario}</span>
         </div>
         <p className={`${styles.historicoRegistroTexto} ${(props.autor == "Mestre") && styles.italico}`}>{props.children}</p>
      </div>
      </>
   )
}