import { useState, useContext } from 'react';
import { ChevronRight } from 'lucide-react';
import styles from './styles.Aba.module.css';
import { ContextoAbasPersonagem } from '../../../pages/Jogo/Jogo.jsx';

export default function Aba({ id, titulo, icone, peso = 1, children }) {

    const [aberto, setAberto] = useState(false);
    
    // 2. Mude o que você puxa do contexto: saí a antiga e entra a 'definirAbaAberta'
    const { definirAbaAberta } = useContext(ContextoAbasPersonagem);

    function alternar() {
        setAberto(prev => {
            const novoEstado = !prev;
            // 3. Substitua a linha antiga por essa chamada usando o id da aba
            definirAbaAberta(id, novoEstado);
            return novoEstado;
        });
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