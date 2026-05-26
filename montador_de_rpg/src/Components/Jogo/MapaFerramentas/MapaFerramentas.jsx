import { useState } from 'react';
import styles from './styles.MapaFerramentas.module.css';

export default function MapaFerramentas(props) {

    const [ferramentaAtiva, setFerramentaAtiva] = useState("selecionar");

    return (
        <>
        <div className={styles.mapaFerramentas}>
            <button className={`${styles.mapaFerramenta} ${(ferramentaAtiva == "selecionar") && styles.ativo}`} onClick={() => setFerramentaAtiva("Selecionar")}>↖ Selecionar</button>
            <div className={styles.mapaFerramentasDivisor}></div>
            <button className={`${styles.mapaFerramenta} ${(ferramentaAtiva == "mover") && styles.ativo}`} onClick={() => setFerramentaAtiva("mover")}>✥ Mover</button>
            <button className={`${styles.mapaFerramenta} ${(ferramentaAtiva == "medir") && styles.ativo}`} onClick={() => setFerramentaAtiva("medir")}>📏 Medir</button>
            <button className={`${styles.mapaFerramenta} ${(ferramentaAtiva == "desenhar") && styles.ativo}`} onClick={() => setFerramentaAtiva("desenhar")}>✏ Desenhar</button>
            <button className={`${styles.mapaFerramenta} ${(ferramentaAtiva == "nevoa") && styles.ativo}`} onClick={() => setFerramentaAtiva("nevoa")}>🌫 Névoa</button>
            <div className={styles.mapaFerramentasDivisor}></div>
            <button className={`${styles.mapaFerramenta} ${(ferramentaAtiva == "marcar") && styles.ativo}`} onClick={() => setFerramentaAtiva("marcar")}>📍 Marcar</button>
        </div>
        </>
    )
}