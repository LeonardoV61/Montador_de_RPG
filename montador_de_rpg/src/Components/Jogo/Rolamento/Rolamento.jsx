import { useState } from 'react';
import styles from './styles.Rolamento.module.css';

export default function Rolamento({registro}) {
   
   //const [resultado, setResultado] = useState("Falha");
   /* function verificaRolamento(dado, valor, atributo) {
      if(Number(dado.slice(1))==valor) setResultado("Máximo");
      else if(valor>atributo) setResultado("Sucesso");
      else if(valor=1) setResultado("Falha Crítica");
   }

   verificaRolamento(registro.dado, registro.valor, registro.valorAtributo); */

   return (
      <>
      <div className={styles.historicoRegistro}>
         <div className={styles.historicoRegistroRolamento}>
            <span className={styles.rolamentoIcone}>{registro.icone}</span>
            <div className={styles.rolamentoDescricao}>
               <div className={styles.rolamentoTipo}>{registro.autor} · Rolagem de {registro.tipo}</div>
               <div className={styles.rolamentoValor}>{registro.valor}</div>
               <div className={styles.rolamentoAnalise}>{registro.dado} → {registro.valor} vs {registro.tipo.slice(0, 3).toUpperCase()} {registro.valorAtributo} — <strong style={{"color": /* registro.resultado.includes("Falha") ? "var(--vermelho)" : */ "var(--dourado)"}}>{/* resultado */}</strong></div>
            </div>
         </div>
      </div>
      </>
   )
}