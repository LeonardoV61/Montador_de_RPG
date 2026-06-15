import styles from './styles.LateralPersonagem.module.css';
import { Sword, Backpack, Dices } from 'lucide-react';
import Aba from '../Aba/Aba';
import AbaPersonagem from '../AbaPersonagem/AbaPersonagem';
import AbaInventario from '../AbaInventario/AbaInventario';
import AbaDados from "../AbaDados/AbaDados";

export default function LateralPersonagem() {
   return (
      <aside className={styles.lateralPersonagem}>
         <Aba id="Cavaleiro" titulo="Cavaleiro" icone={<Sword size={16} />} peso={5}>
            <AbaPersonagem />
         </Aba>
         <Aba id="Inventario" titulo="Inventário" icone={<Backpack size={16} />} peso={4}>
            <AbaInventario />
         </Aba>
         <Aba id="Dados" titulo="Dados" icone={<Dices size={16} />} peso={3}>
            <AbaDados />
         </Aba>
      </aside>
   )
}