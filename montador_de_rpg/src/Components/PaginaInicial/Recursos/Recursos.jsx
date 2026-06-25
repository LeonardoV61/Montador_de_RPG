import { useState } from 'react'
import Recurso from './Recurso'
import styles from './styles.Recursos.module.css'
import { FileText, Map, Dices, NotebookPen, Library, Castle } from 'lucide-react';

export default function Recursos() {

  return (
    <>
    <div className={styles.recursos}>
        <p className={styles.recursosNome}>Recursos</p>
        <h2 className={styles.recursosFrase}>Tudo que sua aventura precisa</h2>
        <p className={styles.recursosDescricao}>Do personagem ao campo de batalha — ferramentas feitas para o Mythic Bastionland, pensadas para escalar.</p>

        <div className={styles.grade}>
            <Recurso
                emoji={<FileText />}
                titulo="Ficha de Personagem"
                texto="Crie e gerencie cavaleiros, atributos, equipamentos e habilidades com uma ficha digital fiel ao sistema."
            />
            <Recurso
                emoji={<Map />}
                titulo="Mapas & Cenas"
                texto="Monte cenas com camadas, tokens e ambientação. Arraste elementos, posicione personagens em tempo real."
            />
            <Recurso
                emoji={<Dices />}
                titulo="Dados Integrados"
                texto="Rolar dados no chat, com histórico visível para todos. Resultados animados, sem aplicativos externos."
            />
            <Recurso
                emoji={<NotebookPen />}
                titulo="Diário da Campanha"
                texto="Registre sessões, NPCs, locais e lore. Um grimório digital vivo que cresce com a aventura."
            />
            <Recurso
                emoji={<Castle />}
                titulo="Mesa Virtual"
                texto="Jogue ao vivo com até 6 jogadores. Chat de voz, texto e ações sincronizadas na mesma tela."
            />
            <Recurso
                emoji={<Library />}
                titulo="Múltiplos Sistemas"
                texto="Construído para crescer. Novos sistemas de RPG poderão ser adicionados modularmente no futuro."
            />
        </div>
    </div>
    </>
  )
}