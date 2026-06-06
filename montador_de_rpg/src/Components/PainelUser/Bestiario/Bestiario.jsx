import { useState, useRef } from "react";
import { Search, Shield, Swords, DownloadCloud, CheckCircle, ChevronLeft, Skull, Heart, Eye, PlusCircle, UploadCloud, ShieldAlert } from "lucide-react";
import styles from "./styles.Bestiario.module.css";

export default function Bestiario() {
  const [abaAtiva, setAbaAtiva] = useState("instalados");
  const [busca, setBusca] = useState("");
  const [campanhaAtiva, setCampanhaAtiva] = useState("campanha-1"); // Novo estado da campanha ativa
  const [criaturaAberta, setCriaturaAberta] = useState(null);
  
  const fileInputRef = useRef(null);

  // Novo estado com os índices de Campanhas ativas (idêntico ao Loots e Codex)
  const [campanhas] = useState([
    { id: "campanha-1", nome: "Crônicas de Arton: Coração de Rubi" },
    { id: "campanha-2", nome: "O Despertar de Tenebra" }
  ]);

  // Estado inicial atualizado com o vínculo de "campanhaId"[cite: 5]
  const [criaturas, setCriaturas] = useState([
    {
      id: "monstro-1",
      campanhaId: "campanha-1", // Vinculado à campanha 1
      titulo: "DRAGÃO VERMELHO ANCIÃO",
      nd: "ND 20",
      categoria: "Monstro (Fogo)",
      descricao: "Uma força colossal da natureza capaz de reduzir reinos inteiros a cinzas com um único sopro de chamas.",
      pv: "680 PV",
      instalado: true,
      externo: false,
      tipo: "Dragão",
      defesa: "42",
      iniciativa: "+18",
      deslocamento: "12m, voo 24m",
      sentidos: "Percepção às cegas 18m, Visão no escuro",
      fichaCompleta: "Ações:\n• Mordida: +35 para acertar (4d10+15 de dano perfurante mais 2d6 de fogo).\n• Sopro de Chamas (Recarga 5-6): Cone de 18m. Causa 18d10 de dano de fogo (Reflexos CD 38 reduz metade).\n\nHabilidades Passivas:\n• Imunidade a Fogo e Sono.\n• Presença Aterradora: Vontade CD 35 ou fica Apavorado por 1 minuto."
    },
    {
      id: "monstro-2",
      campanhaId: "campanha-1", // Vinculado à campanha 1
      titulo: "GOLEM DE FERRO",
      nd: "ND 10",
      categoria: "Construto",
      descricao: "Uma sentinela implacável forjada em metal puro, imune à maioria das magias e armas convencionais.",
      pv: "210 PV",
      instalado: true,
      externo: false,
      tipo: "Construto",
      defesa: "30",
      iniciativa: "+2",
      deslocamento: "9m",
      sentidos: "Visão no escuro 18m, Percepção passiva 10",
      fichaCompleta: "Ações:\n• Ataque Duplo de Pancada: +22 para acertar (3d8+8 de dano de esmagamento).\n• Sopro de Gás Venenoso (Recarga 6): Nuvem de 5m ao redor do Golem. Causa 10d6 de dano de veneno.\n\nHabilidades Passivas:\n• Imunidade a Magia: Imune a qualquer feitiço que permita resistência à magia.\n• Absorção de Fogo: Dano de fogo cura o Golem em vez de machucar."
    },
    {
      id: "monstro-3",
      campanhaId: "campanha-2", // Vinculado à campanha 2
      titulo: "DEVORADOR DE MENTES",
      nd: "ND 7",
      categoria: "Aberração",
      descricao: "Um predador psíquico que habita as profundezas, alimentando-se da sanidade e do cérebro de humanoides.",
      pv: "95 PV",
      instalado: false,
      externo: false,
      tipo: "Aberração",
      defesa: "22",
      iniciativa: "+12",
      deslocamento: "9m",
      sentidos: "Visão no escuro 36m",
      fichaCompleta: "Ações:\n• Tentáculos: +10 para acertar (2d6+4 de dano psíquico + Agarrado).\n• Extrair Cérebro: Contra alvo agarrado incapacitado. Causa 10d10 de dano perfurante. Se reduzir a 0 PV, devora o cérebro matando instantaneamente.\n\nHabilidades Passivas:\n• Explosão Psíquica (Mente): Cone de 15m. Alvos devem passar em Vontade CD 20 ou ficam Atordoados por 1 minuto."
    },
    {
      id: "monstro-externo-1",
      campanhaId: "campanha-1", // Vinculado à campanha 1
      titulo: "MUTANTE DA TORMENTA HOMEBREW",
      nd: "ND 15",
      categoria: "Lefeudo",
      descricao: "Criatura aberrante importada de um arquivo customizado da comunidade. Deforma a realidade ao redor.",
      pv: "410 PV",
      instalado: true,
      externo: true,
      tipo: "Demônio / Externo",
      defesa: "36",
      iniciativa: "+14",
      deslocamento: "15m",
      sentidos: "Percepção às cegas 30m",
      fichaCompleta: "Ameaça carregada via suplemento externo da comunidade.\n\nAções:\n• Garras de Matéria Vermelha: +28 para acertar (2d12+12 de dano de corte que ignora RD).\n\nHabilidades Passivas:\n• Aura de Insanidade: Criaturas que iniciam o turno a até 9m devem passar em Vontade (CD 25) ou sofrem 1d6 de dano de Sanidade."
    }
  ]);

  function handleInstalarCriatura(id) {
    setCriaturas(criaturas.map(c => c.id === id ? { ...c, instalado: true } : c));
    alert("Materializando Ameaça... Ficha técnica do monstro sincronizada ao seu painel de mestre!");
  }

  function handleImportarCriatura(event) {
    const arquivo = event.target.files[0];
    if (!arquivo) return;

    const novaCriatura = {
      id: `monstro-externa-${Date.now()}`,
      campanhaId: campanhaAtiva, // Vincula automaticamente à campanha selecionada no momento da importação
      titulo: arquivo.name.replace(/\.[^/.]+$/, "").toUpperCase(),
      nd: "ND ?",
      categoria: "Homebrew",
      descricao: "Dados biológicos e bloco de estatísticas importados com sucesso de fonte externa.",
      pv: "Variável",
      instalado: true,
      externo: true,
      tipo: "Customizado",
      defesa: "Consultar",
      iniciativa: "Consultar",
      deslocamento: "Consultar",
      sentidos: "Especificado no arquivo",
      fichaCompleta: `Arquivo original catalogado: ${arquivo.name}. Esta ficha customizada foi indexada e as ações/habilidades estão salvas para o combate.`
    };

    setCriaturas([novaCriatura, ...criaturas]);
    alert(`Ameaça customizada "${arquivo.name}" foi catalogada no Bestiário Proibido!`);
  }

  // --- TELA DE LEITURA COMPLETA DA CRIATURA ---
  if (criaturaAberta) {
    return (
      <div className={styles.containerGeral}>
        <div className={styles.telaLeituraWiki}>
          
          <div className={styles.headerLeitura}>
            <button className={styles.btnVoltar} onClick={() => setCriaturaAberta(null)}>
              <ChevronLeft size={16} /> Fechar Bestiário
            </button>
            <div className={styles.tagGrupo}>
              <span className={styles.tagCampanhaLeitura}>{criaturaAberta.categoria}</span>
              <span className={styles.tagPapelLeitura}>{criaturaAberta.nd}</span>
              <span className={styles.tagPvLeitura}>{criaturaAberta.pv}</span>
              {criaturaAberta.externo && <span className={styles.tagExternoLeitura}>Homebrew</span>}
            </div>
          </div>

          <div className={styles.corpoLeitura}>
            <div className={styles.layoutLeituraLivro}>
              
              <div className={styles.fichaTecnicaMagia}>
                <div className={styles.runaIconWrapper}>
                  <Skull size={48} className={styles.runaIconVisual} />
                </div>
                <div className={styles.atributosGrid}>
                  <div><strong>Tipo:</strong> <p>{criaturaAberta.tipo}</p></div>
                  <div><strong>Defesa:</strong> <p>{criaturaAberta.defesa}</p></div>
                  <div><strong>Iniciativa:</strong> <p>{criaturaAberta.iniciativa}</p></div>
                  <div><strong>Deslocamento:</strong> <p>{criaturaAberta.deslocamento}</p></div>
                  <div><strong>Sentidos:</strong> <p>{criaturaAberta.sentidos}</p></div>
                  {/* Informação extra exibindo qual campanha é dona deste monstro */}
                  <div><strong>Origem:</strong> <p>{campanhas.find(c => c.id === criaturaAberta.campanhaId)?.nome || "Geral"}</p></div>
                </div>
              </div>
              
              <div className={styles.textoLeituraWrapper}>
                <div className={styles.tituloAlinhamento}>
                  <Swords size={28} className={styles.iconSelo} />
                  <h1 className={styles.tituloArtigoNpc}>{criaturaAberta.titulo}</h1>
                </div>
                <div className={styles.divisorEstilizado} />
                <p className={styles.textoLoreNpc}>{criaturaAberta.fichaCompleta}</p>
                
                <div className={styles.caixaAlertaLeitura}>
                  <Shield size={18} />
                  <span>Todos os modificadores de ataque e testes de resistência desta criatura estão integrados ao rolar de dados rápido.</span>
                </div>
              </div>

            </div>
          </div>

          <div className={styles.rodapeProtegido}>
            <span>O Bestiário segue as diretrizes de balanceamento de encontros para a mesa ativa.</span>
          </div>

        </div>
      </div>
    );
  }

  // Filtros de Aba, Input de Busca e CAMPANHA ATIVA (Com a correção de variável aplicada)
  const criaturasFiltradas = criaturas.filter(c => {
    const naCampanha = c.campanhaId === campanhaAtiva; // Trava por campanha
    
    let correspondeAba = true;
    if (abaAtiva === "instalados") correspondeAba = c.instalado && !c.externo;
    if (abaAtiva === "externos") correspondeAba = c.externo; 
    if (abaAtiva === "todos") correspondeAba = !c.externo;

    const correspondeBusca = c.titulo.toLowerCase().includes(busca.toLowerCase()) || 
                             c.categoria.toLowerCase().includes(busca.toLowerCase());
                             
    return naCampanha && correspondeAba && correspondeBusca;
  });

  return (
    <div className={styles.containerGeral}>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: "none" }} 
        accept=".pdf,.json,.txt"
        onChange={handleImportarCriatura}
      />

      {/* HEADER PRINCIPAL */}
      <div className={styles.headerMenu}>
        <div className={styles.abasPrincipais}>
          <button 
            className={`${styles.btnAbaPrincipal} ${abaAtiva === "instalados" ? styles.abaPrincipalAtiva : ""}`}
            onClick={() => { setAbaAtiva("instalados"); setBusca(""); }}
          >
            <CheckCircle size={16} /> Criaturas Instaladas
          </button>
          <button 
            className={`${styles.btnAbaPrincipal} ${abaAtiva === "todos" ? styles.abaPrincipalAtiva : ""}`}
            onClick={() => { setAbaAtiva("todos"); setBusca(""); }}
          >
            <Eye size={16} /> Todas as Criaturas
          </button>
          <button 
            className={`${styles.btnAbaPrincipal} ${abaAtiva === "externos" ? styles.abaPrincipalAtiva : ""}`}
            onClick={() => { setAbaAtiva("externos"); setBusca(""); }}
          >
            <PlusCircle size={16} /> Criaturas Adicionadas
          </button>
        </div>

        <div className={styles.buscaWrapper}>
          <Search size={18} className={styles.buscaIcon} />
          <input 
            type="text" 
            placeholder="Filtrar criatura, classe ou ND..." 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
      </div>

      {/* PAINEL GRID COM OS CARDS DE AMEAÇAS */}
      <div className={styles.painelRolavel}>
        <div className={styles.secaoLayout}>
          
          <div className={styles.subHeaderInterno}>
            <div>
              <h3>
                {abaAtiva === "instalados" && "Banco de Ameaças Ativas"}
                {abaAtiva === "todos" && "Catálogo de Monstros Universal"}
                {abaAtiva === "externos" && "Criaturas Customizadas (Homebrews)"}
              </h3>
              <p>
                {abaAtiva === "instalados" && "Monstros e NPCs prontos para serem jogados no mapa de combate"}
                {abaAtiva === "todos" && "Todas as raças, feras e entidades catalogadas pelas regras oficiais"}
                {abaAtiva === "externos" && "Ameaças criadas manualmente ou importadas por pacotes de terceiros"}
              </p>
            </div>

            {abaAtiva === "externos" && (
              <button className={styles.btnImportar} onClick={() => fileInputRef.current.click()}>
                <UploadCloud size={16} /> Importar Bloco de Estatísticas (.json/.pdf)
              </button>
            )}
          </div>

          {/* NOVO: Painel Seletor de Campanhas Conectadas (Fiel ao Loots) */}
          <div className={styles.controleCampanhaWrapper}>
            <label htmlFor="select-campanha-modulo" style={{fontSize: '0.75rem', textTransform: 'uppercase', color: '#786666', letterSpacing: '0.5px', fontWeight: 'bold'}}>CAMPANHA SELECIONADA:</label>
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

          {/* Grid de Cards */}
          <div className={styles.gridLivros}>
            {criaturasFiltradas.length > 0 ? (
              criaturasFiltradas.map(criatura => (
                <div key={criatura.id} className={styles.cardLivro}>
                  
                  <div className={styles.capaLivroContainer}>
                    <div className={styles.backgroundRunaVisual} />
                    <Skull className={styles.imagemCapaIcone} size={40} />
                    <div className={styles.overlayCapa}>
                      <span className={styles.badgeCategoriaCapa}>{criatura.categoria}</span>
                    </div>
                  </div>

                  <div className={styles.livroInfoCorpo}>
                    <div className={styles.livroMetaHeader}>
                      <span className={styles.livroVersao}>{criatura.nd}</span>
                      <span className={styles.badgeMana}>{criatura.pv}</span>
                    </div>
                    
                    <h4>{criatura.titulo}</h4>
                    <p className={styles.descricaoLivroShort}>{criatura.descricao}</p>
                    
                    {criatura.instalado ? (
                      <button className={styles.btnAbrirLivro} onClick={() => setCriaturaAberta(criatura)}>
                        <Swords size={14} /> Detalhar Monstro
                      </button>
                    ) : (
                      <button className={styles.btnInstalarLivro} onClick={() => handleInstalarCriatura(criatura.id)}>
                        <DownloadCloud size={14} /> Sintonizar Ameaça
                      </button>
                    )}
                  </div>

                </div>
              ))
            ) : (
              /* Fallback visual caso não existam monstros nos parâmetros da campanha atual */
              <div className={styles.caixaAlertaLeitura} style={{gridColumn: '1/-1'}}>
                <ShieldAlert size={18} style={{color: '#ff6b7a'}} />
                <span>Nenhuma criatura ou ameaça mística localizada sob estes parâmetros nesta campanha.</span>
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}