import { useState } from "react";
import { Folder, FileText, Plus, Edit3, Save, Trash2, Eye } from "lucide-react";
import styles from "./styles.Wiki.module.css";

// Dados mockados iniciais para o seu grimório
const artigosIniciais = [
  { id: 1, categoria: "NPCs", titulo: "HERON, O SÁBIO", conteudo: "Um antigo mago que guarda os segredos do grimório..." },
  { id: 2, categoria: "Lugares", titulo: "VILA DE OAKVALE", conteudo: "Uma pacata vila cercada por florestas densas e mistérios antigos..." },
  { id: 3, categoria: "Itens", titulo: "AMULETO DO SOL", conteudo: "Reborda de ouro com uma joia central que emite calor constante..." }
];

export default function Wiki() {
  const [artigos, setArtigos] = useState(artigosIniciais);
  const [categoriaAtiva, setCategoriaAtiva] = useState("NPCs");
  const [artigoAtivo, setArtigoAtivo] = useState(artigosIniciais[0]);
  const [modoEdicao, setModoEdicao] = useState(false);

  // Estados de Rascunho para a Edição
  const [rascunhoTitulo, setRascunhoTitulo] = useState("");
  const [rascunhoConteudo, setRascunhoConteudo] = useState("");

  const categorias = ["NPCs", "Lugares", "Itens", "Lore"];
  const artigosFiltrados = artigos.filter(art => art.categoria === categoriaAtiva);

  function handleSelecionarArtigo(artigo) {
    setArtigoAtivo(artigo);
    setModoEdicao(false);
  }

  function handleEntrarEdicao() {
    setRascunhoTitulo(artigoAtivo.titulo);
    setRascunhoConteudo(artigoAtivo.conteudo);
    setModoEdicao(true);
  }

  function handleSalvarArtigo() {
    const artigosAtualizados = artigos.map(art => {
      if (art.id === artigoAtivo.id) {
        const atualizado = { ...art, titulo: rascunhoTitulo, conteudo: rascunhoConteudo };
        setArtigoAtivo(atualizado); // Atualiza a visualização ativa
        return atualizado;
      }
      return art;
    });

    setArtigos(artigosAtualizados);
    setModoEdicao(false);
    // Aqui depois você pode integrar com seu localStorage ou Backend
  }

  function handleCriarArtigo() {
    const novo = {
      id: Date.now(),
      categoria: categoriaAtiva,
      titulo: "NOVO ARTIGO",
      conteudo: "Escreva a história aqui..."
    };
    setArtigos([...artigos, novo]);
    setArtigoAtivo(novo);
    setRascunhoTitulo(novo.titulo);
    setRascunhoConteudo(novo.conteudo);
    setModoEdicao(true);
  }

  return (
    <div className={styles.wikiContainer}>
      {/* 1. BARRA LATERAL DA WIKI: Categorias e Artigos */}
      <aside className={styles.sidebarWiki}>
        {/* Seleção de Categorias */}
        <div className={styles.abasCategorias}>
          {categorias.map(cat => (
            <button 
              key={cat}
              className={`${styles.btnCategoria} ${categoriaAtiva === cat ? styles.catAtiva : ""}`}
              onClick={() => setCategoriaAtiva(cat)}
            >
              <Folder size={14} /> {cat}
            </button>
          ))}
        </div>

        {/* Lista de Artigos da Categoria Selecionada */}
        <div className={styles.listaArtigos}>
          <div className={styles.headerLista}>
            <span>Artigos ({artigosFiltrados.length})</span>
            <button className={styles.btnCriar} onClick={handleCriarArtigo}>
              <Plus size={14} /> Novo
            </button>
          </div>
          
          {artigosFiltrados.map(art => (
            <button
              key={art.id}
              className={`${styles.itemArtigo} ${artigoAtivo?.id === art.id ? styles.artigoSelecionado : ""}`}
              onClick={() => handleSelecionarArtigo(art)}
            >
              <FileText size={16} />
              <span className={styles.truncarTexto}>{art.titulo}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* 2. ÁREA DE CONTEÚDO: Visualização ou Edição */}
      <main className={styles.conteudoWiki}>
        {artigoAtivo ? (
          <div className={styles.painelArtigo}>
            
            {/* Header do Artigo (Ações) */}
            <div className={styles.headerArtigo}>
              <span className={styles.tagCategoria}>{artigoAtivo.categoria}</span>
              <div className={styles.acoesArtigo}>
                {modoEdicao ? (
                  <button className={styles.btnSalvar} onClick={handleSalvarArtigo}>
                    <Save size={16} /> Salvar Rascunho
                  </button>
                ) : (
                  <button className={styles.btnEditar} onClick={handleEntrarEdicao}>
                    <Edit3 size={16} /> Editar Artigo
                  </button>
                )}
              </div>
            </div>

            {/* Corpo do Artigo */}
            <div className={styles.corpoArtigo}>
              {modoEdicao ? (
                <div className={styles.formularioEdicao}>
                  <input 
                    type="text" 
                    className={styles.inputTitulo}
                    value={rascunhoTitulo}
                    onChange={(e) => setRascunhoTitulo(e.target.value.toUpperCase())}
                  />
                  <textarea 
                    className={styles.textareaConteudo}
                    value={rascunhoConteudo}
                    onChange={(e) => setRascunhoConteudo(e.target.value)}
                  />
                </div>
              ) : (
                <>
                  <h1 className={styles.tituloArtigo}>{artigoAtivo.titulo}</h1>
                  <p className={styles.textoArtigo}>{artigoAtivo.conteudo}</p>
                </>
              )}
            </div>

          </div>
        ) : (
          <div className={styles.semArtigo}>
            <Eye size={48} />
            <p>Selecione ou crie um artigo para expandir seu conhecimento.</p>
          </div>
        )}
      </main>
    </div>
  );
}