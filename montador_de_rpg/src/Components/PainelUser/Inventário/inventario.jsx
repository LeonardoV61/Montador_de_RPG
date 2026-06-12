import { useState } from "react";
import { Search, ShieldAlert, Sword, Coins, Flame, Eye, Package } from "lucide-react";
import styles from "./styles.inventario.module.css";

export default function Inventario() {
  const [abaAtiva, setAbaAtiva] = useState("todos");
  const [busca, setBusca] = useState("");
  const [itemAberto, setItemAberto] = useState(null);

  // Setor conectado: Lista de campanhas sincronizada com os diários e crônicas do jogo
  const campanhasDisponiveis = ["A MALDIÇÃO DE OAKVALE", "O TRONO DESPEDAÇADO"];
  const [campanhaAtiva, setCampanhaAtiva] = useState("A MALDIÇÃO DE OAKVALE");

  // Conexão de moedas por sistema de campanha ativo
  const sistemasMoedas = {
    "A MALDIÇÃO DE OAKVALE": { TQ: 50, TO: 2450, TL: 5 }, 
    "O TRONO DESPEDAÇADO": { PC: 120, PO: 380 }           
  };

  const capacidadeMaxima = 50; 

  const [itensInventario] = useState([
    {
      id: "inv-1",
      campanha: "A MALDIÇÃO DE OAKVALE",
      titulo: "LÂMINA RÚNICA DE VECTARIA EXEMPLAR", 
      subtitulo: "Arma Marcial (Espada Longa)",
      categoria: "Raro",
      tipo: "equipamento",
      descricao: "Forjada sob a influência do Cometa de Éter. Runas azuladas piscam na lâmina e emitem sussurros rítmicos em dialeto celestial antigo.",
      custo: "1.500 TO",
      peso: 2,
      propriedades: "+1 no acerto, causa +1d6 de dano de eletricidade",
    },
    {
      id: "inv-2",
      campanha: "A MALDIÇÃO DE OAKVALE",
      titulo: "POÇÃO DE CURA MAIOR",
      subtitulo: "Consumível Alquímico",
      categoria: "Comum",
      tipo: "consumivel",
      descricao: "Líquido vermelho efervescente com aroma espesso de cereja e ferro. Restaura instantaneamente 3d8+3 Pontos de Vida do usuário.",
      custo: "50 TO",
      peso: 0.5,
    },
    {
      id: "inv-3",
      campanha: "O TRONO DESPEDAÇADO",
      titulo: "ESCUDO DO JURAMENTO QUEBRADO",
      subtitulo: "Escudo Pesado",
      categoria: "Épico",
      tipo: "equipamento",
      descricao: "Pertenceu ao Sir Gareth antes de sua queda trágica. Oferece proteção física estendida e concede vantagem em salvamentos contra profanadores.",
      custo: "3.200 PO", 
      peso: 4,
    }
  ]);

  // Filtro inteligente por conexão de Campanha, Aba de Categoria e Input de busca
  const itensFiltrados = itensInventario.filter((item) => {
    const pertenceCampanha = item.campanha === campanhaAtiva;
    
    const pertenceAba = 
      abaAtiva === "todos" || 
      (abaAtiva === "equipamentos" && item.tipo === "equipamento") || 
      (abaAtiva === "consumiveis" && item.tipo === "consumivel");

    const correspondeBusca = 
      item.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      item.subtitulo.toLowerCase().includes(busca.toLowerCase());

    return pertenceCampanha && pertenceAba && correspondeBusca;
  });

  // Cálculo dinâmico de peso baseado na campanha conectada selecionada
  const pesoAtual = itensInventario
    .filter(item => item.campanha === campanhaAtiva)
    .reduce((acc, curr) => acc + curr.peso, 0);

  const renderizarMoedasCampanha = () => {
    const moedas = sistemasMoedas[campanhaAtiva] || {};
    const obterCorMoeda = (sigla) => {
      if (sigla.includes("O")) return "#d97706"; 
      if (sigla.includes("P") || sigla.includes("L")) return "#cbd5e1"; 
      if (sigla.includes("Q") || sigla.includes("C")) return "#b45309"; 
      return "#a855f7";
    };

    return Object.entries(moedas).map(([sigla, valor]) => (
      <div key={sigla} className={styles.itemMoeda}>
        <Coins size={16} color={obterCorMoeda(sigla)} /> 
        <span>{valor} {sigla}</span>
      </div>
    ));
  };

  if (itemAberto) {
    return (
      <div className={styles.containerGeral}>
        <div className={styles.telaLeituraWiki}>
          <div className={styles.headerLeitura}>
            <button className={styles.btnVoltar} onClick={() => setItemAberto(null)}>
               Voltar ao Arsenal
            </button>
            <span className={styles.badgeCategoriaLeitura}>{itemAberto.categoria}</span>
          </div>
          <div className={styles.corpoLeitura}>
            <h1 className={styles.tituloItemAberto}>{itemAberto.titulo}</h1>
            <p className={styles.subtituloItemAberto}>{itemAberto.subtitulo} • {itemAberto.custo}</p>
            <div className={styles.divisorEstilizado} />
            
            <p className={styles.descricaoCompleta}>{itemAberto.descricao}</p>
            
            {itemAberto.propriedades && (
              <div className={styles.caixaPropriedades}>
                <strong>Propriedades Mágicas/Técnicas:</strong>
                <p>{itemAberto.propriedades}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.containerGeral}>
      {/* SECTOR LATERAL CONECTADO */}
      <aside className={styles.sidebarCampanhas}>
        <div className={styles.labelSecao}>CAMPANHAS ATIVAS</div>
        <div className={styles.listaCampanhasLayout}>
          {campanhasDisponiveis.map((campanha) => (
            <button
              key={campanha}
              className={`${styles.itemCampanhaBtn} ${campanhaAtiva === campanha ? styles.itemCampanhaAtivo : ""}`}
              onClick={() => setCampanhaAtiva(campanha)}
            >
              <Package size={18} className={styles.iconeCampanhaBtn} />
              <span className={styles.nomeCampanhaTexto}>{campanha}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* PAINEL CENTRAL DE CONTEÚDO */}
      <div className={styles.painelPrincipalConteudo}>
        <header className={styles.headerMenu}>
          <div className={styles.blocoInfoEsquerda}>
            <h2 className={styles.tituloPainel}>MOCHILA DE AVENTUREIRO</h2>
            <div className={styles.barraCapacidadeContainer}>
              <span className={styles.textoCapacidade}>Carga: {pesoAtual} / {capacidadeMaxima} Kg</span>
              <div className={styles.trilhoBarra}>
                <div 
                  className={styles.preenchimentoBarra} 
                  style={{ width: `${Math.min((pesoAtual / capacidadeMaxima) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className={styles.grupoMoedas}>
            {renderizarMoedasCampanha()}
          </div>
        </header>

        <div className={styles.areaFiltrosAcoes}>
          <div className={styles.abasTipoFiltro}>
            <button className={`${styles.abaBotao} ${abaAtiva === "todos" ? styles.abaBotaoAtiva : ""}`} onClick={() => setAbaAtiva("todos")}>Todos</button>
            <button className={`${styles.abaBotao} ${abaAtiva === "equipamentos" ? styles.abaBotaoAtiva : ""}`} onClick={() => setAbaAtiva("equipamentos")}>Equipamentos</button>
            <button className={`${styles.abaBotao} ${abaAtiva === "consumiveis" ? styles.abaBotaoAtiva : ""}`} onClick={() => setAbaAtiva("consumiveis")}>Consumíveis</button>
          </div>

          <div className={styles.caixaPesquisaGeral}>
            <Search size={18} className={styles.iconeLupa} />
            <input 
              type="text" 
              placeholder="Buscar itens na mochila..." 
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className={styles.inputFiltroTexto}
            />
          </div>
        </div>

        <div className={styles.containerListaScroll}>
          <div className={styles.gradeItensDoArsenal}>
            {itensFiltrados.length > 0 ? (
              itensFiltrados.map((item) => (
                <div key={item.id} className={styles.cardItemArsenal}>
                  <div className={styles.cardItemCorpoInfo}>
                    <div className={styles.linhaSuperiorCard}>
                      <span className={styles.badgeTipoItem}>
                        {item.tipo === "equipamento" ? <Sword size={14} /> : <Flame size={14} />} {item.tipo.toUpperCase()}
                      </span>
                      <span className={styles.tagPesoItem}>{item.peso} Kg</span>
                    </div>
                    
                    <h3 className={styles.itemTituloArsenal}>{item.titulo}</h3>
                    
                    <div className={styles.blocoFixoRodapeCard}>
                      <p className={styles.itemSubtituloArsenal}>{item.subtitulo} • {item.custo}</p>
                      <button className={styles.btnAbrirLivro} onClick={() => setItemAberto(item)}>
                        <Eye size={16} /> Inspecionar Item
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.caixaAlertaLeitura} style={{ gridColumn: '1/-1' }}>
                <ShieldAlert size={20} />
                <span>Nenhum item localizado na mochila sob este sistema ou campanha.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}