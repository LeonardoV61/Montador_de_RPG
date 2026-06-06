import { useState, useRef } from "react";
import { Search, ShieldAlert, Sword, Coins, Trophy, Package, Sparkles, PlusCircle, UploadCloud, Eye, CheckCircle, ChevronLeft } from "lucide-react";
import styles from "./styles.Loots.module.css";

export default function Loots() {
  const [abaAtiva, setAbaAtiva] = useState("todos");
  const [busca, setBusca] = useState("");
  const [campanhaAtiva, setCampanhaAtiva] = useState("campanha-1");
  const [itemAberto, setItemAberto] = useState(null);
  
  const fileInputRef = useRef(null);

  // Índices de Campanhas ativas no ecossistema
  const [campanhas] = useState([
    { id: "campanha-1", nome: "Crônicas de Arton: Coração de Rubi" },
    { id: "campanha-2", nome: "O Despertar de Tenebra" }
  ]);

  // Estrutura de dados idêntica à do CodexArcano, adaptada para tesouros
  const [itensLoots, setItensLoots] = useState([
    {
      id: "item-1",
      campanhaId: "campanha-1",
      titulo: "LÂMINA RÚNICA DE VECTARIA",
      subtitulo: "Arma Marcial (Espada Longa)",
      categoria: "Raro",
      descricao: "Forjada sob a influência do Cometa de Éter. Runas azuladas piscam na lâmina quando inimigos mágicos se aproximam.",
      custo: "1.500 TO",
      instalado: true, // Equivalente a "Distribuído/Encontrado"
      externo: false,
      propriedades: "+1 no acerto, causa +1d6 de dano de eletricidade",
      efeitoCompleto: "Esta lâmina canaliza fúria elemental. Uma vez por cena, o portador pode gastar uma ação de movimento para imbuir a arma com eletricidade estática, aumentando a margem de ameaça em +2 contra alvos vestindo armadura metálica."
    },
    {
      id: "item-2",
      campanhaId: "campanha-1",
      titulo: "ANEL DO ÉTER CONCENTRADO",
      subtitulo: "Acessório (Anel)",
      categoria: "Épico",
      descricao: "Uma joia esculpida a partir de um fragmento puro de cristal de mana.",
      custo: "4.200 TO",
      instalado: true,
      externo: false,
      propriedades: "Reduz o custo do primeiro feitiço do dia em -1 PM",
      efeitoCompleto: "O anel pulsa em sincronia com os canais de éter do conjurador. Sempre que o usuário falhar em um teste de resistência mágica, ele pode absorver parte do impacto regenerando 1d4 PM temporários."
    },
    {
      id: "item-3",
      campanhaId: "campanha-2",
      titulo: "MANTO DAS SOMBRAS",
      subtitulo: "Vestimenta",
      categoria: "Lendário",
      descricao: "Tecido com fios extraídos do próprio plano sombrio. Parece absorver a iluminação ao seu redor.",
      custo: "12.000 TO",
      instalado: false, // Disponível para loot futuro
      externo: false,
      propriedades: "Vantagem em testes de Furtividade na escuridão. Concede visão no escuro.",
      efeitoCompleto: "Sob escuridão total, o portador torna-se incorpóreo contra ataques físicos não-mágicos. Ativar a habilidade máxima do manto drena as energias vitais, exigindo um teste de Fortitude (CD 20) para não ficar fatigado."
    },
    {
      id: "item-homebrew-1",
      campanhaId: "campanha-1",
      titulo: "CÁLICE DO VAMPIRO HOMEBREW",
      subtitulo: "Artefato Customizado",
      categoria: "Externo",
      descricao: "Item customizado importado das tabelas comunitárias do mestre.",
      custo: "Variável",
      instalado: true,
      externo: true,
      propriedades: "Armazena essência vital drenada de inimigos caídos.",
      efeitoCompleto: "Este item experimental permite que personagens de alinhamento sombrio curvem as leis da morte. Cada abate acumula 1 carga de Sangue. O mestre deve consultar o PDF customizado anexado para os custos de dissipação."
    }
  ]);

  function handleDistribuirLoot(id) {
    setItensLoots(itensLoots.map(item => item.id === id ? { ...item, instalado: true } : item));
    alert("Tesouro indexado! O loot foi movido para o inventário ativo do grupo.");
  }

  function handleImportarLoot(event) {
    const arquivo = event.target.files[0];
    if (!arquivo) return;

    const novoItem = {
      id: `item-externo-${Date.now()}`,
      campanhaId: campanhaAtiva,
      titulo: arquivo.name.replace(/\.[^/.]+$/, "").toUpperCase(),
      subtitulo: "Artefato Externo",
      categoria: "Externo",
      descricao: "Matriz de propriedades externas adicionada manualmente pelo painel do Mestre.",
      custo: "Consultar Mestre",
      instalado: true,
      externo: true,
      propriedades: "Propriedades brutas lidas do arquivo importado.",
      efeitoCompleto: `Arquivo original de loots: ${arquivo.name}. O pacote de regras customizado foi vinculado à campanha ativa e está disponível para distribuição.`
    };

    setItensLoots([novoItem, ...itensLoots]);
    alert(`Módulo de recompensa "${arquivo.name}" foi injetado nesta campanha!`);
  }

  // --- TELA DE INSPEÇÃO COMPLETA DO ITEM (WIKI DESIGN MÁTRICO) ---
  if (itemAberto) {
    return (
      <div className={styles.containerGeral}>
        <div className={styles.telaLeituraWiki}>
          
          <div className={styles.headerLeitura}>
            <button className={styles.btnVoltar} onClick={() => setItemAberto(null)}>
              <ChevronLeft size={16} /> Voltar ao Arsenal
            </button>
            <div className={styles.tagGrupo}>
              <span className={styles.tagCampanhaLeitura}>{itemAberto.categoria}</span>
              <span className={styles.tagPapelLeitura}>{itemAberto.subtitulo}</span>
              <span className={styles.tagPmLeitura}>{itemAberto.custo}</span>
              {itemAberto.externo && <span className={styles.tagExternoLeitura}>Homebrew</span>}
            </div>
          </div>

          <div className={styles.corpoLeitura}>
            <div className={styles.layoutLeituraLivro}>
              
              {/* Ficha Lateral Técnica */}
              <div className={styles.fichaTecnicaMagia}>
                <div className={styles.runaIconWrapper}>
                  <Sword size={48} className={styles.runaIconVisual} />
                </div>
                <div className={styles.atributosGrid}>
                  <div><strong>Propriedades Básicas:</strong> <p>{itemAberto.propriedades}</p></div>
                  <div><strong>Valor de Mercado:</strong> <p>{itemAberto.custo}</p></div>
                  <div><strong>Origem de Campanha:</strong> <p>{campanhas.find(c => c.id === itemAberto.campanhaId)?.nome || "Geral"}</p></div>
                </div>
              </div>
              
              {/* Descrição Detalhada à Direita */}
              <div className={styles.textoLeituraWrapper}>
                <div className={styles.tituloAlinhamento}>
                  <Trophy size={28} className={styles.iconSelo} />
                  <h1 className={styles.tituloArtigoNpc}>{itemAberto.titulo}</h1>
                </div>
                <div className={styles.divisorEstilizado} />
                <p className={styles.textoLoreNpc}>{itemAberto.efeitoCompleto}</p>
                
                <div className={styles.caixaAlertaLeitura}>
                  <Package size={18} />
                  <span>Modificadores de bônus e perícias calculados automaticamente na ficha do portador.</span>
                </div>
              </div>

            </div>
          </div>

          <div className={styles.rodapeProtegido}>
            <span>O Codex de Recompensas segue as regras de gerenciamento de tesouro estabelecidas pelo Mestre da Mesa.</span>
          </div>

        </div>
      </div>
    );
  }

  // Filtros idênticos ao do CodexArcano
  const lootsFiltrados = itensLoots.filter(item => {
    const naCampanha = item.campanhaId === campanhaAtiva;
    
    let correspondeAba = true;
    if (abaAtiva === "instalados") correspondeAba = item.instalado && !item.externo;
    if (abaAtiva === "externos") correspondeAba = item.externo;
    if (abaAtiva === "todos") correspondeAba = !item.externo;

    const correspondeBusca = item.titulo.toLowerCase().includes(busca.toLowerCase()) || 
                             item.subtitulo.toLowerCase().includes(busca.toLowerCase());
                             
    return naCampanha && correspondeAba && correspondeBusca;
  });

  return (
    <div className={styles.containerGeral}>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: "none" }} 
        accept=".pdf,.json,.txt"
        onChange={handleImportarLoot}
      />

      {/* HEADER DE SELEÇÃO E FILTROS */}
      <div className={styles.headerMenu}>
        <div className={styles.abasPrincipais}>
          <button 
            className={`${styles.btnAbaPrincipal} ${abaAtiva === "todos" ? styles.abaPrincipalAtiva : ""}`}
            onClick={() => { setAbaAtiva("todos"); setBusca(""); }}
          >
            <Sparkles size={16} /> Todos os Itens
          </button>
          <button 
            className={`${styles.btnAbaPrincipal} ${abaAtiva === "instalados" ? styles.abaPrincipalAtiva : ""}`}
            onClick={() => { setAbaAtiva("instalados"); setBusca(""); }}
          >
            <CheckCircle size={16} /> Itens Distribuídos
          </button>
          <button 
            className={`${styles.btnAbaPrincipal} ${abaAtiva === "externos" ? styles.abaPrincipalAtiva : ""}`}
            onClick={() => { setAbaAtiva("externos"); setBusca(""); }}
          >
            <PlusCircle size={16} /> Itens Adicionados
          </button>
        </div>

        <div className={styles.buscaWrapper}>
          <Search size={18} className={styles.buscaIcon} />
          <input 
            type="text" 
            placeholder="Filtrar item, arma ou raridade..." 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
      </div>

      {/* PAINEL GRID */}
      <div className={styles.painelRolavel}>
        <div className={styles.secaoLayout}>
          
          {/* Subheader Interno Dinâmico */}
          <div className={styles.subHeaderInterno}>
            <div>
              <h3>
                {abaAtiva === "todos" && "Almoxarifado Geral de Tesouros"}
                {abaAtiva === "instalados" && "Itens em Posse dos Jogadores"}
                {abaAtiva === "externos" && "Artefatos Homebrew Cadastrados"}
              </h3>
              <p>Gerencie o balanceamento e as recompensas mágicas da sua mesa ativa</p>
            </div>

            {abaAtiva === "externos" && (
              <button className={styles.btnImportar} onClick={() => fileInputRef.current.click()}>
                <UploadCloud size={16} /> Importar Tabela (.json/.pdf)
              </button>
            )}
          </div>

          {/* Filtro por Campanhas Conectadas */}
          <div className={styles.controleCampanhaWrapper}>
            <label htmlFor="select-campanha-modulo" className={styles.metaItem}>CAMPANHA SELECIONADA:</label>
            <select 
              id="select-campanha-modulo"
              className={styles.seletorCampanha}
              value={campanhaAtiva}
              onChange={(e) => setCampanhaAtiva(e.target.value)}
            >
              {campanhas.map(c => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
          </div>

          {/* Grid de Cards Baseados no Design de Magia */}
          <div className={styles.gridLivros}>
            {lootsFiltrados.length > 0 ? (
              lootsFiltrados.map(item => (
                <div key={item.id} className={styles.cardLivro}>
                  
                  {/* Visual Header do Card do Item */}
                  <div className={styles.capaLivroContainer}>
                    <div className={styles.backgroundRunaVisual} />
                    <Sword className={styles.imagemCapaIcone} size={40} />
                    <div className={styles.overlayCapa}>
                      <span className={`${styles.badgeCategoriaCapa} ${styles['raridade-' + item.categoria.toLowerCase()] || ""}`}>
                        {item.categoria}
                      </span>
                    </div>
                  </div>

                  <div className={styles.livroInfoCorpo}>
                    <div className={styles.livroMetaHeader}>
                      <span className={styles.livroVersao}>{item.subtitulo}</span>
                      <span className={styles.badgeMana} style={{color: '#e0a800', background: 'rgba(224,168,0,0.1)', borderColor: 'rgba(224,168,0,0.2)'}}>
                        <Coins size={10} style={{display: 'inline', marginRight: '2px'}}/> {item.custo}
                      </span>
                    </div>
                    
                    <h4>{item.titulo}</h4>
                    <p className={styles.descricaoLivroShort} style={{color: '#b3924e', fontStyle: 'italic', marginBottom: '4px'}}>
                      {item.propriedades}
                    </p>
                    <p className={styles.descricaoLivroShort}>{item.descricao}</p>
                    
                    {item.instalado ? (
                      <button className={styles.btnAbrirLivro} onClick={() => setItemAberto(item)}>
                        <Eye size={14} /> Inspecionar Item
                      </button>
                    ) : (
                      <button className={styles.btnInstalarLivro} onClick={() => handleDistribuirLoot(item.id)}>
                        <Trophy size={14} /> Entregar ao Grupo
                      </button>
                    )}
                  </div>

                </div>
              ))
            ) : (
              <div className={styles.caixaAlertaLeitura} style={{gridColumn: '1/-1'}}>
                <ShieldAlert size={18} />
                <span>Nenhum artefato ou loot localizado sob estes parâmetros nesta campanha.</span>
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}