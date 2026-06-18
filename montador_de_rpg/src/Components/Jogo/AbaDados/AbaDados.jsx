import { useContext } from 'react';
import styles from './styles.AbaDados.module.css';
import { ContextoMesaFisica } from '../../../pages/Jogo/Jogo.jsx';

function calcularPosicaoSpawn(indice) {
   const MAX_POR_FILEIRA = 5;
   const ESPACAMENTO = 0.9;
   const coluna = indice % MAX_POR_FILEIRA;
   const fileira = Math.floor(indice / MAX_POR_FILEIRA);
   const larguraFileira = Math.min(indice + 1, MAX_POR_FILEIRA) * ESPACAMENTO;
   const posX = (coluna * ESPACAMENTO) - (larguraFileira / 2) + ESPACAMENTO / 2;
   const posZ = fileira * ESPACAMENTO - 0.2 + (Math.random() * 0.2 - 0.1);
   return [posX, 2.8, posZ];
}

export default function AbaDados() {
   const contexto = useContext(ContextoMesaFisica);

   if (!contexto) return null;

   const {
      dadosAtivosNaMesa,
      setDadosAtivosNaMesa,
      resultadosMesa,
      limparMesa
   } = contexto;

   function injetarDadoNaMesa(lados) {
      const idUnico = Date.now() + Math.random();
      const posicao = calcularPosicaoSpawn(dadosAtivosNaMesa?.length || 0);
      const novoDado = { id: idUnico, lados, posicao, lancado: false };
      setDadosAtivosNaMesa(prev => [...(prev || []), novoDado]);
   }

   const arrayResultados = Object.entries(resultadosMesa || {});

   return (
      <div className={styles.dados}>
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
         
         <div className={styles.dadosLista}>
            <button className={styles.dadoBotao} onClick={() => limparMesa?.()} style={{ background: '#381616', color: '#ffadad' }}>
               Limpar Mesa
            </button>
         </div>

         {/* Fix 2: Render aggregated results list sequentially */}
         {arrayResultados.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.4rem' }}>
               {arrayResultados.map(([id, item]) => (
                  <div key={id} className={styles.dadoResultado}>
                     <span className={styles.rolamentoIcone}>{item.icone}</span>
                     <div>
                        <div className={styles.rolamentoTipo}>{item.label} →</div>
                        <div className={styles.rolamentoValor}>{item.valor}</div>
                     </div>
                  </div>
               ))}
            </div>
         )}
      </div>
   );
}