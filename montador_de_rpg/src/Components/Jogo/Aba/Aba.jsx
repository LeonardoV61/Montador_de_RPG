import { ChevronRight } from 'lucide-react';
import styles from './styles.Aba.module.css';

export default function Aba({ titulo, icone, ativo, onClick }) {
    return (
        <button type="button" className={`${styles.trilhoBotao} ${ativo ? styles.ativo : ""}`} onClick={onClick}>
            <span className={styles.trilhoIcone}>{icone}</span>
            <span className={styles.trilhoTitulo}>{titulo}</span>
            <ChevronRight size={14} className={`${styles.trilhoChevron} ${ativo ? styles.aberto : ""}`} />
        </button>
    )
}