import { useState } from 'react';
import styles from './styles.aba.module.css';

export default function aba(props) {

    const [abaAberta, setAbaAberta] = useState(true);

    return (
        <>
        <div className={styles.aba}>
            <div className={styles.cabecalho} onclick={() => setAbaAberta(!abaAberta)}>
                <span className={styles.cabecalhoTitulo}>{props.titulo}</span>
                <span className={`${styles.cabecalhoSeta} ${abaAberta && styles.aberto}`}>▶</span>
            </div>
            { abaAberta && props.children }
        </div>
        </>
    )
}