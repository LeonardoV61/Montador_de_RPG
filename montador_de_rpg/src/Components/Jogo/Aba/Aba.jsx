import { useState } from 'react';
import styles from './styles.Aba.module.css';

export default function Aba(props) {

    const [abaAberta, setAbaAberta] = useState(true);

    return (
        <>
        <div className={styles.aba}>
            <div className={styles.cabecalho} onClick={() => setAbaAberta(!abaAberta)}>
                <span className={styles.cabecalhoTitulo}>{props.titulo}</span>
                <span className={`${styles.cabecalhoSeta} ${abaAberta && styles.aberto}`}>▶</span>
            </div>
            { abaAberta && props.children }
        </div>
        </>
    )
}