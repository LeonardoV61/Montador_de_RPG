import { useState } from 'react';
import styles from './styles.ItemInventario.module.css';

export default function ItemInventario(props) {

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