import { useState, useRef } from "react"; // Adicionado useRef
import { Search, BookOpen, DownloadCloud, CheckCircle, ChevronLeft, Library, Bookmark, PlusCircle, UploadCloud } from "lucide-react";
import T20 from "../../../assets/livros/Tormenta20.png";
import T20R from "../../../assets/livros/Tormenta20-Resumo-de-Regras.png";
import T20V from "../../../assets/livros/Tormenta20-A-Voz-das-Mares.png";
import MytB from "../../../assets/livros/Mythic_BastionLand.png";
import styles from "./styles.Compendio.module.css";

export default function Compendio() {
  const [abaAtiva, setAbaAtiva] = useState("instalados");
  const [busca, setBusca] = useState("");
  const [livroAberto, setLivroAberto] = useState(null);
  
  // Referência para o input de arquivo oculto
  const fileInputRef = useRef(null);

  const [livros, setLivros] = useState([
    {
      id: "livro-1",
      titulo: "TORMENTA 20",
      versao: "v2.0",
      categoria: "Livro de Regras",
      descricao: "O regulamento essencial para criar heróis, conjurar magias e explorar o mundo de Arton.",
      bannerUrl: T20, 
      instalado: true,
      externo: false,
      sinopse: "Este tomo contém os pilares fundamentais da maior saga de fantasia do Brasil..."
    },
    {
      id: "livro-2",
      titulo: "TORMENTA 20 - RESUMO DE REGRAS",
      versao: "v1.0",
      categoria: "Suplemento",
      descricao: "Guia rápido de consulta e tabelas essenciais para acelerar o ritmo dos seus combates.",
      bannerUrl: T20R, 
      instalado: true,
      externo: false,
      sinopse: "Não perca tempo folheando centenas de páginas no meio do combate..."
    },
    {
      id: "livro-3",
      titulo: "TORMENTA 20 - A VOZ DAS MARES",
      versao: "v1.0",
      categoria: "Campanha",
      descricao: "Uma aventura marítima cheia de mistérios, piratas e os perigos ancestrais dos oceanos.",
      bannerUrl: T20V, 
      instalado: false,
      externo: false,
      sinopse: "Os segredos do Mar Negro chamam por você..."
    },
    {
      id: "livro-4",
      titulo: "MYTHIC BASTIONLAND",
      versao: "v1.0",
      categoria: "Livro de Regras",
      descricao: "Explore mitos arturianos, cavalaria e monstros estranhos em uma terra enigmática.",
      bannerUrl: MytB, 
      instalado: false,
      externo: false,
      sinopse: "Você é um Cavaleiro encarregado de proteger o Reino..."
    },
    {
      id: "livro-externo-1",
      titulo: "MEU SUPLEMENTO CASEIRO",
      versao: "v1.3",
      categoria: "Homebrew",
      descricao: "Regras customizadas e classes criadas pela comunidade importadas para o grimório.",
      bannerUrl: MytB, 
      instalado: true,
      externo: true,
      sinopse: "Este documento contém regras customizadas, raças adaptadas e conteúdos criados fora do sistema oficial."
    }
  ]);

  function handleInstalarLivro(id) {
    setLivros(livros.map(l => l.id === id ? { ...l, instalado: true } : l));
    alert("Invocando dados místicos... Módulo instalado com sucesso!");
  }

  // Função para simular a importação de um arquivo PDF/Livro de fora
  function handleImportarLivro(event) {
    const arquivo = event.target.files[0];
    if (!arquivo) return;

    // Criando um novo objeto de livro baseado no arquivo upado
    const novoLivro = {
      id: `livro-externo-${Date.now()}`,
      titulo: arquivo.name.replace(/\.[^/.]+$/, "").toUpperCase(), // Remove a extensão do arquivo (.pdf)
      versao: "v1.0",
      categoria: "Externo",
      descricao: "Compêndio customizado importado com sucesso para a sua biblioteca local.",
      bannerUrl: MytB, // Placeholder visual enquanto não há upload de capa separado
      instalado: true,
      externo: true,
      sinopse: `Arquivo original: ${arquivo.name}. Este grimório foi adicionado manualmente e está pronto para consulta.`
    };

    setLivros([novoLivro, ...livros]);
    alert(`"${arquivo.name}" foi indexado com sucesso aos tomos proibidos!`);
  }

  // --- TELA DE LEITURA COMPLETA ---
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
              {livroAberto.externo && <span className={styles.tagExternoLeitura}>Documento Externo</span>}
            </div>
          </div>

          <div className={styles.corpoLeitura}>
            <div className={styles.layoutLeituraLivro}>
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

  const livrosFiltrados = livros.filter(l => {
    let correspondeAba = true;
    if (abaAtiva === "instalados") correspondeAba = l.instalado && !l.externo;
    if (abaAtiva === "externos") correspondeAba = l.externo;
    if (abaAtiva === "todos") correspondeAba = !l.externo; 

    const respondeBusca = l.titulo.toLowerCase().includes(busca.toLowerCase()) || 
                            l.categoria.toLowerCase().includes(busca.toLowerCase());
    return correspondeAba && respondeBusca; // <--- Adicionado o "corresponde" que faltava
  });

  return (
    <div className={styles.containerGeral}>
      
      {/* INPUT DE ARQUIVO OCULTO */}
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: "none" }} 
        accept=".pdf,.epub,.txt"
        onChange={handleImportarLivro}
      />

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

          <button 
            className={`${styles.btnAbaPrincipal} ${abaAtiva === "externos" ? styles.abaPrincipalAtiva : ""}`}
            onClick={() => { setAbaAtiva("externos"); setBusca(""); }}
          >
            <PlusCircle size={16} /> Livros de Fora
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

      {/* PAINEL ROlÁVEL */}
      <div className={styles.painelRolavel}>
        <div className={styles.secaoLayout}>
          
          {/* SUBHEADER INTERNO DESSA SEÇÃO (MUDADO PARA FLEX DO ESTILO) */}
          <div className={styles.subHeaderInterno}>
            <div>
              <h3>
                {abaAtiva === "instalados" && "Seu Acervo Ativo"}
                {abaAtiva === "todos" && "Compêndios do Sistema"}
                {abaAtiva === "externos" && "Manuais Importados"}
              </h3>
              <p>
                {abaAtiva === "instalados" && "Módulos core e expansões integrados ao seu motor de jogo"}
                {abaAtiva === "todos" && "Explore todos os manuais, aventuras e suplementos oficiais disponíveis"}
                {abaAtiva === "externos" && "Arquivos PDF e homebrews adicionados externamente por você"}
              </p>
            </div>

            {/* BOTÃO DINÂMICO QUE APARECE APENAS NA ABA DE LIVROS DE FORA */}
            {abaAtiva === "externos" && (
              <button 
                className={styles.btnImportar}
                onClick={() => fileInputRef.current.click()}
              >
                <UploadCloud size={16} /> Importar Grimório
              </button>
            )}
          </div>

          <div className={styles.gridLivros}>
            {livrosFiltrados.map(livro => (
              <div key={livro.id} className={styles.cardLivro}>
                
                <div className={styles.capaLivroContainer}>
                  <img src={livro.bannerUrl} alt={livro.titulo} className={styles.imagemCapa} />
                  <div className={styles.overlayCapa}>
                    <span className={styles.badgeCategoriaCapa}>{livro.categoria}</span>
                  </div>
                </div>

                <div className={styles.livroInfoCorpo}>
                  <div className={styles.livroMetaHeader}>
                    <span className={styles.livroVersao}>{livro.versao}</span>
                    {livro.externo ? (
                      <span className={styles.statusExterno}>Externo</span>
                    ) : (
                      livro.instalado && <span className={styles.statusInstalado}>Instalado</span>
                    )}
                  </div>
                  
                  <h4>{livro.titulo}</h4>
                  <p className={styles.descricaoLivroShort}>{livro.descricao}</p>
                  
                  {livro.instalado ? (
                    <button className={styles.btnAbrirLivro} onClick={() => setLivroAberto(livro)}>
                      <BookOpen size={14} /> Abrir Livro
                    </button>
                  ) : (
                    <button className={styles.btnInstalarLivro} onClick={() => handleInstalarLivro(livro.id)}>
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