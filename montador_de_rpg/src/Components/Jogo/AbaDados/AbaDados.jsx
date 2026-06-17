import { useContext } from 'react';
import styles from './styles.AbaDados.module.css';
import { ContextoMesaFisica } from '../../../pages/Jogo/Jogo.jsx';

// FIX: spawn em distribuição circular para não sair da câmera com múltiplos dados
function calcularPosicaoSpawn(indice) {
   const MAX_POR_FILEIRA = 5;
   const ESPACAMENTO = 0.9;

   // Distribui em fileiras: 0~4 na primeira, 5~9 na segunda, etc.
   const coluna = indice % MAX_POR_FILEIRA;
   const fileira = Math.floor(indice / MAX_POR_FILEIRA);

   const larguraFileira = Math.min(indice + 1, MAX_POR_FILEIRA) * ESPACAMENTO;
   const posX = (coluna * ESPACAMENTO) - (larguraFileira / 2) + ESPACAMENTO / 2;
   const posZ = fileira * ESPACAMENTO - 0.2 + (Math.random() * 0.2 - 0.1);

   return [posX, 2.8, posZ];
}

export default function AbaDados() {
   const {
      dadosAtivosNaMesa,
      setDadosAtivosNaMesa,
      tipoRolamento,
      resultado
   } = useContext(ContextoMesaFisica);

   function injetarDadoNaMesa(lados) {
      const idUnico = Date.now() + Math.random();
      const posicao = calcularPosicaoSpawn(dadosAtivosNaMesa.length);
      const novoDado = {
         id: idUnico,
         lados: lados,
         posicao
      };
      setDadosAtivosNaMesa(prev => [...prev, novoDado]);
   }

   return (
      <div className={styles.dados}>
         {/* FIX: d8 adicionado, d10 agora chama lados=10 que tem geometria correta */}
         <div className={styles.dadosLista}>
            <button className={styles.dadoBotao} onClick={() => injetarDadoNaMesa(2)}>Moeda</button>
            <button className={styles.dadoBotao} onClick={() => injetarDadoNaMesa(4)}>d4</button>
            <button className={styles.dadoBotao} onClick={() => injetarDadoNaMesa(6)}>d6</button>
         </div>
         <div className={styles.dadosLista}>
            <button className={styles.dadoBotao} onClick={() => injetarDadoNaMesa(8)}>d8</button>
            <button className={styles.dadoBotao} onClick={() => injetarDadoNaMesa(10)}>d10</button>
            <button className={styles.dadoBotao} onClick={() => injetarDadoNaMesa(12)}>d12</button>
            <button className={styles.dadoBotao} onClick={() => injetarDadoNaMesa(20)}>d20</button>
         </div>

         {resultado && (
            <div className={styles.dadoResultado}>
               {/* FIX: ícone muda conforme tipo de rolamento */}
               <span className={styles.rolamentoIcone}>
                  {tipoRolamento === 'Moeda' ? '🪙' : '🎲'}
               </span>
               <div>
                  <div className={styles.rolamentoTipo}>{tipoRolamento} →</div>
                  <div className={styles.rolamentoValor}>{resultado}</div>
               </div>
            </div>
         )}
      </div>
   );
}