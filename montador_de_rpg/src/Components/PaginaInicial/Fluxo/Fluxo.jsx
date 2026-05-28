import { useState } from 'react'
import EtapaFluxo from './EtapaFluxo'
import styles from './styles.Fluxo.module.css'

export default function Fluxo() {

  return (
    <>
    <div className={styles.fluxo}>
        <p className={styles.fluxoNome}>Fluxo</p>
        <h2 className={styles.fluxoFrase}>Como funciona</h2>
        <p className={styles.fluxoDescricao}>Em poucos passos, sua mesa está pronta para a aventura.</p>

        <div className={styles.etapas}>
            <EtapaFluxo
                num="I"
                titulo="Crie Sua Conta"
                texto="Cadastro rápido. Escolha se você será Mestre ou jogador — cada papel tem seu painel."
            />
            <EtapaFluxo
                num="II"
                titulo="Monte Seu Personagem"
                texto="Use a ficha guiada do Mythic Bastionland. Atributos, cavaleiro, glória e equipamentos — tudo salvo na nuvem."
            />
            <EtapaFluxo
                num="III"
                titulo="O Mestre Prepara a Cena"
                texto="Crie mapas, adicione NPCs, escreva notas secretas. A cena fica pronta antes dos jogadores entrarem."
            />
            <EtapaFluxo
                num="IV"
                titulo="A Aventura Começa"
                texto="Compartilhe o link da mesa. Todos se conectam, a cena aparece e os dados começam a rolar."
            />
        </div>
    </div>
    </>
  )
}