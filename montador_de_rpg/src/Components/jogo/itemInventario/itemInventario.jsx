import { useState } from 'react';
import styles from './styles.itemInventario.module.css';

export default function itemInventario(props) {

    return (
        <>
        <div className={styles.inventarioItem}>
            <div className={styles.inventarioItemIcone}>{props.icone}</div>
            <span className={styles.inventarioItemNome}>{props.nome}</span>
            <span className={styles.inventarioItemInfo}>{props.info}</span>
        </div>
        </>
    )
}