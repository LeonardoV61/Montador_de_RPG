import { useState } from 'react';
import { useContext } from 'react';
import styles from './styles.AvatarPersonagem.module.css';
import { ContextoAvatar } from '../Mapa/Mapa.jsx';

export default function avatarPersonagem(props) {

    const { avatarSelecionado, setAvatarSelecionado } = useContext(ContextoAvatar);

    return (
        <>
        <div className={styles.avatarPersonagem} style={{"left":0,"top":0}} onClick={() => setAvatarSelecionado(props.nome)}>
            <div className={`${styles.avatarPersonagemBorda} ${(props.tipo != "npc") && styles[props.tipo]} ${(avatarSelecionado == props.nome) && styles.selecionado}`}>{props.icone}
                <div className={styles.avatarPersonagemHPBarra}>
                    <div className={`${styles.avatarPersonagemHPNivel} ${(props.porcentagemHP<50) && styles.baixo}`} style={{"width":`${props.porcentagemHP}%`}}></div>
                </div>
            </div>
            <div className={styles.avatarPersonagemNome}>{props.nome}</div>
        </div>
        </>
    )
}