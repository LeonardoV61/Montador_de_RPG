import { useState } from 'react';
import { useContext } from 'react';
import styles from './styles.avatarPersonagem.module.css';
import contextoAvatar from '../mapa/mapa.jsx';

export default function avatarPersonagem(props) {

    const [avatarSelecionado, setAvatarSelecionado] = useContext(contextoAvatar);

    return (
        <>
        <div className={styles.avatarPersonagem} style="left:0;top:0" onclick={() => setAvatarSelecionado(props.nome)}>
            <div className={`${styles.avatarPersonagemBorda} ${(props.tipo != "npc") && styles[props.tipo]} ${(avatarSelecionado == props.nome) && styles.selecionado}`}>{props.icone}
                <div className={styles.avatarPersonagemHPBarra}>
                    <div className={`${styles.avatarPersonagemHPNivel} ${(props.porcentagemHP<50) && styles.baixo}`} style={`width:${props.porcentagemHP}%`}></div>
                </div>
            </div>
            <div className={styles.avatarPersonagemNome}>{props.nome}</div>
        </div>
        </>
    )
}