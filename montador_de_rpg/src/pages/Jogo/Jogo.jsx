import { useState, useEffect } from 'react';
import { createContext, useContext } from 'react';
import styles from './styles.Jogo.module.css';
import NavBarJogo from '../../Components/NavBar/navBarG.jsx';
import LateralPersonagem from '../../Components/Jogo/LateralPersonagem/LateralPersonagem.jsx';
import Mapa from '../../Components/Jogo/Mapa/Mapa.jsx';
import LateralHistorico from '../../Components/Jogo/LateralHistorico/LateralHistorico.jsx';

export const ContextoRegistros = createContext(null);
export const ContextoAbasPersonagem = createContext(null);

export default function Jogo() {
   const roleNaSessao = localStorage.getItem("role_sessao_ativa") || "jogador";
   useEffect(() => {
      if(roleNaSessao != null){
         localStorage.removeItem("role_sessao_ativa");
      }
   });
   
   const [registros, setRegistros] = useState([
      {
         "id": 1,
         "aba": "Chat",
         "autor": "Mestre",
         "horario": "20:03",
         "texto": "A estrada de terra leva por colinas cobertas de névoa. Ao norte, picos nevados. A leste, ruínas de um bastião antigo se erguem sobre a pedra."
      },
      {
         "id": 2,
         "aba": "Chat",
         "autor": "Aldric",
         "horario": "20:05",
         "texto": "Examino o hex à minha frente antes de avançar."
      },
      {
         "id": 3,
         "aba": "Roll",
         "icone": "🎲",
         "autor": "Aldric",
         "tipo": "Força",
         "valor": 17,
         "dado": "d20",
         "valorAtributo": 14
      },
      {
         "id": 4,
         "aba": "Chat",
         "autor": "Mestre",
         "horario": "20:08",
         "texto": "Você nota marcas de ferradura recentes no lodo. Cavaleiros passaram aqui hoje."
      },
      {
         "id": 5,
         "aba": "Roll",
         "icone": "🎲",
         "autor": "Sena",
         "tipo": "Dano perfurante",
         "valor": 5,
         "dado": "d6",
         "valorAtributo": false
      },
      {
         "id": 6,
         "aba": "Diario",
         "titulo": "⚔ O Bastião Perdido",
         "texto": "Ruínas ao nordeste. Diz-se que o Selo das Eras está guardado lá dentro.",
         "etiqueta": "Local"
      },
      {
         "id": 7,
         "aba": "Diario",
         "titulo": "📜 O Ancião do Pântano",
         "texto": "Figura misteriosa ao sul. Conhece caminhos secretos entre os hexes.",
         "etiqueta": "NPC"
      },
      {
         "id": 8,
         "aba": "Diario",
         "titulo": "🔑 Objetivo",
         "texto": "Alcançar o Bastião antes do eclipse. Cavaleiros inimigos seguem o mesmo caminho.",
         "etiqueta": "Missão"
      }
   ]);

   const [abasAbertas, setAbasAbertas] = useState({});

   function definirAbaAberta(id, aberto) {
      setAbasAbertas(prev => ({ ...prev, [id]: aberto }));
   }

   return (
      <>
         <NavBarJogo roleAtiva={roleNaSessao}/>
         <ContextoRegistros.Provider value={{ registros, setRegistros }}>
            <ContextoAbasPersonagem.Provider value={{ abasAbertas, definirAbaAberta }}>
               <div className={styles.jogo}>
                  <LateralPersonagem />
                  <Mapa />
                  <LateralHistorico roleAtiva={roleNaSessao} />
               </div>
            </ContextoAbasPersonagem.Provider>
         </ContextoRegistros.Provider>
      </>
   );
}







