import { useState } from 'react';
import styles from './styles.diario.module.css';

export default function diario(props) {

    return (
        <>
        <div className={styles.diarioRegistro}>
            <div className={styles.diarioRegistroTitulo}>{props.titulo}</div>
            <p className={styles.diarioRegistroTexto}>{props.texto}</p>
            <span className={styles.diarioRegistroEtiqueta}>{props.etiqueta}</span>
        </div>
        </>
    )
}