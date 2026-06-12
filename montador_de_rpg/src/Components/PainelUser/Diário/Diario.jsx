import { useState } from "react";
import { Book, FileText, Plus, PenTool, Save, BookOpen, Map } from "lucide-react";
import styles from "./styles.Diario.module.css";

// Dados mockados baseados nas campanhas do jogador
const campanhasIniciais = ["A MALDIÇÃO DE OAKVALE", "O TRONO DESPEDAÇADO"];

const paginasIniciais = [
  { id: 1, campanha: "A MALDIÇÃO DE OAKVALE", titulo: "SESSÃO 01: A CHEGADA EM OAKVALE", conteudo: "Chegamos à vila ao entardecer. A chuva fina não parou de cair desde que deixamos a capital. O estalajadeiro mencionou que as crianças não entram mais na floresta de giz." },
  { id: 2, campanha: "A MALDIÇÃO DE OAKVALE", titulo: "O RASTRO DO CERVO", conteudo: "Encontrei pegadas que parecem ser feitas de vidro derretido. O ferreiro local disse que isso é sinal de um Mito Antigo. Precisamos de armadilhas de prata." },
  { id: 3, campanha: "O TRONO DESPEDAÇADO", titulo: "VOTO DO SILÊNCIO TARDIO", conteudo: "Jurei perante a Senhora do Lago que não falarei uma palavra inútil até que o usurpador seja destronado. (Nota: Lembrar de avisar o grupo para não me fazerem perguntas)." },
  { id: 4, campanha: "O TRONO DESPEDAÇADO", titulo: "SIR GARETH, O COVARDE", conteudo: "Um cavaleiro que fugiu da linha de frente. Ele nos deve um favor depois que o encobrimos. Pode ser útil para conseguir suprimentos roubados." }
];

