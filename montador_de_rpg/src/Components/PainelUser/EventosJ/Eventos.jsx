import { useState, useRef } from "react";
import { Search, MapPin, Eye, AlertTriangle, Calendar, Flag, DownloadCloud, CheckCircle, ChevronLeft, Scroll, PlusCircle, UploadCloud, Wind } from "lucide-react";
import styles from "./styles.Eventos.module.css";

export default function Eventos() {
  const [abaAtiva, setAbaAtiva] = useState("ativos");
  const [busca, setBusca] = useState("");
  const [eventoAberto, setEventoAberto] = useState(null);
  
  const fileInputRef = useRef(null);

  // Banco de dados simulando os eventos do mundo/campanha
  const [eventos, setEventos] = useState([
    {
      id: "ev-1",
      titulo: "A NÉVOA DE SANGUE",
      localizacao: "Floresta / Charco",
      categoria: "Presságio",
      descricao: "Uma densa névoa avermelhada que cega os viajantes e traz sussurros de batalhas passadas.",
      perigo: "Ameaçador",
      ativo: true,
      externo: false,
      gatilho: "Entrar em hexágono de floresta à noite",
      clima: "Neblina Densa",
      duracao: "1d4 Horas",
      consequencia: "Desorientação e Testes de Vontade",
      efeitoCompleto: "A névoa se ergue subitamente. A visibilidade cai para apenas 2 metros. Qualquer tentativa de navegação sem um guia nativo ou magia resulta em andar em círculos. Criaturas ocultas ganham Vantagem para emboscar o grupo. Aqueles que falharem em um teste de CAR ouvem as vozes dos entes queridos pedindo socorro no escuro."
    },
    {
      id: "ev-2",
      titulo: "FESTIVAL DO REI DE GIZ",
      localizacao: "Qualquer Povoado",
      categoria: "Marco",
      descricao: "Os aldeões celebram o fim da colheita pintando seus rostos de branco e acendendo fogueiras.",
      perigo: "Pacífico",
      ativo: true,
      externo: false,
      gatilho: "Chegar a uma vila no Solstício",
      clima: "Céu Estrelado",
      duracao: "Uma Noite Inteira",
      consequencia: "Descanso Seguro e Rumores",
      efeitoCompleto: "O grupo é convidado a participar. Enquanto durar o festival, não há risco de ataques de Mitos. Os Cavaleiros podem recuperar totalmente sua Guarda e Vigor sem custo de suprimentos. Interagir com os anciões revela 1d3 rumores verdadeiros sobre o hexágono vizinho."
    },
    {
      id: "ev-3",
      titulo: "EMBOSCADA DOS CAÍDOS",
      localizacao: "Estradas / Ruínas",
      categoria: "Encontro",
      descricao: "Cavaleiros renegados que abandonaram seus juramentos armaram uma barricada na estrada.",
      perigo: "Mortal",
      ativo: false,
      externo: false,
      gatilho: "Falha no teste de percepção / Rolagem 1 de viagem",
      clima: "Chuva Fina",
      duracao: "Até o fim do combate",
      consequencia: "Morte ou Saque",
      efeitoCompleto: "A estrada está bloqueada por uma carroça tombada (ilusão ou real). Três cavaleiros desertores (Atributos 12, Guarda 5, Armadura 1, Dano d8) atacam usando bestas pesadas antes de avançar. Eles exigem todos os suprimentos e cavalos do grupo em troca da vida."
    },
    {
      id: "ev-externo-1",
      titulo: "CHUVA DE ESTRELAS NEGRAS",
      localizacao: "Global",
      categoria: "Evento Global",
      descricao: "Fragmentos do céu caem como meteoros obsidiana. Evento criado pela comunidade.",
      perigo: "Cataclismo",
      ativo: true,
      externo: true,
      gatilho: "Rolagem 100 no D100 de Mestre",
      clima: "Tempestade Arcana",
      duracao: "1 Semana",
      consequencia: "Mutação de Mitos locais",
      efeitoCompleto: "Durante a chuva, todas as rolagens de conjuração e efeitos mágicos sofrem distorções. Os Mitos ficam mais agressivos e adquirem resistência a dano físico. Os meteoros que caem podem ser forjados em armas de qualidade lendária, caso o ferreiro sobreviva ao calor sombrio da pedra."
    }
  ]);

  function handlePrepararEvento(id) {
    setEventos(eventos.map(e => e.id === id ? { ...e, ativo: true } : e));
    alert("As engrenagens do destino giram... Evento inserido na timeline da campanha!");
  }

  function handleImportarEvento(e) {
    const arquivo = e.target.files[0];
    if (!arquivo) return;

    const novoEvento = {
      id: `ev-externo-${Date.now()}`,
      titulo: arquivo.name.replace(/\.[^/.]+$/, "").toUpperCase(),
      localizacao: "Custom",
      categoria: "Externo",
      descricao: "Cenário ou encontro externo adicionado manualmente ao mundo.",
      perigo: "Desconhecido",
      ativo: true,
      externo: true,
      gatilho: "Determinado pelo Mestre",
      clima: "Variável",
      duracao: "Variável",
      consequencia: "Aberto",
      efeitoCompleto: `Arquivo base original: ${arquivo.name}. O pacote de evento foi indexado e está pronto para ser engatilhado na sessão.`
    };

    setEventos([novoEvento, ...eventos]);
    alert(`O compêndio de eventos "${arquivo.name}" foi tecido na teia do destino!`);
  }

  // --- TELA DE DETALHAMENTO DO EVENTO ---
  if (eventoAberto) {
    return (
      <div className={styles.containerGeral}>
        <div className={styles.telaLeituraWiki}>
          
          <div className={styles.headerLeitura}>
            <button className={styles.btnVoltar} onClick={() => setEventoAberto(null)}>
              <ChevronLeft size={16} /> Voltar ao Painel do Mundo
            </button>
            <div className={styles.tagGrupo}>
              <span className={styles.tagCampanhaLeitura}>{eventoAberto.categoria}</span>
              <span className={styles.tagPapelLeitura}>{eventoAberto.localizacao}</span>
              <span className={`${styles.tagPerigoLeitura} ${styles[eventoAberto.perigo.toLowerCase()] || ""}`}>
                {eventoAberto.perigo}
              </span>
              {eventoAberto.externo && <span className={styles.tagExternoLeitura}>Homebrew</span>}
            </div>
          </div>

          <div className={styles.corpoLeitura}>
            <div className={styles.layoutLeituraLivro}>
              
              {/* Sidebar de Características do Evento */}
              <div className={styles.fichaTecnicaMagia}>
                <div className={styles.runaIconWrapper}>
                  {eventoAberto.categoria === "Encontro" ? <AlertTriangle size={48} className={styles.runaIconVisual} /> : 
                   eventoAberto.categoria === "Presságio" ? <Eye size={48} className={styles.runaIconVisual} /> : 
                   <Flag size={48} className={styles.runaIconVisual} />}
                </div>
                <div className={styles.atributosGrid}>
                  <div><strong>Gatilho de Início:</strong> <p>{eventoAberto.gatilho}</p></div>
                  <div><strong>Clima / Ambiente:</strong> <p>{eventoAberto.clima}</p></div>
                  <div><strong>Duração Prevista:</strong> <p>{eventoAberto.duracao}</p></div>
                  <div><strong>Consequência:</strong> <p>{eventoAberto.consequencia}</p></div>
                </div>
              </div>
              
              {/* Corpo Principal do Texto */}
              <div className={styles.textoLeituraWrapper}>
                <div className={styles.tituloAlinhamento}>
                  <Scroll size={28} className={styles.iconSelo} />
                  <h1 className={styles.tituloArtigoNpc}>{eventoAberto.titulo}</h1>
                </div>
                <div className={styles.divisorEstilizado} />
                <p className={styles.textoLoreNpc}>{eventoAberto.efeitoCompleto}</p>
                
                <div className={styles.caixaAlertaLeitura}>
                  <Wind size={18} />
                  <span>Este evento pode afetar o progresso dos jogadores no mapa hexagonal. Aplique os modificadores de terreno e clima conforme as regras padrão.</span>
                </div>
              </div>

            </div>
          </div>

          <div className={styles.rodapeProtegido}>
            <span>Sistema de Gestão de Destino &copy; Apenas para os olhos do Mestre (ou Cronista).</span>
          </div>

        </div>
      </div>
    );
  }

  // Lógica de Filtros
  const eventosFiltrados = eventos.filter(ev => {
    let correspondeAba = true;
    if (abaAtiva === "ativos") correspondeAba = ev.ativo && !ev.externo;
    if (abaAtiva === "externos") correspondeAba = ev.externo;
    if (abaAtiva === "todos") correspondeAba = !ev.externo;

    const correspondeBusca = ev.titulo.toLowerCase().includes(busca.toLowerCase()) || 
                             ev.categoria.toLowerCase().includes(busca.toLowerCase());
    return correspondeAba && correspondeBusca;
  });

  return (
    <div className={styles.containerGeral}>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: "none" }} 
        accept=".pdf,.json,.txt"
        onChange={handleImportarEvento}
      />

      {/* HEADER PRINCIPAL */}
      <div className={styles.headerMenu}>
        <div className={styles.abasPrincipais}>
          <button 
            className={`${styles.btnAbaPrincipal} ${abaAtiva === "ativos" ? styles.abaPrincipalAtiva : ""}`}
            onClick={() => { setAbaAtiva("ativos"); setBusca(""); }}
          >
            <CheckCircle size={16} /> Eventos Preparados
          </button>
          <button 
            className={`${styles.btnAbaPrincipal} ${abaAtiva === "todos" ? styles.abaPrincipalAtiva : ""}`}
            onClick={() => { setAbaAtiva("todos"); setBusca(""); }}
          >
            <Calendar size={16} /> Todos os Eventos
          </button>
          <button 
            className={`${styles.btnAbaPrincipal} ${abaAtiva === "externos" ? styles.abaPrincipalAtiva : ""}`}
            onClick={() => { setAbaAtiva("externos"); setBusca(""); }}
          >
            <PlusCircle size={16} /> Ocorrências de Fora
          </button>
        </div>

        <div className={styles.buscaWrapper}>
          <Search size={18} className={styles.buscaIcon} />
          <input 
            type="text" 
            placeholder="Filtrar por nome, categoria..." 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
      </div>

      {/* GRID DE CARDS DE EVENTOS */}
      <div className={styles.painelRolavel}>
        <div className={styles.secaoLayout}>
          
          <div className={styles.subHeaderInterno}>
            <div>
              <h3>
                {abaAtiva === "ativos" && "Linha do Tempo da Sessão"}
                {abaAtiva === "todos" && "Catálogo do Destino"}
                {abaAtiva === "externos" && "Anomalias Homebrew"}
              </h3>
              <p>
                {abaAtiva === "ativos" && "Encontros e presságios engatilhados para surpreender os Cavaleiros."}
                {abaAtiva === "todos" && "Todos os marcos e perigos oficiais disponíveis para a campanha."}
                {abaAtiva === "externos" && "Eventos gerados pela comunidade ou importados de outras mesas."}
              </p>
            </div>

            {abaAtiva === "externos" && (
              <button className={styles.btnImportar} onClick={() => fileInputRef.current.click()}>
                <UploadCloud size={16} /> Importar Evento (.json)
              </button>
            )}
          </div>

          <div className={styles.gridLivros}>
            {eventosFiltrados.map(ev => (
              <div key={ev.id} className={styles.cardLivro}>
                
                {/* Visual Header do Card (Background Abstrato com Ícone) */}
                <div className={styles.capaLivroContainer}>
                  <div className={styles.backgroundRunaVisual} />
                  {ev.categoria === "Encontro" ? (
                    <AlertTriangle className={styles.imagemCapaIcone} size={48} />
                  ) : ev.categoria === "Presságio" ? (
                    <Eye className={styles.imagemCapaIcone} size={48} />
                  ) : (
                    <Flag className={styles.imagemCapaIcone} size={48} />
                  )}
                  <div className={styles.overlayCapa}>
                    <span className={styles.badgeCategoriaCapa}>{ev.categoria}</span>
                  </div>
                </div>

                <div className={styles.livroInfoCorpo}>
                  <div className={styles.livroMetaHeader}>
                    <div className={styles.wrapperLocalizacao}>
                      <MapPin size={12} className={styles.iconeLocalizacao} />
                      <span className={styles.livroVersao}>{ev.localizacao}</span>
                    </div>
                    {/* Badge de perigo dinâmico no CSS */}
                    <span className={`${styles.badgePerigo} ${styles[ev.perigo.toLowerCase()] || ""}`}>
                      {ev.perigo}
                    </span>
                  </div>
                  
                  <h4>{ev.titulo}</h4>
                  <p className={styles.descricaoLivroShort}>{ev.descricao}</p>
                  
                  {ev.ativo ? (
                    <button className={styles.btnAbrirLivro} onClick={() => setEventoAberto(ev)}>
                      <Scroll size={14} /> Inspecionar Evento
                    </button>
                  ) : (
                    <button className={styles.btnInstalarLivro} onClick={() => handlePrepararEvento(ev.id)}>
                      <DownloadCloud size={14} /> Engatilhar na Sessão
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