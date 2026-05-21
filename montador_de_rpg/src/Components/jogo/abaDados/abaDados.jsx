import { useState } from 'react';
import { useContext } from 'react';
import styles from './styles.abaDados.module.css';
import contextoRegistros from '../jogo/jogo.jsx';

export default function abaDados() {

    const [tipoRolamento, setTipoRolamento] = useState("Aguardando rolagem");
    const [resultado, setResultado] = useState(false);

    const [registros, setRegistros] = useContext(contextoRegistros);

    function rolarDado(lados) {
        
        if(lados === 2) {
            setTipoRolamento("Cara ou Coroa →");
            setResultado(Math.floor(Math.random() * 2) ? "Cara" : "Coroa");
        }
        else {
            setTipoRolamento('d' + lados + ' →');
            setResultado(Math.floor(Math.random() * lados) + 1);
        }
        
        setRegistros(...registros,
        {
            "aba": "Roll",
            "icone": "🎲",
            "autor": "VOCÊ",
            "tipo": tipoRolamento,
            "valor": resultado,
            "dado": tipoRolamento,
            "valorAtributo": false
        });
    }

    return (
        <>
        <div className={`${styles.dados}`}>
            <div className={styles.dadosLista}>
                <button className={styles.dadoBotao} onclick={() => rolarDado(2)}>Moeda</button>
                <button className={styles.dadoBotao} onclick={() => rolarDado(4)}>d4</button>
                <button className={styles.dadoBotao} onclick={() => rolarDado(6)}>d6</button>
            </div>
            <div className={styles.dadosLista}>
                <button className={styles.dadoBotao} onclick={() => rolarDado(10)}>d10</button>
                <button className={styles.dadoBotao} onclick={() => rolarDado(12)}>d12</button>
                <button className={styles.dadoBotao} onclick={() => rolarDado(20)}>d20</button>
            </div>
            <div className={styles.dadoResultado}>
                <span className={styles.rolamentoIcone}>🎲</span>
                <div style="flex:1">
                    <div className={styles.rolamentoTipo}>{tipoRolamento}</div>
                    {resultado && <div className={styles.rolamentoValor}>{resultado}</div>}
                </div>
            </div>
        </div>
        </>
    )
}