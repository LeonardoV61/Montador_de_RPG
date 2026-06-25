import { useState, useContext, useEffect } from 'react';
import styles from './styles.LateralHistorico.module.css';
import Historico from '../Historico/Historico.jsx';
import Anotacao from '../../PainelUser/Anotacao/Anotacao.jsx'; // Ferramenta de Anotações para Mestres
import Diario from '../../PainelUser/Diário/Diario.jsx';     // Diário do Jogador (Campanhas/Folhas/Edição)
import { ContextoAbasPersonagem } from '../../../pages/Jogo/Jogo.jsx';

export default function LateralHistorico({ roleAtiva }) {
   const [abaAtiva, setAbaAtiva] = useState("Chat");
   const [tituloAba, setTituloAba] = useState("Início da Sessão");

   // 1. Puxar a função de avisar o contexto global
   const { definirAbaAberta } = useContext(ContextoAbasPersonagem);
   const anotacoesAberto = abaAtiva === "Anotacoes";

   // 2. Efeito para sincronizar o estado da aba "Anotacoes" com o contexto global
   useEffect(() => {
      definirAbaAberta("Anotacoes", anotacoesAberto);
   }, [anotacoesAberto, definirAbaAberta]);

   return (
      <>
      {/* Placeholder: reserva 280px no fluxo flex, mantendo o .mapa sempre do mesmo tamanho */}
      <div className={styles.lateralPlaceholder}></div>

      {/* Barra real: absoluta, sempre visível, expande para a esquerda por cima do mapa */}
      <aside className={`${styles.lateralHistorico} ${anotacoesAberto ? styles.expandido : ""}`}>
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

            <button className={`${styles.historicoAba} ${(abaAtiva === "Anotacoes") && styles.ativo}`} onClick={() => {
               setAbaAtiva("Anotacoes");
               setTituloAba("Anotações");
            }}>Anotações</button>
         </div>

         {anotacoesAberto ? (
            <div className={`${styles.containerAnotacaoDinamica} modoJogoHistorico`}>
               {roleAtiva === "mestre" ? (
                  <Anotacao modoJogo={true}/>
               ) : (
                  <Diario modoJogo={true}/>
               )}
            </div>
         ) : (
            <div className={styles.historicoConteudo}>
               <Historico aba={abaAtiva} titulo={tituloAba}/>
            </div>
         )}
      </aside>
      </>
   );
}