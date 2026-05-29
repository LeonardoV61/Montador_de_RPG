import { useState, useRef } from "react";
import { Search, Flame, Wand2, DownloadCloud, CheckCircle, ChevronLeft, Sparkles, Scroll, PlusCircle, UploadCloud } from "lucide-react";
import styles from "./styles.CodexArcano.module.css";

export default function CodexArcano() {
  const [abaAtiva, setAbaAtiva] = useState("instalados");
  const [busca, setBusca] = useState("");
  const [magiaAberta, setMagiaAberta] = useState(null);
  
  const fileInputRef = useRef(null);

  // Estado inicial simulando pacotes de magias/escolas
  const [magias, setMagias] = useState([
    {
      id: "magia-1",
      titulo: "BOLA DE FOGO",
      circulo: "2º Círculo",
      categoria: "Evocação",
      descricao: "Uma centelha que explode em uma violenta esfera de chamas, causando dano massivo em área.",
      pm: "3 PM",
      instalado: true,
      externo: false,
      execucao: "Padrão",
      alcance: "Médio",
      alvo: "Esfera com 6m de raio",
      duracao: "Instantânea",
      resistencia: "Reflexos reduz metade",
      efeitoCompleto: "Você conjura uma esfera de fogo que explode no ponto escolhido. Todas as criaturas na área sofrem 6d6 de dano de fogo. Gastando +2 PM, você aumenta o dano em +2d6 chamas místicas."
    },
    {
      id: "magia-2",
      titulo: "CURA RECOVERY",
      circulo: "1º Círculo",
      categoria: "Necromancia (Cura)",
      descricao: "Canais de energia positiva fluem pelas suas mãos, fechando feridas abertas instantaneamente.",
      pm: "1 PM",
      instalado: true,
      externo: false,
      execucao: "Padrão",
      alcance: "Toque",
      alvo: "1 Criatura",
      duracao: "Instantânea",
      resistencia: "Nenhuma",
      efeitoCompleto: "A criatura tocada recupera 2d8+2 pontos de vida. Se usada contra mortos-vivos, causa dano de luz equivalente ao invés de curar. Aprimoramento (+2 PM): Cura todos os aliados adjacentes."
    },
    {
      id: "magia-3",
      titulo: "SALTO TEMPORAL",
      circulo: "3º Círculo",
      categoria: "Transmutação",
      descricao: "Dobre as linhas do espaço-tempo para piscar pelo campo de batalha sem sofrer retaliações.",
      pm: "5 PM",
      instalado: false,
      externo: false,
      execucao: "Movimento",
      alcance: "Curto",
      alvo: "Você mesmo",
      duracao: "Instantânea",
      resistencia: "Nenhuma",
      efeitoCompleto: "Você se teleporta instantaneamente para um local desocupado que consiga enxergar. Não provoca ataques de oportunidade. Aprimoramento (+3 PM): Deixa uma cópia ilusória temporal no local de origem por 1 rodada."
    },
    {
      id: "magia-externa-1",
      titulo: "INVOCAÇÃO DO CAOS HOMEBREW",
      circulo: "4º Círculo",
      categoria: "Convocação",
      descricao: "Feitiço customizado importado da biblioteca comunitária. Rompe o véu da realidade elemental.",
      pm: "7 PM",
      instalado: true,
      externo: true,
      execucao: "Completa",
      alcance: "Longo",
      alvo: "Área customizada",
      duracao: "Sustentada",
      resistencia: "Vontade anula",
      efeitoCompleto: "Este feitiço experimental evoca uma tempestade caótica de runas antigas. A cada rodada, o mestre rola um dado na tabela de efeitos aleatórios para definir o elemento do dano."
    }
  ]);

  function handleInstalarMagia(id) {
    setMagias(magias.map(m => m.id === id ? { ...m, instalado: true } : m));
    alert("Canalizando éter... Matriz arcana integrada ao seu grimório!");
  }

  function handleImportarMagia(event) {
    const arquivo = event.target.files[0];
    if (!arquivo) return;

    const novaMagia = {
      id: `magia-externa-${Date.now()}`,
      titulo: arquivo.name.replace(/\.[^/.]+$/, "").toUpperCase(),
      circulo: "Custom",
      categoria: "Externo",
      descricao: "Matriz rúnica externa adicionada manualmente e pronta para canalização.",
      pm: "Variável",
      instalado: true,
      externo: true,
      execucao: "Consultar Documento",
      alcance: "Variável",
      alvo: "Especificado no arquivo",
      duracao: "Variável",
      resistencia: "Variável",
      efeitoCompleto: `Arquivo de runas original: ${arquivo.name}. O pacote de regras customizado foi indexado e está disponível para seus conjuradores.`
    };

    setMagias([novaMagia, ...magias]);
    alert(`Módulo de feitiços "${arquivo.name}" foi indexado ao Codex Proibido!`);
  }

  // --- TELA DE LEITURA COMPLETA DA MAGIA (ESTILO WIKI MATRIX) ---
  if (magiaAberta) {
    return (
      <div className={styles.containerGeral}>
        <div className={styles.telaLeituraWiki}>
          
          <div className={styles.headerLeitura}>
            <button className={styles.btnVoltar} onClick={() => setMagiaAberta(null)}>
              <ChevronLeft size={16} /> Fechar Codex
            </button>
            <div className={styles.tagGrupo}>
              <span className={styles.tagCampanhaLeitura}>{magiaAberta.categoria}</span>
              <span className={styles.tagPapelLeitura}>{magiaAberta.circulo}</span>
              <span className={styles.tagPmLeitura}>{magiaAberta.pm}</span>
              {magiaAberta.externo && <span className={styles.tagExternoLeitura}>Homebrew</span>}
            </div>
          </div>

          <div className={styles.corpoLeitura}>
            <div className={styles.layoutLeituraLivro}>
              
              {/* Painel Lateral Esquerdo de Atributos da Magia */}
              <div className={styles.fichaTecnicaMagia}>
                <div className={styles.runaIconWrapper}>
                  <Flame size={48} className={styles.runaIconVisual} />
                </div>
                <div className={styles.atributosGrid}>
                  <div><strong>Execução:</strong> <p>{magiaAberta.execucao}</p></div>
                  <div><strong>Alcance:</strong> <p>{magiaAberta.alcance}</p></div>
                  <div><strong>Alvo/Área:</strong> <p>{magiaAberta.alvo}</p></div>
                  <div><strong>Duração:</strong> <p>{magiaAberta.duracao}</p></div>
                  <div><strong>Resistência:</strong> <p>{magiaAberta.resistencia}</p></div>
                </div>
              </div>
              
              {/* Corpo de Texto Direito */}
              <div className={styles.textoLeituraWrapper}>
                <div className={styles.tituloAlinhamento}>
                  <Scroll size={28} className={styles.iconSelo} />
                  <h1 className={styles.tituloArtigoNpc}>{magiaAberta.titulo}</h1>
                </div>
                <div className={styles.divisorEstilizado} />
                <p className={styles.textoLoreNpc}>{magiaAberta.efeitoCompleto}</p>
                
                <div className={styles.caixaAlertaLeitura}>
                  <Wand2 size={18} />
                  <span>Custo modular calculado automaticamente na sua barra de macro de atalhos rápidos.</span>
                </div>
              </div>

            </div>
          </div>

          <div className={styles.rodapeProtegido}>
            <span>O Codex Arcano segue as diretrizes universais de conjuração mística da mesa ativa.</span>
          </div>

        </div>
      </div>
    );
  }

  // Filtros de Aba e Input de Busca
  const magiasFiltradas = magias.filter(m => {
    let correspondeAba = true;
    if (abaAtiva === "instalados") correspondeAba = m.instalado && !m.externo;
    if (abaAtiva === "externos") correspondeAba = m.externo;
    if (abaAtiva === "todos") correspondeAba = !m.externo;

    const correspondeBusca = m.titulo.toLowerCase().includes(busca.toLowerCase()) || 
                             m.categoria.toLowerCase().includes(busca.toLowerCase());
    return correspondeAba && correspondeBusca;
  });

  return (
    <div className={styles.containerGeral}>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: "none" }} 
        accept=".pdf,.json,.txt"
        onChange={handleImportarMagia}
      />

      {/* HEADER PRINCIPAL */}
      <div className={styles.headerMenu}>
        <div className={styles.abasPrincipais}>
          <button 
            className={`${styles.btnAbaPrincipal} ${abaAtiva === "instalados" ? styles.abaPrincipalAtiva : ""}`}
            onClick={() => { setAbaAtiva("instalados"); setBusca(""); }}
          >
            <CheckCircle size={16} /> Magias Instaladas
          </button>
          <button 
            className={`${styles.btnAbaPrincipal} ${abaAtiva === "todos" ? styles.abaPrincipalAtiva : ""}`}
            onClick={() => { setAbaAtiva("todos"); setBusca(""); }}
          >
            <Sparkles size={16} /> Todas as Magias
          </button>
          <button 
            className={`${styles.btnAbaPrincipal} ${abaAtiva === "externos" ? styles.abaPrincipalAtiva : ""}`}
            onClick={() => { setAbaAtiva("externos"); setBusca(""); }}
          >
            <PlusCircle size={16} /> Magias Adicionadas
          </button>
        </div>

        <div className={styles.buscaWrapper}>
          <Search size={18} className={styles.buscaIcon} />
          <input 
            type="text" 
            placeholder="Filtrar feitiço, escola ou círculo..." 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
      </div>

      {/* PAINEL GRID COM OS CARDS DE MATRIZES ARCANAS */}
      <div className={styles.painelRolavel}>
        <div className={styles.secaoLayout}>
          
          <div className={styles.subHeaderInterno}>
            <div>
              <h3>
                {abaAtiva === "instalados" && "Grimório Ativo da Mesa"}
                {abaAtiva === "todos" && "Compêndio de Feitiçaria Universal"}
                {abaAtiva === "externos" && "Encantamentos Customizados"}
              </h3>
              <p>
                {abaAtiva === "instalados" && "Matrizes elementais liberadas para aprendizado dos seus heróis"}
                {abaAtiva === "todos" && "Todos as escolas clássicas e rituais divinos catalogados pelo sistema"}
                {abaAtiva === "externos" && "Feitiços caseiros (homebrews) carregados de fontes externas"}
              </p>
            </div>

            {abaAtiva === "externos" && (
              <button className={styles.btnImportar} onClick={() => fileInputRef.current.click()}>
                <UploadCloud size={16} /> Importar Matriz (.json/.pdf)
              </button>
            )}
          </div>

          <div className={styles.gridLivros}>
            {magiasFiltradas.map(magia => (
              <div key={magia.id} className={styles.cardLivro}>
                
                {/* Visual Header do Card (Representando o Display Místico) */}
                <div className={styles.capaLivroContainer}>
                  <div className={styles.backgroundRunaVisual} />
                  <Wand2 className={styles.imagemCapaIcone} size={40} />
                  <div className={styles.overlayCapa}>
                    <span className={styles.badgeCategoriaCapa}>{magia.categoria}</span>
                  </div>
                </div>

                <div className={styles.livroInfoCorpo}>
                  <div className={styles.livroMetaHeader}>
                    <span className={styles.livroVersao}>{magia.circulo}</span>
                    <span className={styles.badgeMana}>{magia.pm}</span>
                  </div>
                  
                  <h4>{magia.titulo}</h4>
                  <p className={styles.descricaoLivroShort}>{magia.descricao}</p>
                  
                  {magia.instalado ? (
                    <button className={styles.btnAbrirLivro} onClick={() => setMagiaAberta(magia)}>
                      <Scroll size={14} /> Detalhar Matriz
                    </button>
                  ) : (
                    <button className={styles.btnInstalarLivro} onClick={() => handleInstalarMagia(magia.id)}>
                      <DownloadCloud size={14} /> Sintonizar Runa
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