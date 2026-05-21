import { useState } from 'react';
import styles from './styles.abaInventario.module.css';
import itemInventario from '../itemInventario/itemInventario.jsx';

export default function abaInventario() {

    return (
        <>
        <div className={styles.abaInventario}>
            <itemInventario icone="⚔" nome ="Espada Longa" info="1d8"/>
            <itemInventario icone="🛡" nome ="Escudo de Carvalho" info="+1 ARM"/>
            <itemInventario icone="🪖" nome ="Elmo de Ferro" info="ARM 1"/>
            <itemInventario icone="🏹" nome ="Arco Curto" info="1d6"/>
            <itemInventario icone="🪔" nome ="Tocha (×3)" info="Luz"/>
        </div>
        </>
    )
}