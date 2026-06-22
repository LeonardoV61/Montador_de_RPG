import { useState, useRef, useEffect } from "react";
import { Search, BookOpen, DownloadCloud, CheckCircle, ChevronLeft, Library, Bookmark, PlusCircle, UploadCloud, ArrowLeft, ArrowRight } from "lucide-react";
import MytB from "../../../assets/livros/Mythic_BastionLand.png";
import styles from "./styles.Compendio.module.css";
import { sistemaService } from "../../../services/sistemaService";
// import RenderizadorConteudo from "../../Components/RenderizadorConteudo";
import RenderizadorConteudo from "./RenderizadorConteudo";
import ReactMarkdown from 'react-markdown';

const CAPA_PADRAO = MytB;

export default function Compendio() {
  const [abaAtiva, setAbaAtiva] = useState("instalados");
  const [busca, setBusca] = useState("");
  const [livroAberto, setLivroAberto] = useState(null);
  const [paginaAtual, setPaginaAtual] = useState(0); // índice da página atual
  const fileInputRef = useRef(null);

  const [livros, setLivros] = useState([]);
  const [sistemasAPI, setSistemasAPI] = useState([]);

  useEffect(() => {
    sistemaService.listarTodos()
      .then(data => {
        const livrosDeSistema = data.map(sistema => ({
          id: `sistema-${sistema.id}`,
          titulo: sistema.nome,
          versao: `v${sistema.versaoSchemas}.0`,
          categoria: sistema.eOficial ? "Oficial" : "Homebrew",
          descricao: sistema.descricao || "Sistema de RPG",
          bannerUrl: sistema.urlImagem || CAPA_PADRAO,
          instalado: true,
          externo: !sistema.eOficial,
          sinopse: `Sistema criado por ${sistema.criadorApelido}.`,
          configuracao: sistema.configuracao // já vem do backend
        }));
        setSistemasAPI(livrosDeSistema);
      })
      .catch(err => console.error("Erro ao buscar sistemas", err));
  }, []);

  const todosLivros = [
    ...livros,
    ...sistemasAPI.filter(s => !livros.some(l => l.titulo === s.titulo))
  ];

  function handleInstalarLivro(id) {
    setLivros(livros.map(l => l.id === id ? { ...l, instalado: true } : l));
    alert("Invocando dados místicos... Módulo instalado com sucesso!");
  }

  function handleImportarLivro(event) {
    const arquivo = event.target.files[0];
    if (!arquivo) return;
    const novoLivro = {
      id: `livro-externo-${Date.now()}`,
      titulo: arquivo.name.replace(/\.[^/.]+$/, "").toUpperCase(),
      versao: "v1.0",
      categoria: "Externo",
      descricao: "Compêndio customizado importado com sucesso.",
      bannerUrl: MytB,
      instalado: true,
      externo: true,
      sinopse: `Arquivo original: ${arquivo.name}.`
    };
    setLivros([novoLivro, ...livros]);
  }

  // Ao abrir um livro, reseta a página atual
  function abrirLivro(livro) {
    setLivroAberto(livro);
    setPaginaAtual(0);
  }

  // --- TELA DE LEITURA COM PÁGINAS ---
  if (livroAberto) {
    const paginas = livroAberto.configuracao?.paginas || [];
    const pagina = paginas[paginaAtual];
    const isCapa = pagina?.id === 'capa';

    return (
      <div className={styles.fundoLeitura}>
        {/* Barra de navegação superior */}
        <div className={styles.navTopo}>
          <button onClick={() => setLivroAberto(null)} className={styles.btnVoltar}>
            <ChevronLeft size={16} /> Fechar Grimório
          </button>
          <div className={styles.tagGrupo}>
            <span className={styles.tagCampanhaLeitura}>{livroAberto.categoria}</span>
            <span className={styles.tagPapelLeitura}>{livroAberto.versao}</span>
            {livroAberto.externo && <span className={styles.tagExternoLeitura}>Documento Externo</span>}
          </div>
        </div>

        {/* Área principal do livro */}
        <div className={styles.areaLivro}>
          {/* Navegação de páginas */}
          <div className={styles.navPaginas}>
            <button onClick={() => setPaginaAtual(p => Math.max(0, p - 1))} disabled={paginaAtual === 0} className={styles.btnNav}>
              <ArrowLeft size={16} /> Anterior
            </button>
            <span className={styles.textoPaginaAtual}>
              {isCapa ? 'Capa' : `Página ${paginaAtual + 1} de ${paginas.length}`}
            </span>
            <button onClick={() => setPaginaAtual(p => Math.min(paginas.length - 1, p + 1))} disabled={paginaAtual === paginas.length - 1} className={styles.btnNav}>
              Próxima <ArrowRight size={16} />
            </button>
          </div>

          {/* Conteúdo da página */}
          <div className={styles.pagina}>
            <div className={styles.conteudoPagina}>
              {pagina ? (
                isCapa ? (
                  <div className={styles.capaContainer}>
                    <img src={livroAberto.bannerUrl || MytB} alt={livroAberto.titulo} className={styles.capaImagem} />
                    {/* {pagina.conteudo[1] && (
                      <div className={styles.capaTexto}>
                        <ReactMarkdown>{pagina.conteudo[1].texto}</ReactMarkdown>
                      </div>
                    )} */}
                  </div>
                ) : (
                  <article className={styles.article}>
                    <header className={styles.cabecalhoLivro}>
                      <span className={styles.tituloRunning}>{livroAberto.titulo}</span>
                    </header>
                    <h1 className={styles.tituloPagina}>{pagina.titulo}</h1>
                    <RenderizadorConteudo blocos={pagina.conteudo} />
                  </article>
                )
              ) : (
                <p style={{ textAlign: 'center', padding: 40 }}>Este livro não possui páginas configuradas.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Filtragem
  const livrosFiltrados = todosLivros.filter(l => {
    let correspondeAba = true;
    if (abaAtiva === "instalados") correspondeAba = l.instalado && !l.externo;
    if (abaAtiva === "externos") correspondeAba = l.externo;
    if (abaAtiva === "todos") correspondeAba = !l.externo;
    const respondeBusca = l.titulo.toLowerCase().includes(busca.toLowerCase()) || 
                            l.categoria.toLowerCase().includes(busca.toLowerCase());
    return correspondeAba && respondeBusca;
  });

  return (
    <div className={styles.containerGeral}>
      <input type="file" ref={fileInputRef} style={{ display: "none" }} accept=".pdf,.epub,.txt" onChange={handleImportarLivro} />

      <div className={styles.headerMenu}>
        <div className={styles.abasPrincipais}>
          <button className={`${styles.btnAbaPrincipal} ${abaAtiva === "instalados" ? styles.abaPrincipalAtiva : ""}`} onClick={() => { setAbaAtiva("instalados"); setBusca(""); }}>
            <CheckCircle size={16} /> Livros Instalados
          </button>
          <button className={`${styles.btnAbaPrincipal} ${abaAtiva === "todos" ? styles.abaPrincipalAtiva : ""}`} onClick={() => { setAbaAtiva("todos"); setBusca(""); }}>
            <Library size={16} /> Todos os Livros
          </button>
          <button className={`${styles.btnAbaPrincipal} ${abaAtiva === "externos" ? styles.abaPrincipalAtiva : ""}`} onClick={() => { setAbaAtiva("externos"); setBusca(""); }}>
            <PlusCircle size={16} /> Livros de Fora
          </button>
        </div>

        <div className={styles.buscaWrapper}>
          <Search size={18} className={styles.buscaIcon} />
          <input type="text" placeholder="Buscar por título ou módulo..." value={busca} onChange={(e) => setBusca(e.target.value)} />
        </div>
      </div>

      <div className={styles.painelRolavel}>
        <div className={styles.secaoLayout}>
          <div className={styles.subHeaderInterno}>
            <div>
              <h3>{abaAtiva === "instalados" && "Seu Acervo Ativo"}{abaAtiva === "todos" && "Compêndios do Sistema"}{abaAtiva === "externos" && "Manuais Importados"}</h3>
              <p>{abaAtiva === "instalados" && "Módulos core e expansões integrados ao seu motor de jogo"}{abaAtiva === "todos" && "Explore todos os manuais, aventuras e suplementos oficiais disponíveis"}{abaAtiva === "externos" && "Arquivos PDF e homebrews adicionados externamente por você"}</p>
            </div>
            {abaAtiva === "externos" && (
              <button className={styles.btnImportar} onClick={() => fileInputRef.current.click()}>
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
                    {livro.externo ? <span className={styles.statusExterno}>Externo</span> : livro.instalado && <span className={styles.statusInstalado}>Instalado</span>}
                  </div>
                  <h4>{livro.titulo}</h4>
                  <p className={styles.descricaoLivroShort}>{livro.descricao}</p>
                  {livro.instalado ? (
                    <button className={styles.btnAbrirLivro} onClick={() => abrirLivro(livro)}>
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