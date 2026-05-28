import { useState } from 'react';
import styles from './styles.NavBarJogadores.module.css';

export default function NavBarJogadores() {

    return (
        <>
        <div className={styles.jogadores}>
            <div className={`${styles.jogador} ${styles.mestre}`} title="Mestre">GM<div className={styles.online}></div></div>
            <div className={styles.jogador} title="Aldric">AL<div className={styles.online}></div></div>
            <div className={styles.jogador} title="Sena">SE<div className={styles.online}></div></div>
            <div className={`${styles.jogador} ${styles.ausente}`} title="Brennan (ausente)">BR</div>
        </div>
        </>
    )
}