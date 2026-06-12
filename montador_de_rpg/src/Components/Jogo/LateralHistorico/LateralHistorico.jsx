import { useState } from 'react';
import styles from './styles.LateralHistorico.module.css';
import Historico from '../Historico/Historico.jsx';
import Anotacao from '../../PainelUser/Anotacao/Anotacao.jsx'; // Ferramenta de Anotações para Mestres
import Diario from '../../PainelUser/Diário/Diario.jsx';     // Diário do Jogador (Campanhas/Folhas/Edição)

export default function LateralHistorico({ roleAtiva }) {

   const [abaAtiva, setAbaAtiva] = useState("Chat");
   const [tituloAba, setTituloAba] = useState("Início da Sessão");

   return (
      <>
      <aside className={styles.lateralHistorico}>
         {/* Abas de Navegação Superior */}
         <div className={styles.historicoAbas}>
            <button className={`${styles.historicoAba} ${(abaAtiva === "Chat") && styles.ativo}`} onClick={() => {
               setAbaAtiva("Chat");
               setTituloAba("Início da Sessão");
            }}>Chat</button>

            <button className={`${styles.historicoAba} ${(abaAtiva === "Roll") && styles.ativo}`} onClick={() => {
               setAbaAtiva("Roll");
               setTituloAba("Historico");
            }}>Rolagens</button>

            <button className={`${styles.historicoAba} ${(abaAtiva === "Diario") && styles.ativo}`} onClick={() => {
               setAbaAtiva("Diario");
               setTituloAba("Diario");
            }}>Diário</button>

            {/* Nova Aba Dinâmica de Anotações adicionada ao Menu */}
            <button className={`${styles.historicoAba} ${(abaAtiva === "Anotacoes") && styles.ativo}`} onClick={() => {
               setAbaAtiva("Anotacoes");
               setTituloAba("Anotações");
            }}>Anotações</button>
         </div>

         {/* Área de Exibição do Conteúdo da Aba */}
         {abaAtiva === "Anotacoes" ? (
            <div className={styles.containerAnotacaoDinamica}>
               {roleAtiva === "mestre" ? (
                  /* Renderiza a ferramenta avançada do arquivo Anotacao.jsx se for Mestre */
                  <Anotacao />
               ) : (
                  /* Renderiza o diário focado em sessões do arquivo Diario.jsx se for Jogador */
                  <Diario />
               )}
            </div>
         ) : (
            /* Mantém o comportamento original para Chat, Rolagens e o histórico nativo */
            <Historico aba={abaAtiva} titulo={tituloAba}/>
         )}
      </aside>
      </>
   );
}