export default function Diario() {
  const [campanhas, setCampanhas] = useState(campanhasIniciais);
  const [campanhaAtiva, setCampanhaAtiva] = useState(campanhasIniciais[0]);
  
  const [paginas, setPaginas] = useState(paginasIniciais);
  
  const paginasFiltradas = paginas.filter(pag => pag.campanha === campanhaAtiva);
  
  const [paginaAtiva, setPaginaAtiva] = useState(paginasFiltradas[0] || null);
  const [modoEdicao, setModoEdicao] = useState(false);

  // Estados de Rascunho para a Edição (Anotações do Jogador)
  const [rascunhoTitulo, setRascunhoTitulo] = useState("");
  const [rascunhoConteudo, setRascunhoConteudo] = useState("");

  function handleMudarCampanha(campanhaNome) {a
    setCampanhaAtiva(campanhaNome);
    const paginasDestaCampanha = paginas.filter(pag => pag.campanha === campanhaNome);
    setPaginaAtiva(paginasDestaCampanha[0] || null);
    setModoEdicao(false);
  }
  
  function handleSelecionarPagina(pagina) {
    setPaginaAtiva(pagina);
    setModoEdicao(false);
  }

  function handleEntrarEdicao() {
    setRascunhoTitulo(paginaAtiva.titulo);
    setRascunhoConteudo(paginaAtiva.conteudo);
    setModoEdicao(true);
  }

  function handleSalvarPagina() {
    const paginasAtualizadas = paginas.map(pag => {
      if (pag.id === paginaAtiva.id) {
        const atualizada = { ...pag, titulo: rascunhoTitulo, conteudo: rascunhoConteudo };
        setPaginaAtiva(atualizada); 
        return atualizada;
      }
      return pag;
    });

    setPaginas(paginasAtualizadas);
    setModoEdicao(false);
  }

  function handleCriarPagina() {
    const nova = {
      id: Date.now(),
      campanha: campanhaAtiva,
      titulo: "NOVA ANOTAÇÃO",
      conteudo: "Escreva seus pensamentos ou pistas aqui..."
    };
    setPaginas([...paginas, nova]);
    setPaginaAtiva(nova);
    setRascunhoTitulo(nova.titulo);
    setRascunhoConteudo(nova.conteudo);
    setModoEdicao(true);
  }

  return (
    <div className={styles.containerGeral}>
      {/* 1. BARRA LATERAL DO DIÁRIO */}
      <aside className={styles.sidebarDiario}>
        
        {/* Lista Dinâmica de Campanhas */}
        <div className={styles.abasCampanhas}>
          <span className={styles.labelSecao}>Suas Campanhas</span>
          
          <div className={styles.listaCampanhasScroll}>
            {campanhas.map(camp => (
              <button 
                key={camp}
                className={`${styles.btnCampanha} ${campanhaAtiva === camp ? styles.campAtiva : ""}`}
                onClick={() => handleMudarCampanha(camp)}
              >
                <Map size={14} className={styles.iconeCampanha} /> 
                <span className={styles.truncarTexto}>{camp}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Páginas do Diário (filtradas pela campanha ativa) */}
        <div className={styles.listaPaginas}>
          <div className={styles.headerLista}>
            <span>Anotações ({paginasFiltradas.length})</span>
            <button className={styles.btnCriar} onClick={handleCriarPagina}>
              <Plus size={14} /> Relatar
            </button>
          </div>
          
          <div className={styles.scrollPaginas}>
            {paginasFiltradas.map(pag => (
              <button
                key={pag.id}
                className={`${styles.itemPagina} ${paginaAtiva?.id === pag.id ? styles.paginaSelecionada : ""}`}
                onClick={() => handleSelecionarPagina(pag)}
              >
                <FileText size={16} className={styles.iconeArquivo} />
                <span className={styles.truncarTexto}>{pag.titulo}</span>
              </button>
            ))}
            
            {paginasFiltradas.length === 0 && (
              <p className={styles.mensagemVazia}>Nenhum registro para esta campanha. A página está em branco.</p>
            )}
          </div>
        </div>
      </aside>

      {/* 2. ÁREA DE LEITURA E ESCRITA */}
      <main className={styles.conteudoDiario}>
        {paginaAtiva ? (
          <div className={styles.painelFolha}>
            
            <div className={styles.headerFolha}>
              <span className={styles.tagCampanha}>{paginaAtiva.campanha}</span>
              <div className={styles.acoesFolha}>
                {modoEdicao ? (
                  <button className={styles.btnSalvar} onClick={handleSalvarPagina}>
                    <Save size={16} /> Selar Página
                  </button>
                ) : (
                  <button className={styles.btnEditar} onClick={handleEntrarEdicao}>
                    <PenTool size={16} /> Escrever Relato
                  </button>
                )}
              </div>
            </div>

            <div className={styles.corpoFolha}>
              {modoEdicao ? (
                <div className={styles.formularioEdicao}>
                  <input 
                    type="text" 
                    className={styles.inputTitulo}
                    value={rascunhoTitulo}
                    placeholder="Título da Anotação..."
                    onChange={(e) => setRascunhoTitulo(e.target.value.toUpperCase())}
                  />
                  <div className={styles.divisorEstilizado} />
                  <textarea 
                    className={styles.textareaConteudo}
                    value={rascunhoConteudo}
                    placeholder="Deixe registrado aqui as pistas, fardos e juramentos da sua jornada..."
                    onChange={(e) => setRascunhoConteudo(e.target.value)}
                  />
                </div>
              ) : (
                <div className={styles.visualizacaoAnimada}>
                  <h1 className={styles.tituloFolha}>{paginaAtiva.titulo}</h1>
                  <div className={styles.divisorEstilizado} />
                  <p className={styles.textoFolha}>{paginaAtiva.conteudo}</p>
                </div>
              )}
            </div>

          </div>
        ) : (
          <div className={styles.semPagina}>
            <BookOpen size={48} className={styles.iconeVazio} />
            <p>Seu diário aguarda novas histórias de Bastionland.</p>
          </div>
        )}
      </main>
    </div>
  );
}