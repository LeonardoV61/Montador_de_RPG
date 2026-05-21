import { useState } from 'react';
import styles from './styles.navBarJogadores.module.css';

export default function navBarJogadores() {

    return (
        <>
        <div className={styles.jogadores}>
            <div className={`${styles.jogador} ${styles.mestre}`} title="Mestre">GM<div className={styles.online}></div></div>
            <div className={styles.jogador} title="Aldric">AL<div className={styles.online}></div></div>
            <div className={styles.jogador} title="Sena">SE<div className={styles.online}></div></div>
            <div className={`${styles.jogador} ${ausente}`} title="Brennan (ausente)">BR</div>
        </div>
        </>
    )
}