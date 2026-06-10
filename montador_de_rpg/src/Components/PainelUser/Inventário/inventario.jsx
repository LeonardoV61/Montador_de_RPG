import { useState } from "react";
import { Search, ShieldAlert, Sword, Coins, Shield, Flame, Trash2, Eye, CheckCircle, ChevronLeft, Package, UserCheck } from "lucide-react";
import styles from "./styles.inventario.module.css";

export default function Inventario() {
  const [abaAtiva, setAbaAtiva] = useState("todos");
  const [busca, setBusca] = useState("");
  const [itemAberto, setItemAberto] = useState(null);

  // Moedas do Jogador/Grupo
  const [carteira, setCarteira] = useState({ TQ: 50, TO: 2450, TL: 5 }); // Tibares de Cobre, Ouro e Platina
  const capacidadeMaxima = 50; // Peso/Espaço máximo do inventário

  // Estrutura de dados adaptada para Inventário de Personagem/Grupo
  const [itensInventario, setItensInventario] = useState([
    {
      id: "inv-1",
      titulo: "LÂMINA RÚNICA DE VECTARIA",
      subtitulo: "Arma Marcial (Espada Longa)",
      categoria: "Raro",
      tipo: "equipamento",
      descricao: "Forjada sob a influência do Cometa de Éter. Runas azuladas piscam na lâmina.",
      custo: "1.500 TO",
      peso: 2,
      quantidade: 1,
      equipado: true,
      propriedades: "+1 no acerto, causa +1d6 de dano de eletricidade",
      efeitoCompleto: "Esta lâmina canaliza fúria elemental. Uma vez por cena, o portador pode gastar uma ação de movimento para imbuir a arma com eletricidade estática, aumentando a margem de ameaça em +2 contra alvos vestindo armadura metálica."
    },
    {
      id: "inv-2",
      titulo: "POÇÃO DE MANA MAIOR",
      subtitulo: "Consumível (Alquimia)",
      categoria: "Comum",
      tipo: "consumivel",
      descricao: "Um líquido azul efervescente que cheira a menta e estática.",
      custo: "150 TO",
      peso: 0.5,
      quantidade: 4,
      equipado: false,
      propriedades: "Recupera 2d4+2 PM imediatamente ao ser ingerida.",
      efeitoCompleto: "Uma mistura refinada de essência de cristal de mana destilada. Ingerir esta poção requer uma ação padrão. Se consumida durante um descanso curto, duplica a taxa de recuperação natural de mana daquele descanso."
    },
    {
      id: "inv-3",
      titulo: "ESCUDO DA ALVORADA",
      subtitulo: "Equipamento (Escudo Pesado)",
      categoria: "Épico",
      tipo: "equipamento",
      descricao: "Ostenta o brasão do sol nascente. Irradia um calor reconfortante.",
      custo: "3.800 TO",
      peso: 5,
      quantidade: 1,
      equipado: false,
      propriedades: "+3 na Defesa, Resistência a Fogo 5",
      efeitoCompleto: "Abençoado pelos clérigos da luz. Quando o portador realiza uma ação de Defender, todos os aliados adjacentes recebem +1 de bônus na Defesa até o início do próximo turno do portador."
    }
  ]);

  // Calcula o peso total atual carregado no inventário
  const pesoTotal = itensInventario.reduce((acc, item) => acc + (item.peso * item.quantidade), 0);

  function handleAlternarEquipar(id) {
    setItensInventario(itensInventario.map(item => 
      item.id === id ? { ...item, equipado: !item.equipado } : item
    ));
  }

  function handleUsarConsumivel(id) {
    setItensInventario(itensInventario.map(item => {
      if (item.id === id) {
        if (item.quantidade > 1) {
          return { ...item, quantidade: item.quantidade - 1 };
        }
        return null; // Será filtrado abaixo se chegar a zero
      }
      return item;
    }).filter(Boolean));
    
    alert("Item consumido com sucesso!");
  }

  function handleRemoverItem(id) {
    if (confirm("Deseja realmente remover/descartar este item do inventário?")) {
      setItensInventario(itensInventario.filter(item => item.id !== id));
      setItemAberto(null);
    }
  }

  // --- TELA DE INSPEÇÃO COMPLETA DO ITEM (WIKI DESIGN MÁTRICO) ---
  if (itemAberto) {
    // Busca o item atualizado no estado caso ele tenha mudado (ex: equipado/consumido)
    const itemAtual = itensInventario.find(i => i.id === itemAberto.id) || itemAberto;
    
    return (
      <div className={styles.containerGeral}>
        <div className={styles.telaLeituraWiki}>
          
          <div className={styles.headerLeitura}>
            <button className={styles.btnVoltar} onClick={() => setItemAberto(null)}>
              <ChevronLeft size={16} /> Voltar à Algibeira
            </button>
            <div className={styles.tagGrupo}>
              <span className={styles.tagCampanhaLeitura}>{itemAtual.categoria}</span>
              <span className={styles.tagPapelLeitura}>{itemAtual.subtitulo}</span>
              <span className={styles.tagPmLeitura}>{itemAtual.peso} Kg</span>
              {itemAtual.equipado && <span className={styles.tagEquipadoLeitura}>Equipado</span>}
            </div>
          </div>

          <div className={styles.corpoLeitura}>
            <div className={styles.layoutLeituraLivro}>
              
              {/* Ficha Lateral Técnica */}
              <div className={styles.fichaTecnicaMagia}>
                <div className={styles.runaIconWrapper}>
                  {itemAtual.tipo === "equipamento" ? (
                    <Sword size={48} className={styles.runaIconVisual} />
                  ) : (
                    <Flame size={48} className={styles.runaIconVisual} />
                  )}
                </div>
                <div className={styles.atributosGrid}>
                  <div><strong>Propriedades Especiais:</strong> <p>{itemAtual.propriedades}</p></div>
                  <div><strong>Quantidade em Posse:</strong> <p>x{itemAtual.quantidade}</p></div>
                  <div><strong>Valor Estimado:</strong> <p>{itemAtual.custo}</p></div>
                </div>
                
                {/* Ações dentro da Ficha de Inspeção */}
                <div className={styles.botoesAcaoFicha}>
                  {itemAtual.tipo === "equipamento" ? (
                    <button 
                      className={`${styles.btnFichaAcao} ${itemAtual.equipado ? styles.btnDesequipar : styles.btnEquipar}`}
                      onClick={() => handleAlternarEquipar(itemAtual.id)}
                    >
                      <UserCheck size={14} /> {itemAtual.equipado ? "Desequipar" : "Equipar Item"}
                    </button>
                  ) : (
                    <button className={`${styles.btnFichaAcao} ${styles.btnUsar}`} onClick={() => handleUsarConsumivel(itemAtual.id)}>
                      <Flame size={14} /> Usar Consumível
                    </button>
                  )}
                  <button className={`${styles.btnFichaAcao} ${styles.btnDeletar}`} onClick={() => handleRemoverItem(itemAtual.id)}>
                    <Trash2 size={14} /> Descartar do Jogo
                  </button>
                </div>
              </div>
              
              {/* Descrição Detalhada à Direita */}
              <div className={styles.textoLeituraWrapper}>
                <div className={styles.tituloAlinhamento}>
                  <Package size={28} className={styles.iconSelo} />
                  <h1 className={styles.tituloArtigoNpc}>{itemAtual.titulo}</h1>
                </div>
                <div className={styles.divisorEstilizado} />
                <p className={styles.textoLoreNpc}>{itemAtual.efeitoCompleto}</p>
                
                <div className={styles.caixaAlertaLeitura}>
                  <Shield size={18} />
                  <span>Item integrado à carga geral de atributos físicos da sua ficha de personagem.</span>
                </div>
              </div>

            </div>
          </div>

          <div className={styles.rodapeProtegido}>
            <span>O Inventário Pessoal calcula dinamicamente penalidades de sobrecarga baseadas nas regras do sistema.</span>
          </div>

        </div>
      </div>
    );
  }

  // Filtros de Inventário
  const itensFiltrados = itensInventario.filter(item => {
    let correspondeAba = true;
    if (abaAtiva === "equipados") correspondeAba = item.equipado;
    if (abaAtiva === "consumiveis") correspondeAba = item.tipo === "consumivel";

    const correspondeBusca = item.titulo.toLowerCase().includes(busca.toLowerCase()) || 
                             item.subtitulo.toLowerCase().includes(busca.toLowerCase()) ||
                             item.categoria.toLowerCase().includes(busca.toLowerCase());
                             
    return correspondeAba && correspondeBusca;
  });

  return (
    <div className={styles.containerGeral}>
      
      {/* HEADER DE SELEÇÃO E FILTROS */}
      <div className={styles.headerMenu}>
        <div className={styles.abasPrincipais}>
          <button 
            className={`${styles.btnAbaPrincipal} ${abaAtiva === "todos" ? styles.abaPrincipalAtiva : ""}`}
            onClick={() => { setAbaAtiva("todos"); setBusca(""); }}
          >
            <Package size={16} /> Todos os Itens
          </button>
          <button 
            className={`${styles.btnAbaPrincipal} ${abaAtiva === "equipados" ? styles.abaPrincipalAtiva : ""}`}
            onClick={() => { setAbaAtiva("equipados"); setBusca(""); }}
          >
            <UserCheck size={16} /> Equipados
          </button>
          <button 
            className={`${styles.btnAbaPrincipal} ${abaAtiva === "consumiveis" ? styles.abaPrincipalAtiva : ""}`}
            onClick={() => { setAbaAtiva("consumiveis"); setBusca(""); }}
          >
            <Flame size={16} /> Consumíveis
          </button>
        </div>

        <div className={styles.buscaWrapper}>
          <Search size={18} className={styles.buscaIcon} />
          <input 
            type="text" 
            placeholder="Buscar na mochila (arma, poção, raro...)" 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
      </div>

      {/* PAINEL GRID */}
      <div className={styles.painelRolavel}>
        <div className={styles.secaoLayout}>
          
          {/* Subheader Interno com Indicador de Carga */}
          <div className={styles.subHeaderInterno}>
            <div>
              <h3>
                {abaAtiva === "todos" && "Algibeira & Mochila de Viagem"}
                {abaAtiva === "equipados" && "Equipamentos Ativos no Corpo"}
                {abaAtiva === "consumiveis" && "Bolsa de Alquimia e Suprimentos"}
              </h3>
              <p>Gerencie seus pertences, armamentos e capacidade de carga ativa</p>
            </div>

            {/* Mostrador de Peso de RPG */}
            <div className={styles.containerCapacidade}>
              <div className={styles.metaCarga}>
                <span>Carga: <strong>{pesoTotal.toFixed(1)}</strong> / {capacidadeMaxima} Kg</span>
              </div>
              <div className={styles.barraProgressoCarga}>
                <div 
                  className={styles.preenchimentoBarra} 
                  style={{ width: `${Math.min((pesoTotal / capacidadeMaxima) * 100, 100)}%`, 
                           backgroundColor: pesoTotal > capacidadeMaxima ? '#ff4d4d' : '#b3924e' }}
                />
              </div>
            </div>
          </div>

          {/* Painel de Moedas Dinâmico */}
          <div className={styles.painelMoedas}>
            <span className={styles.tituloMoedas}>TESOURO DISPONÍVEL:</span>
            <div className={styles.gradeMoedas}>
              <div className={`${styles.moedaBox} ${styles.platina}`}>
                <Coins size={14} /> <span>{carteira.TL} TL</span>
              </div>
              <div className={`${styles.moedaBox} ${styles.ouro}`}>
                <Coins size={14} /> <span>{carteira.TO} TO</span>
              </div>
              <div className={`${styles.moedaBox} ${styles.cobre}`}>
                <Coins size={14} /> <span>{carteira.TQ} TQ</span>
              </div>
            </div>
          </div>

          {/* Grid de Cards baseados no Design Mátrico */}
          <div className={styles.gridLivros}>
            {itensFiltrados.length > 0 ? (
              itensFiltrados.map(item => (
                <div key={item.id} className={`${styles.cardLivro} ${item.equipado ? styles.cardEquipadoBorder : ""}`}>
                  
                  {/* Visual Header do Card */}
                  <div className={styles.capaLivroContainer}>
                    <div className={styles.backgroundRunaVisual} />
                    {item.tipo === "equipamento" ? (
                      <Sword className={styles.imagemCapaIcone} size={40} />
                    ) : (
                      <Flame className={styles.imagemCapaIcone} size={40} />
                    )}
                    <div className={styles.overlayCapa}>
                      <span className={`${styles.badgeCategoriaCapa} ${styles['raridade-' + item.categoria.toLowerCase()] || ""}`}>
                        {item.categoria}
                      </span>
                      {item.equipado && <span className={styles.badgeEquipadoCapa}>PRONTO</span>}
                    </div>
                  </div>

                  <div className={styles.livroInfoCorpo}>
                    <div className={styles.livroMetaHeader}>
                      <span className={styles.livroVersao}>{item.subtitulo}</span>
                      <span className={styles.badgeMana}>
                        {item.peso * item.quantidade} Kg (x{item.quantidade})
                      </span>
                    </div>
                    
                    <h4>{item.titulo}</h4>
                    <p className={styles.descricaoLivroShort} style={{color: '#b3924e', fontStyle: 'italic', marginBottom: '4px'}}>
                      {item.propriedades}
                    </p>
                    <p className={styles.descricaoLivroShort}>{item.descricao}</p>
                    
                    <div className={styles.grupoBotoesCard}>
                      <button className={styles.btnAbrirLivro} onClick={() => setItemAberto(item)}>
                        <Eye size={14} /> Inspecionar
                      </button>
                      
                      {item.tipo === "equipamento" ? (
                        <button 
                          className={`${styles.btnInstalarLivro} ${item.equipado ? styles.btnAtivoAcao : ""}`} 
                          onClick={() => handleAlternarEquipar(item.id)}
                        >
                          <UserCheck size={14} /> {item.equipado ? "Desequipar" : "Equipar"}
                        </button>
                      ) : (
                        <button className={styles.btnInstalarLivro} onClick={() => handleUsarConsumivel(item.id)}>
                          <Flame size={14} /> Usar (1)
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              ))
            ) : (
              <div className={styles.caixaAlertaLeitura} style={{gridColumn: '1/-1'}}>
                <ShieldAlert size={18} />
                <span>Nenhum item localizado na mochila sob estes parâmetros de busca.</span>
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}