import { useState } from 'react';
import { createContext, useContext } from 'react';
import styles from './styles.jogo.module.css';
import navBarJogo from '../navBarJogo/navBarJogo.jsx'
import lateralPersonagem from '../lateralPersonagem/lateralPersonagem.jsx'
import mapa from '../mapa/mapa.jsx'
import lateralHistorico from '../lateralHistorico/lateralHistorico.jsx'

const contextoRegistros = createContext(null);

export default function jogo() {

   const [registros, setRegistros] = useState([
      {
         "aba": "Chat",
         "autor": "Mestre",
         "horario": "20:03",
         "texto": "A estrada de terra leva por colinas cobertas de névoa. Ao norte, picos nevados. A leste, ruínas de um bastião antigo se erguem sobre a pedra."
      },
      {
         "aba": "Chat",
         "autor": "Aldric",
         "horario": "20:05",
         "texto": "Examino o hex à minha frente antes de avançar."
      },
      {
         "aba": "Roll",
         "icone": "🎲",
         "autor": "Aldric",
         "tipo": "Força",
         "valor": 17,
         "dado": "d20",
         "valorAtributo": 14
      },
      {
         "aba": "Chat",
         "autor": "Mestre",
         "horario": "20:08",
         "texto": "Você nota marcas de ferradura recentes no lodo. Cavaleiros passaram aqui hoje."
      },
      {
         "aba": "Roll",
         "icone": "🎲",
         "autor": "Sena",
         "tipo": "Dano perfurante",
         "valor": 5,
         "dado": "d6",
         "valorAtributo": false
      },
      {
         "aba": "Diario",
         "titulo": "⚔ O Bastião Perdido",
         "texto": "Ruínas ao nordeste. Diz-se que o Selo das Eras está guardado lá dentro.",
         "etiqueta": "Local"
      },
      {
         "aba": "Diario",
         "titulo": "📜 O Ancião do Pântano",
         "texto": "Figura misteriosa ao sul. Conhece caminhos secretos entre os hexes.",
         "etiqueta": "NPC"
      },
      {
         "aba": "Diario",
         "titulo": "🔑 Objetivo",
         "texto": "Alcançar o Bastião antes do eclipse. Cavaleiros inimigos seguem o mesmo caminho.",
         "etiqueta": "Missão"
      }
   ]);

   return (
      <>
        <navBarJogo />
        <contextoRegistros value={[registros, setRegistros]}>
            <div className={styles.jogo}>
                <lateralPersonagem />
                <mapa />
                <lateralHistorico />
            </div>
        </contextoRegistros>
      </>
   )
}