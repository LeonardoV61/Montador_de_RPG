import { useContext } from 'react';
import { ChevronRight } from 'lucide-react';
import styles from './styles.Aba.module.css';
// Importamos o contexto unificado de abas
import { ContextoAbasPersonagem } from '../../../pages/Jogo/Jogo.jsx';

export default function Aba({ id, titulo, icone, peso = 1, children }) {
   const contexto = useContext(ContextoAbasPersonagem);

   // 1. Programação defensiva: evita crashes caso o componente fique fora do Provider
   if (!contexto || !id) {
      console.warn(`Aviso: O componente <Aba /> com ID "${id}" está sem contexto ou ID válido.`);
      return null;
   }

   // 2. Extraímos o estado global real e a função modificadora
   const { abasAbertas, definirAbaAberta } = contexto;
   
   // 3. O estado de abertura agora vem 100% da única fonte de verdade (Single Source of Truth)
   const aberto = abasAbertas?.[id] || false;

   function alternar() {
      // Altera diretamente o estado global no Jogo.jsx, refletindo para toda a aplicação de forma limpa
      definirAbaAberta(id, !aberto);
   }

   return (
      <div className={styles.aba} style={{ '--peso': peso }}>
         <div className={`${styles.marcador} ${aberto ? styles.marcadorAberto : ""}`}>
            <button type="button" className={styles.cabecalho} onClick={alternar}>
               <span className={styles.icone}>{icone}</span>
               <span className={styles.titulo}>{titulo}</span>
               <ChevronRight size={14} className={`${styles.chevron} ${aberto ? styles.chevronAberto : ""}`} />
            </button>
            {aberto && (
               <div className={styles.conteudo}>
                  {children}
               </div>
            )}
         </div>
      </div>
   );
}