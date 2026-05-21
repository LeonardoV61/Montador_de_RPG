import { useState } from 'react';
import styles from './styles.mapaFerramentas.module.css';

export default function mapaFerramentas(props) {

    const [ferramentaAtiva, setFerramentaAtiva] = useState("selecionar");

    return (
        <>
        <div className={styles.mapaFerramentas}>
            <button className={`${styles.mapaFerramenta} ${(ferramentaAtiva == "selecionar") && styles.ativo}`} onclick={() => setFerramentaAtiva("Selecionar")}>↖ Selecionar</button>
            <div className={styles.mapaFerramentasDivisor}></div>
            <button className={`${styles.mapaFerramenta} ${(ferramentaAtiva == "mover") && styles.ativo}`} onclick={() => setFerramentaAtiva("mover")}>✥ Mover</button>
            <button className={`${styles.mapaFerramenta} ${(ferramentaAtiva == "medir") && styles.ativo}`} onclick={() => setFerramentaAtiva("medir")}>📏 Medir</button>
            <button className={`${styles.mapaFerramenta} ${(ferramentaAtiva == "desenhar") && styles.ativo}`} onclick={() => setFerramentaAtiva("desenhar")}>✏ Desenhar</button>
            <button className={`${styles.mapaFerramenta} ${(ferramentaAtiva == "nevoa") && styles.ativo}`} onclick={() => setFerramentaAtiva("nevoa")}>🌫 Névoa</button>
            <div className={styles.mapaFerramentasDivisor}></div>
            <button className={`${styles.mapaFerramenta} ${(ferramentaAtiva == "marcar") && styles.ativo}`} onclick={() => setFerramentaAtiva("marcar")}>📍 Marcar</button>
        </div>
        </>
    )
}