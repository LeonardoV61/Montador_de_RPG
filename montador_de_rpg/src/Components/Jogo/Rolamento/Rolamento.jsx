import { useState } from 'react';
import styles from './styles.Rolamento.module.css';

export default function Rolamento(props) {

   const [resultado, setResultado] = useState("Falha");
   function verificaRolamento(dado, valor, atributo) {
      if(Number(dado.slice(1))==valor) setResultado("Máximo");
      else if(valor>atributo) setResultado("Sucesso");
      else if(valor=1) setResultado("Falha Crítica");
   }

   verificaRolamento(props.dado, props.valor, props.valorAtributo);

   return (
      <>
      <div className={styles.historicoRegistro}>
         <div className={styles.historicoRegistroRolamento}>
            <span className={styles.rolamentoIcone}>{props.icone}</span>
            <div className={styles.rolamentoDescricao}>
               <div className={styles.rolamentoTipo}>{props.autor} · Rolagem de {props.tipo}</div>
               <div className={styles.rolamentoValor}>{props.valor}</div>
               <div className={styles.rolamentoAnalise}>{props.dado} → {props.valor} vs {props.tipo.slice(0, 3).toUpperCase()} {props.valorAtributo} — <strong style={resultado.includes("Falha") ? "color:var(--vermelho)" : "color:var(--dourado)"}>{resultado}</strong></div>
            </div>
         </div>
      </div>
      </>
   )
}