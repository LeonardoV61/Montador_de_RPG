import { useState } from 'react';
import styles from './styles.AbaInventario.module.css';
import ItemInventario from '../ItemInventario/ItemInventario.jsx';

export default function AbaInventario() {

    return (
        <>
        <div className={styles.abaInventario}>
            <ItemInventario icone="⚔" nome ="Espada Longa" info="1d8"/>
            <ItemInventario icone="🛡" nome ="Escudo de Carvalho" info="+1 ARM"/>
            <ItemInventario icone="🪖" nome ="Elmo de Ferro" info="ARM 1"/>
            <ItemInventario icone="🏹" nome ="Arco Curto" info="1d6"/>
            <ItemInventario icone="🪔" nome ="Tocha (×3)" info="Luz"/>
        </div>
        </>
    )
}