import { useState, useRef } from "react";
import { Search, Swords, Shield, DownloadCloud, CheckCircle, ChevronLeft, Sparkles, Scroll, PlusCircle, UploadCloud } from "lucide-react";
import styles from "./styles.Habilidades.module.css";

export default function Habilidades() {
  const [abaAtiva, setAbaAtiva] = useState("instalados");
  const [busca, setBusca] = useState("");
  const [habilidadeAberta, setHabilidadeAberta] = useState(null);
  
  const fileInputRef = useRef(null);


  const [habilidades, setHabilidades] = useState([
    {
      id: "hab-1",
      titulo: "GOLPE TRESPASSANTE",
      requisito: "Veterano",
      categoria: "Ataque",
      descricao: "Um ataque em arco capaz de atingir múltiplos inimigos ao seu redor com uma arma pesada.",
      custo: "2 Vigor",
      instalado: true,
      externo: false,
      acao: "Padrão",
      alcance: "Corpo-a-Corpo",
      alvo: "Até 3 adjacentes",
      duracao: "Instantânea",
      teste: "Reflexos reduz metade",
      efeitoCompleto: "Você desfere um golpe circular com sua arma. Faça uma rolagem de dano normal; o resultado é aplicado a todos os inimigos na área de ameaça. Aliados devem fazer um teste de DES para evitar o dano excedente."
    },
    {
      id: "hab-2",
      titulo: "POSTURA DA FORTALEZA",
      requisito: "Iniciante",
      categoria: "Defesa",
      descricao: "Uma postura inabalável que endurece os músculos e ignora ferimentos superficiais.",
      custo: "1 Vigor",
      instalado: true,
      externo: false,
      acao: "Movimento",
      alcance: "Pessoal",
      alvo: "Você mesmo",
      duracao: "Sustentada (Até mover)",
      teste: "Nenhum",
      efeitoCompleto: "Você firma os pés no chão. Enquanto mantiver esta postura, você ganha Armadura +1 e ignora o primeiro ponto de dano à sua Guarda em cada rodada. Qualquer movimento voluntário encerra a postura."
    },
    {
      id: "hab-3",
      titulo: "INVESTIDA IMPLACÁVEL",
      requisito: "Mestre",
      categoria: "Ataque",
      descricao: "Use o peso da armadura e o ímpeto para esmagar a Guarda adversária.",
      custo: "3 Vigor",
      instalado: false,
      externo: false,
      acao: "Rodada Completa",
      alcance: "Até 9m",
      alvo: "1 Criatura",
      duracao: "Instantânea",
      teste: "FOR para não cair",
      efeitoCompleto: "Você se move em linha reta em direção ao alvo e ataca. Você rola seu dado de dano com Vantagem. Se o alvo for menor ou do mesmo tamanho que você, ele é arremessado 2 metros para trás e fica Caído."
    },
    {
      id: "hab-externa-1",
      titulo: "TÉCNICA DO LOBO HOMEBREW",
      requisito: "Custom",
      categoria: "Exploração",
      descricao: "Técnica de caça adaptada da guilda dos rastreadores. Sentidos aguçados na selva.",
      custo: "Sem Custo",
      instalado: true,
      externo: true,
      acao: "Exploração (10 min)",
      alcance: "1 Hexágono",
      alvo: "Terreno",
      duracao: "Passiva",
      teste: "Nenhum",
      efeitoCompleto: "Esta técnica caseira permite ao Cavaleiro identificar rastros de Mitos antigos que passaram pela área nas últimas 24 horas, revelando sua direção geral."
    }
  ]);

  function handleInstalarHabilidade(id) {
    setHabilidades(habilidades.map(h => h.id === id ? { ...h, instalado: true } : h));
    alert("Absorvendo conhecimento tático... Técnica integrada ao seu compêndio!");
  }

  function handleImportarHabilidade(event) {
    const arquivo = event.target.files[0];
    if (!arquivo) return;

    const novaHab = {
      id: `hab-externa-${Date.now()}`,
      titulo: arquivo.name.replace(/\.[^/.]+$/, "").toUpperCase(),
      requisito: "Custom",
      categoria: "Externo",
      descricao: "Técnica militar externa adicionada manualmente à sua ficha.",
      custo: "Variável",
      instalado: true,
      externo: true,
      acao: "Consultar Documento",
      alcance: "Variável",
      alvo: "Especificado no arquivo",
      duracao: "Variável",
      teste: "Variável",
      efeitoCompleto: `Arquivo de doutrina original: ${arquivo.name}. O pacote de regras customizado foi indexado e está disponível para uso do seu Cavaleiro.`
    };

    setHabilidades([novaHab, ...habilidades]);
    alert(`Módulo de táticas "${arquivo.name}" foi indexado ao seu acervo!`);
  }

  if (habilidadeAberta) {
    return (
      <div className={styles.containerGeral}>
        <div className={styles.telaLeituraWiki}>
          
          <div className={styles.headerLeitura}>
            <button className={styles.btnVoltar} onClick={() => setHabilidadeAberta(null)}>
              <ChevronLeft size={16} /> Fechar Compêndio
            </button>
            <div className={styles.tagGrupo}>
              <span className={styles.tagCampanhaLeitura}>{habilidadeAberta.categoria}</span>
              <span className={styles.tagPapelLeitura}>{habilidadeAberta.requisito}</span>
              <span className={styles.tagCustoLeitura}>{habilidadeAberta.custo}</span>
              {habilidadeAberta.externo && <span className={styles.tagExternoLeitura}>Homebrew</span>}
            </div>
          </div>

          <div className={styles.corpoLeitura}>
            <div className={styles.layoutLeituraLivro}>
              
              {}
              <div className={styles.fichaTecnicaMagia}>
                <div className={styles.runaIconWrapper}>
                  {habilidadeAberta.categoria === "Ataque" ? <Swords size={48} className={styles.runaIconVisual} /> : <Shield size={48} className={styles.runaIconVisual} />}
                </div>
                <div className={styles.atributosGrid}>
                  <div><strong>Ação:</strong> <p>{habilidadeAberta.acao}</p></div>
                  <div><strong>Alcance:</strong> <p>{habilidadeAberta.alcance}</p></div>
                  <div><strong>Alvo/Área:</strong> <p>{habilidadeAberta.alvo}</p></div>
                  <div><strong>Duração:</strong> <p>{habilidadeAberta.duracao}</p></div>
                  <div><strong>Teste/Save:</strong> <p>{habilidadeAberta.teste}</p></div>
                </div>
              </div>
              
              {}
              <div className={styles.textoLeituraWrapper}>
                <div className={styles.tituloAlinhamento}>
                  <Scroll size={28} className={styles.iconSelo} />
                  <h1 className={styles.tituloArtigoNpc}>{habilidadeAberta.titulo}</h1>
                </div>
                <div className={styles.divisorEstilizado} />
                <p className={styles.textoLoreNpc}>{habilidadeAberta.efeitoCompleto}</p>
                
                <div className={styles.caixaAlertaLeitura}>
                  <Sparkles size={18} />
                  <span>Esta habilidade foi vinculada à sua ficha. O gasto de Vigor será deduzido automaticamente ao usar o macro.</span>
                </div>
              </div>

            </div>
          </div>

          <div className={styles.rodapeProtegido}>
            <span>Compêndio de Técnicas de Combate atrelado à licença de Mythic Bastionland local.</span>
          </div>

        </div>
      </div>
    );
  }


  const habilidadesFiltradas = habilidades.filter(h => {
    let correspondeAba = true;
    if (abaAtiva === "instalados") correspondeAba = h.instalado && !h.externo;
    if (abaAtiva === "externos") correspondeAba = h.externo;
    if (abaAtiva === "todos") correspondeAba = !h.externo;

    const correspondeBusca = h.titulo.toLowerCase().includes(busca.toLowerCase()) || 
                             h.categoria.toLowerCase().includes(busca.toLowerCase());
    return correspondeAba && correspondeBusca;
  });

  return (
    <div className={styles.containerGeral}>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: "none" }} 
        accept=".pdf,.json,.txt"
        onChange={handleImportarHabilidade}
      />

      {}
      <div className={styles.headerMenu}>
        <div className={styles.abasPrincipais}>
          <button 
            className={`${styles.btnAbaPrincipal} ${abaAtiva === "instalados" ? styles.abaPrincipalAtiva : ""}`}
            onClick={() => { setAbaAtiva("instalados"); setBusca(""); }}
          >
            <CheckCircle size={16} /> Técnicas Instaladas
          </button>
          <button 
            className={`${styles.btnAbaPrincipal} ${abaAtiva === "todos" ? styles.abaPrincipalAtiva : ""}`}
            onClick={() => { setAbaAtiva("todos"); setBusca(""); }}
          >
            <Swords size={16} /> Todas as Técnicas
          </button>
          <button 
            className={`${styles.btnAbaPrincipal} ${abaAtiva === "externos" ? styles.abaPrincipalAtiva : ""}`}
            onClick={() => { setAbaAtiva("externos"); setBusca(""); }}
          >
            <PlusCircle size={16} /> Adicionadas (Mods)
          </button>
        </div>

        <div className={styles.buscaWrapper}>
          <Search size={18} className={styles.buscaIcon} />
          <input 
            type="text" 
            placeholder="Filtrar técnica, escola ou requisito..." 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
      </div>

      {}
      <div className={styles.painelRolavel}>
        <div className={styles.secaoLayout}>
          
          <div className={styles.subHeaderInterno}>
            <div>
              <h3>
                {abaAtiva === "instalados" && "Manuais de Combate da Ficha"}
                {abaAtiva === "todos" && "Compêndio Geral do Sistema"}
                {abaAtiva === "externos" && "Doutrinas Customizadas"}
              </h3>
              <p>
                {abaAtiva === "instalados" && "Habilidades atualmente preparadas e memorizadas pelo seu Cavaleiro."}
                {abaAtiva === "todos" && "Lista completa de progressão, talentos e artes marciais disponíveis."}
                {abaAtiva === "externos" && "Regras de manobras alternativas ou homebrews carregados localmente."}
              </p>
            </div>

            {abaAtiva === "externos" && (
              <button className={styles.btnImportar} onClick={() => fileInputRef.current.click()}>
                <UploadCloud size={16} /> Importar Técnica (.json)
              </button>
            )}
          </div>

          <div className={styles.gridLivros}>
            {habilidadesFiltradas.map(hab => (
              <div key={hab.id} className={styles.cardLivro}>
                
                {}
                <div className={styles.capaLivroContainer}>
                  <div className={styles.backgroundRunaVisual} />
                  {hab.categoria === "Ataque" ? (
                    <Swords className={styles.imagemCapaIcone} size={48} />
                  ) : hab.categoria === "Defesa" ? (
                    <Shield className={styles.imagemCapaIcone} size={48} />
                  ) : (
                    <Sparkles className={styles.imagemCapaIcone} size={48} />
                  )}
                  <div className={styles.overlayCapa}>
                    <span className={styles.badgeCategoriaCapa}>{hab.categoria}</span>
                  </div>
                </div>

                <div className={styles.livroInfoCorpo}>
                  <div className={styles.livroMetaHeader}>
                    <span className={styles.livroVersao}>{hab.requisito}</span>
                    <span className={styles.badgeCusto}>{hab.custo}</span>
                  </div>
                  
                  <h4>{hab.titulo}</h4>
                  <p className={styles.descricaoLivroShort}>{hab.descricao}</p>
                  
                  {hab.instalado ? (
                    <button className={styles.btnAbrirLivro} onClick={() => setHabilidadeAberta(hab)}>
                      <Scroll size={14} /> Detalhar Técnica
                    </button>
                  ) : (
                    <button className={styles.btnInstalarLivro} onClick={() => handleInstalarHabilidade(hab.id)}>
                      <DownloadCloud size={14} /> Aprender Manobra
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