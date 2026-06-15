import { useState } from 'react';
import styles from './styles.navBarG.module.css';

export default function NavBarJogadores() {

    return (
        <>
        <div className={styles.jogadores}>
            <div className={`${styles.jogador} ${styles.mestre}`} title="Mestre">GM<div className={styles.online}></div></div>
            <div className={styles.jogador} title="Aldric">AL<div className={styles.online}></div></div>
            <div className={`${styles.jogador} ${styles.standby}`} title="Sena">SE<div className={styles.fk}></div></div>
            <div className={`${styles.jogador} ${styles.ausente}`} title="Brennan (ausente)">BR<div className={styles.offline}></div></div>
        </div>
        </>
    )
}