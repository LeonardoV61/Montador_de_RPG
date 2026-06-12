import { useState } from 'react';
import { Sword, Backpack, Dices } from 'lucide-react';
import styles from './styles.LateralPersonagem.module.css';
import Aba from '../Aba/Aba';
import AbaPersonagem from '../AbaPersonagem/AbaPersonagem';
import AbaInventario from '../AbaInventario/AbaInventario';
import AbaDados from "../AbaDados/AbaDados";

export default function LateralPersonagem() {

   const abas = [
      { id: "Cavaleiro", icone: <Sword size={16} />, componente: <AbaPersonagem /> },
      { id: "Inventário", icone: <Backpack size={16} />, componente: <AbaInventario /> },
      { id: "Dados", icone: <Dices size={16} />, componente: <AbaDados /> },
   ];

   const [abaAtiva, setAbaAtiva] = useState(null);

   function alternar(id) {
      setAbaAtiva(prev => prev === id ? null : id);
   }

   const abaAtivaObj = abas.find(a => a.id === abaAtiva);

   return (
      <aside className={styles.lateralPersonagem}>
         <div className={styles.trilho}>
            {abas.map(aba => (
               <Aba
                  key={aba.id}
                  titulo={aba.id}
                  icone={aba.icone}
                  ativo={abaAtiva === aba.id}
                  onClick={() => alternar(aba.id)}
               />
            ))}
         </div>

         <div className={`${styles.painel} ${abaAtiva ? styles.painelAberto : ""}`}>
            {abaAtivaObj && (
               <div className={styles.painelConteudo}>
                  {abaAtivaObj.componente}
               </div>
            )}
         </div>
      </aside>
   )
}