import { useState } from "react";
import { Search, BookOpen, DownloadCloud, CheckCircle, ChevronLeft, Library, Bookmark } from "lucide-react";
import styles from "./styles.Compendio.module.css";

export default function Compendio() {
  const [abaAtiva, setAbaAtiva] = useState("instalados");
  const [busca, setBusca] = useState("");
  
  // Estado para quando um livro é aberto para leitura em tela cheia
  const [livroAberto, setLivroAberto] = useState(null);

  // Mock de dados dos livros com banners (capas)
  const [livros, setLivros] = useState([
    {
      id: "livro-1",
      titulo: "LIVRO DOS JOGADORES",
      versao: "v1.5.0",
      categoria: "Core Rulebook",
      descricao: "As regras essenciais para criação de personagens, perícias, magias e equipamentos fundamentais.",
      bannerUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400", // Substitua pelas imagens reais do seu RPG
      instalado: true,
      sinopse: "Este tomo contém os pilares fundamentais da aventura. Explore raças ancestrais, classes heróicas e mecânicas de combate projetadas para guiar tanto jogadores novatos quanto veteranos pelos caminhos mais sombrios do grimório."
    },
    {
      id: "livro-2",
      titulo: "GUIA DOS MONSTROS ANCESTRAIS",
      versao: "v1.2.1",
      categoria: "Bestiário",
      descricao: "Centenas de criaturas, demônios e feras lendárias com fichas prontas para desafiar seus jogadores.",
      bannerUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400",
      instalado: true,
      sinopse: "Os sussurros nas tavernas eram reais. O Guia dos Monstros reúne a ecologia, fraquezas e perfis de combate das criaturas mais temidas do reino. Ideal para Mestres que desejam povoar suas masmorras com perigos memoráveis."
    },
    {
      id: "livro-3",
      titulo: "CINZAS DE BAROVIA (AVENTURA)",
      versao: "Módulo Oficial",
      categoria: "Campanha",
      descricao: "Uma campanha completa do nível 1 ao 10 ambientada no reino das brumas eternas.",
      bannerUrl: "https://images.unsplash.com/photo-1576872381149-78ef7871f4b8?q=80&w=400",
      instalado: false,
      sinopse: "Um mal antigo desperta além das montanhas. Esta crônica de campanha oferece mapas detalhados, encontros balanceados, NPCs marcantes e ganchos de história sombrios para guiar seu grupo através de uma jornada de horror e sobrevivência."
    },
    {
      id: "livro-4",
      titulo: "TESOUROS & RELÍQUIAS PERDIDAS",
      versao: "Suplemento",
      categoria: "Expansão",
      descricao: "Novo arsenal de itens mágicos, artefatos amaldiçoados e regras de criação de itens para alquimistas.",
      bannerUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=400",
      instalado: false,
      sinopse: "Desenterre segredos esquecidos pelo tempo. Este suplemento expande as opções de recompensas da mesa, introduzindo tabelas de loot inteligente, runas de aprimoramento e artefatos lendários com personalidades próprias."
    }
  ]);

  // Função simulando a instalação de um novo módulo
  function handleInstalarLivro(id) {
    setLivros(livros.map(l => l.id === id ? { ...l, instalado: true } : l));
    alert("Invocando dados místicos... Módulo instalado com sucesso!");
  }

  // --- TELA DE LEITURA COMPLETA DO LIVRO (MIGRAÇÃO DE FOCO DA WIKI) ---
  if (livroAberto) {
    return (
      <div className={styles.containerGeral}>
        <div className={styles.telaLeituraWiki}>
          
          <div className={styles.headerLeitura}>
            <button className={styles.btnVoltar} onClick={() => setLivroAberto(null)}>
              <ChevronLeft size={16} /> Fechar Grimório
            </button>
            <div className={styles.tagGrupo}>
              <span className={styles.tagCampanhaLeitura}>{livroAberto.categoria}</span>
              <span className={styles.tagPapelLeitura}>{livroAberto.versao}</span>
            </div>
          </div>

          <div className={styles.corpoLeitura}>
            <div className={styles.layoutLeituraLivro}>
              {/* Capa lateral imponente */}
              <div className={styles.capaLeituraWrapper}>
                <img src={livroAberto.bannerUrl} alt={livroAberto.titulo} />
              </div>
              
              <div className={styles.textoLeituraWrapper}>
                <div className={styles.tituloAlinhamento}>
                  <Bookmark size={28} className={styles.iconSelo} />
                  <h1 className={styles.tituloArtigoNpc}>{livroAberto.titulo}</h1>
                </div>
                <div className={styles.divisorEstilizado} />
                <p className={styles.textoLoreNpc}>{livroAberto.sinopse}</p>
                
                {/* Aqui futuramente entraria o leitor de PDF/Index de Capítulos */}
                <div className={styles.caixaAlertaLeitura}>
                  <BookOpen size={18} />
                  <span>O índice completo de regras e capítulos deste compêndio foi indexado ao seu criador de fichas.</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.rodapeProtegido}>
            <span>Licença de uso pessoal ativa. Propriedade vinculada à sua conta mística.</span>
          </div>

        </div>
      </div>
    );
  }

  // Filtros baseados na aba ativa e na barra de pesquisa
  const livrosFiltrados = livros.filter(l => {
    const correspondeAba = abaAtiva === "instalados" ? l.instalado : true;
    const correspondeBusca = l.titulo.toLowerCase().includes(busca.toLowerCase()) || l.categoria.toLowerCase().includes(busca.toLowerCase());
    return correspondeAba && correspondeBusca;
  });

  return (
    <div className={styles.containerGeral}>
      
      {/* HEADER PRINCIPAL */}
      <div className={styles.headerMenu}>
        <div className={styles.abasPrincipais}>
          <button 
            className={`${styles.btnAbaPrincipal} ${abaAtiva === "instalados" ? styles.abaPrincipalAtiva : ""}`}
            onClick={() => { setAbaAtiva("instalados"); setBusca(""); }}
          >
            <CheckCircle size={16} /> Livros Instalados
          </button>
          <button 
            className={`${styles.btnAbaPrincipal} ${abaAtiva === "todos" ? styles.abaPrincipalAtiva : ""}`}
            onClick={() => { setAbaAtiva("todos"); setBusca(""); }}
          >
            <Library size={16} /> Todos os Livros
          </button>
        </div>

        <div className={styles.buscaWrapper}>
          <Search size={18} className={styles.buscaIcon} />
          <input 
            type="text" 
            placeholder="Buscar por título ou módulo..." 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
      </div>

      {/* PAINEL GRID COM OS BANNERS VERTICAIS */}
      <div className={styles.painelRolavel}>
        <div className={styles.secaoLayout}>
          <div className={styles.subHeaderInterno}>
            <div>
              <h3>{abaAtiva === "instalados" ? "Seu Acervo Ativo" : "Compêndios do Sistema"}</h3>
              <p>{abaAtiva === "instalados" ? "Módulos core e expansões integrados ao seu motor de jogo" : "Explore todos os manuais, aventuras e suplementos oficiais disponíveis"}</p>
            </div>
          </div>

          <div className={styles.gridLivros}>
            {livrosFiltrados.map(livro => (
              <div key={livro.id} className={styles.cardLivro}>
                
                {/* Banner / Capa Vertical do Livro */}
                <div className={styles.capaLivroContainer}>
                  <img src={livro.bannerUrl} alt={livro.titulo} className={styles.imagemCapa} />
                  <div className={styles.overlayCapa}>
                    <span className={styles.badgeCategoriaCapa}>{livro.categoria}</span>
                  </div>
                </div>

                {/* Conteúdo do Card */}
                <div className={styles.livroInfoCorpo}>
                  <div className={styles.livroMetaHeader}>
                    <span className={styles.livroVersao}>{livro.versao}</span>
                    {livro.instalado && <span className={styles.statusInstalado}>Instalado</span>}
                  </div>
                  
                  <h4>{livro.titulo}</h4>
                  <p className={styles.descricaoLivroShort}>{livro.descricao}</p>
                  
                  {/* Botão de Ação Dinâmico */}
                  {livro.instalated || livro.instalado ? (
                    <button 
                      className={styles.btnAbrirLivro}
                      onClick={() => setLivroAberto(livro)}
                    >
                      <BookOpen size={14} /> Abrir Compêndio
                    </button>
                  ) : (
                    <button 
                      className={styles.btnInstalarLivro}
                      onClick={() => handleInstalarLivro(livro.id)}
                    >
                      <DownloadCloud size={14} /> Adquirir Módulo
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}