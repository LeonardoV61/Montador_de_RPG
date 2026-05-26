import { useState } from 'react';
import { useContext } from 'react';
import styles from './styles.AbaDados.module.css';
import { ContextoRegistros } from '../../../pages/Jogo/Jogo.jsx';

export default function AbaDados() {

    const [tipoRolamento, setTipoRolamento] = useState("Aguardando rolagem");
    const [resultado, setResultado] = useState(false);

    const { registros, setRegistros } = useContext(ContextoRegistros);

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
                <button className={styles.dadoBotao} onClick={() => rolarDado(2)}>Moeda</button>
                <button className={styles.dadoBotao} onClick={() => rolarDado(4)}>d4</button>
                <button className={styles.dadoBotao} onClick={() => rolarDado(6)}>d6</button>
            </div>
            <div className={styles.dadosLista}>
                <button className={styles.dadoBotao} onClick={() => rolarDado(10)}>d10</button>
                <button className={styles.dadoBotao} onClick={() => rolarDado(12)}>d12</button>
                <button className={styles.dadoBotao} onClick={() => rolarDado(20)}>d20</button>
            </div>
            <div className={styles.dadoResultado}>
                <span className={styles.rolamentoIcone}>🎲</span>
                <div /* style="flex:1" */>
                    <div className={styles.rolamentoTipo}>{tipoRolamento}</div>
                    {resultado && <div className={styles.rolamentoValor}>{resultado}</div>}
                </div>
            </div>
        </div>
        </>
    )
}