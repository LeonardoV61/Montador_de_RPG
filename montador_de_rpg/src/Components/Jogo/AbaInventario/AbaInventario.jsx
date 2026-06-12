import { useState } from 'react';
import { Sword, Shield, ShieldAlert, Search, Eye, Flame } from 'lucide-react';
import styles from './styles.AbaInventario.module.css';
import ItemInventario from '../ItemInventario/ItemInventario.jsx';

export default function AbaInventario() {
    const [busca, setBusca] = useState("");
    const [itemAberto, setItemAberto] = useState(null);
    
    // Controla os itens equipados por ID
    const [itensEquipados, setItensEquipados] = useState({
        1: true,
        2: true
    });

    const todosOsItens = [
        { 
            id: 1, 
            icone: <Sword size={16} className={styles.corIcone} />, 
            nome: "Espada Longa", 
            info: "1d8",
            categoria: "Arma de Marcial",
            descricao: "Uma espada versátil forjada em aço de alta qualidade, balanceada para combates ágeis.",
            propriedades: "Corte / Perfuração"
        },
        { 
            id: 2, 
            icone: <Shield size={16} className={styles.corIcone} />, 
            nome: "Escudo de Carvalho", 
            info: "+1 ARM",
            categoria: "Escudo",
            descricao: "Feito com camadas de carvalho reforçadas com metal, oferece excelente proteção defensiva.",
            propriedades: "Bloqueio (+1 na CA)"
        },
        { 
            id: 3, 
            icone: <ShieldAlert size={16} className={styles.corIcone} />, 
            nome: "Elmo de Ferro", 
            info: "ARM 1",
            categoria: "Armadura Pesada",
            descricao: "Um elmo robusto que protege contra golpes cranianos crueis, sacrificando um pouco da audição.",
            propriedades: "Proteção de Cabeça"
        },
    ];

    const alternarEquipamento = (e, id) => {
        e.stopPropagation(); // Impede o clique de abrir os detalhes do item
        setItensEquipados(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const itensFiltrados = todosOsItens.filter(item => 
        item.nome.toLowerCase().includes(busca.toLowerCase())
    );

    return (
        <div className={styles.containerAbasInterno}>
            {/* BARRA DE BUSCA COMPACTA NO TOPO */}
            <div className={styles.cabecalhoInventario}>
                <div className={styles.caixaPesquisaGeral}>
                    <Search size={14} className={styles.iconeLupa} />
                    <input 
                        type="text" 
                        placeholder="Buscar item..." 
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        className={styles.inputFiltroTexto}
                    />
                </div>
            </div>

            {/* LISTA DO INVENTÁRIO */}
            <div className={styles.abaInventario}>
                {itensFiltrados.map((item) => {
                    const equipado = !!itensEquipados[item.id];
                    return (
                        <div 
                            key={item.id} 
                            className={`${styles.cardItemMochila} ${equipado ? styles.cardEquipado : ""}`}
                            onClick={() => setItemAberto(itemAberto?.id === item.id ? null : item)}
                        >
                            {/* Componente original */}
                            <div className={styles.itemLayoutOriginal}>
                                <ItemInventario icone={item.icone} nome={item.nome} info={item.info}/>
                            </div>
                            
                            {/* Botão de ação minimalista posicionado perfeitamente à direita */}
                            <button 
                                className={`${styles.btnAcaoMochila} ${equipado ? styles.btnMochilaDesequipar : styles.btnMochilaEquipar}`}
                                onClick={(e) => alternarEquipamento(e, item.id)}
                            >
                                {equipado ? "Desequipar" : "Equipar"}
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* MODAL CORRIGIDO: CARD FLUTUANTE ESTILIZADO DE VERDADE */}
            {itemAberto && (
                <div className={styles.cardDetalhesPopup}>
                    <div className={styles.headerPopup}>
                        <div className={styles.tituloAgrupado}>
                            {itemAberto.icone}
                            <span className={styles.tituloPopupNome}>{itemAberto.nome}</span>
                        </div>
                        <button className={styles.btnFecharPopup} onClick={() => setItemAberto(null)}>✕</button>
                    </div>
                    
                    <div className={styles.corpoPopup}>
                        <div className={styles.metaPopupInfo}>
                            <span className={styles.badgeCategoria}>{itemAberto.categoria}</span>
                            <span className={styles.atributoBadge}>{itemAberto.info}</span>
                        </div>
                        <div className={styles.divisorPopup} />
                        <p className={styles.descricaoPopupTexto}>{itemAberto.descricao}</p>
                        
                        {itemAberto.propriedades && (
                          <div className={styles.propriedadesContainer}>
                            <span className={styles.propriedadesLabel}>Propriedades:</span>
                            <p className={styles.propriedadesTexto}>{itemAberto.propriedades}</p>
                          </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}