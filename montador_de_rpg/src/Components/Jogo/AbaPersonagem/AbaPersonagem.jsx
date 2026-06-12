import { useState } from 'react';
import styles from './styles.AbaPersonagem.module.css';

export default function AbaPersonagem() {
    return (
        <div className={styles.personagemContainer}>
            <div className={styles.personagemHeader}>
                <div className={styles.nome}>Aldric das Ruínas</div>
                <div className={styles.titulo}>O Cavaleiro Errante</div>
            </div>
            
            <div className={styles.divisorEstilizado} />

            <div className={styles.corpoFicha}>
                <div className={styles.gradeAtributos}>
                    <div className={styles.atributo}>
                        <div className={styles.atributoNome}>FOR</div>
                        <div className={styles.atributoValor}>14</div>
                    </div>
                    <div className={styles.atributo}>
                        <div className={styles.atributoNome}>DES</div>
                        <div className={`${styles.atributoValor} ${styles.baixo}`}>8</div>
                    </div>
                    <div className={styles.atributo}>
                        <div className={styles.atributoNome}>VON</div>
                        <div className={styles.atributoValor}>11</div>
                    </div>
                </div>
                
                <div className={styles.atributoHP}>
                    <div className={styles.atributoHPCabecalho}>
                        <span>VITALIDADE</span>
                        <span>8 / 12</span>
                    </div>
                    <div className={styles.atributoHPBarra}>
                        <div className={styles.barraHPNivel}></div>
                    </div>
                </div>

                <div className={styles.atributoGloria}>
                    <span className={styles.atributoGloriaTitulo}>GLÓRIA</span>
                    <div className={styles.atributoGloriaSimbolos}>
                        <div className={`${styles.atributoGloriaSimbolo} ${styles.aceso}`}></div>
                        <div className={`${styles.atributoGloriaSimbolo} ${styles.aceso}`}></div>
                        <div className={`${styles.atributoGloriaSimbolo} ${styles.aceso}`}></div>
                        <div className={styles.atributoGloriaSimbolo}></div>
                        <div className={styles.atributoGloriaSimbolo}></div>
                    </div>
                </div>

                <div className={styles.divisorEstilizado} />

                <div className={styles.secaoEfeitos}>
                    <span className={styles.subtituloSecao}>CONDIÇÕES ATIVAS</span>
                    <div className={styles.efeitos}>
                        <span className={`${styles.efeito} ${styles.ferido}`}>Ferido</span>
                        <span className={`${styles.efeito} ${styles.emGloria}`}>Em Glória</span>
                    </div>
                </div>
            </div>
        </div>
    );
}