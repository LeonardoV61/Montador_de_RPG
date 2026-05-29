import { useState } from "react";
import { Search, BookOpen, DownloadCloud, CheckCircle, ChevronLeft, Library, Bookmark } from "lucide-react";
import T20 from "../../../assets/livros/Tormenta20.png"
import T20R from "../../../assets/livros/Tormenta20-Resumo-de-Regras.png"
import T20V from "../../../assets/livros/Tormenta20-A-Voz-das-Mares.png"
import MytB from "../../../assets/livros/Mythic_BastionLand.png"
import styles from "./styles.Compendio.module.css";

export default function Compendio() {
  const [abaAtiva, setAbaAtiva] = useState("instalados");
  const [busca, setBusca] = useState("");
  
  // Estado para quando um livro é aberto para leitura em tela cheia
  const [livroAberto, setLivroAberto] = useState(null);

  // Mock de dados dos livros adaptado com as variáveis de imagem importadas
  const [livros, setLivros] = useState([
    {
      id: "livro-1",
      titulo: "TORMENTA 20",
      versao: "v2.0",
      categoria: "Livro de Regras",
      descricao: "O regulamento essencial para criar heróis, conjurar magias e explorar o mundo de Arton.",
      bannerUrl: T20, 
      instalado: true,
      sinopse: "Este tomo contém os pilares fundamentais da maior saga de fantasia do Brasil. Explore raças ancestrais, classes heróicas e mecânicas de combate projetadas para guiar tanto jogadores novatos quanto veteranos pelos caminhos perigosos de Arton."
    },
    {
      id: "livro-2",
      titulo: "TORMENTA 20 - RESUMO DE REGRAS",
      versao: "v1.0",
      categoria: "Suplemento",
      descricao: "Guia rápido de consulta e tabelas essenciais para acelerar o ritmo dos seus combates.",
      bannerUrl: T20R, 
      instalado: true,
      sinopse: "Não perca tempo folheando centenas de páginas no meio do combate. O Resumo de Regras traz tabelas de condições, modificadores de perícias e as manobras de combate mais utilizadas de forma direta e visual para jogadores e Mestres."
    },
    {
      id: "livro-3",
      titulo: "TORMENTA 20 - A VOZ DAS MARES",
      versao: "v1.0",
      categoria: "Campanha",
      descricao: "Uma aventura marítima cheia de mistérios, piratas e os perigos ancestrais dos oceanos.",
      bannerUrl: T20V, 
      instalado: false,
      sinopse: "Os segredos do Mar Negro chamam por você. Esta crônica de campanha oferece mapas de embarcações, encontros costeiros balanceados, NPCs marcantes e ganchos de história sombrios envolvendo o ecossistema marinho de Arton."
    },
    {
      id: "livro-4",
      titulo: "MYTHIC BASTIONLAND",
      versao: "v1.0",
      categoria: "Livro de Regras",
      descricao: "Explore mitos arturianos, cavalaria e monstros estranhos em uma terra enigmática.",
      bannerUrl: MytB, 
      instalado: false,
      sinopse: "Você é um Cavaleiro encarregado de proteger o Reino e manter a ordem em um cenário místico e perigoso. Um sistema focado em exploração hexagonal, glória, herança e combates brutais contra anomalias imponentes."
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
            <span>Licença de uso pessoal activa. Propriedade vinculada à sua conta mística.</span>
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
                  {livro.instalado ? (
                    <button className={styles.btnAbrirLivro} onClick={() => setLivroAberto(livro)}>
                      <BookOpen size={14} /> Abrir Livro
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