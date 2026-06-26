import { useState, useEffect, useRef } from "react";
import { Search, Swords, Shield, CheckCircle, ChevronLeft, Sparkles, Scroll, PlusCircle, UploadCloud, Package } from "lucide-react";
import { sistemaService } from "../../../services/sistemaService";
import { entidadeSistemaService } from "../../../services/entidadeSistemaService";
import styles from "./styles.Habilidades.module.css";

export default function Habilidades() {
  const [abaAtiva, setAbaAtiva] = useState("todos");
  const [busca, setBusca] = useState("");
  const [habilidadeAberta, setHabilidadeAberta] = useState(null);
  const fileInputRef = useRef(null);

  const [sistemas, setSistemas] = useState([]);
  const [sistemaAtivo, setSistemaAtivo] = useState(null);
  const [habilidades, setHabilidades] = useState([]);
  const [habilidadesExternas, setHabilidadesExternas] = useState([]);

  const [carregandoSistemas, setCarregandoSistemas] = useState(true);
  const [carregandoHabilidades, setCarregandoHabilidades] = useState(false);

  // 1. Carrega todos os sistemas disponíveis
  useEffect(() => {
    async function carregarSistemas() {
      try {
        const resp = await sistemaService.listarTodos();
        const lista = resp?.data || resp || [];
        const array = Array.isArray(lista) ? lista : [];
        setSistemas(array);
        if (array.length > 0) setSistemaAtivo(array[0]);
      } catch (err) {
        console.error("Erro ao carregar sistemas:", err);
      } finally {
        setCarregandoSistemas(false);
      }
    }
    carregarSistemas();
  }, []);

  // 2. Quando o sistema ativo muda, busca as entidades e filtra tipo "habilidade"
  useEffect(() => {
    if (!sistemaAtivo?.id) return;

    async function carregarHabilidades() {
      setCarregandoHabilidades(true);
      setHabilidades([]);
      try {
        const resp = await entidadeSistemaService.listarPorSistema(sistemaAtivo.id);
        const lista = resp?.data || resp || [];
        const array = Array.isArray(lista) ? lista : [];

        const habs = array
          .filter((e) => e.tipo === "habilidade")
          .map((e) => ({
            id: e.id,
            titulo: e.nome || "Sem nome",
            requisito: e.atributos?.requisito || e.requisito || "—",
            categoria: e.atributos?.categoria || e.categoria || "Geral",
            descricao: e.descricao || e.atributos?.descricao || "",
            custo: e.atributos?.custo || e.custo || "—",
            acao: e.atributos?.acao || "—",
            alcance: e.atributos?.alcance || "—",
            alvo: e.atributos?.alvo || "—",
            duracao: e.atributos?.duracao || "—",
            teste: e.atributos?.teste || "—",
            efeitoCompleto: e.atributos?.efeitoCompleto || e.atributos?.efeito || e.descricao || "Sem descrição detalhada.",
            externo: false,
          }));

        setHabilidades(habs);
      } catch (err) {
        console.error("Erro ao carregar habilidades:", err);
      } finally {
        setCarregandoHabilidades(false);
      }
    }
    carregarHabilidades();
  }, [sistemaAtivo]);

  function handleImportarHabilidade(event) {
    const arquivo = event.target.files[0];
    if (!arquivo) return;
    const nova = {
      id: `hab-externa-${Date.now()}`,
      titulo: arquivo.name.replace(/\.[^/.]+$/, "").toUpperCase(),
      requisito: "Custom",
      categoria: "Externo",
      descricao: "Técnica externa adicionada manualmente.",
      custo: "Variável",
      acao: "Consultar Documento",
      alcance: "Variável",
      alvo: "Especificado no arquivo",
      duracao: "Variável",
      teste: "Variável",
      efeitoCompleto: `Arquivo original: ${arquivo.name}. Regras customizadas indexadas ao acervo.`,
      externo: true,
    };
    setHabilidadesExternas([nova, ...habilidadesExternas]);
    alert(`Módulo "${arquivo.name}" indexado ao seu acervo!`);
  }

  // Todas as habilidades para exibição (sistema + externas)
  const todasHabilidades = [...habilidades, ...habilidadesExternas];

  const habilidadesFiltradas = todasHabilidades.filter((h) => {
    let correspondeAba = true;
    if (abaAtiva === "todos") correspondeAba = !h.externo;
    if (abaAtiva === "externos") correspondeAba = h.externo;

    const correspondeBusca =
      h.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      h.categoria.toLowerCase().includes(busca.toLowerCase());

    return correspondeAba && correspondeBusca;
  });

  // Tela de detalhe
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
              {habilidadeAberta.externo && (
                <span className={styles.tagExternoLeitura}>Homebrew</span>
              )}
            </div>
          </div>

          <div className={styles.corpoLeitura}>
            <div className={styles.layoutLeituraLivro}>
              <div className={styles.fichaTecnicaMagia}>
                <div className={styles.runaIconWrapper}>
                  {habilidadeAberta.categoria === "Ataque" ? (
                    <Swords size={48} className={styles.runaIconVisual} />
                  ) : (
                    <Shield size={48} className={styles.runaIconVisual} />
                  )}
                </div>
                <div className={styles.atributosGrid}>
                  <div><strong>Ação:</strong><p>{habilidadeAberta.acao}</p></div>
                  <div><strong>Alcance:</strong><p>{habilidadeAberta.alcance}</p></div>
                  <div><strong>Alvo/Área:</strong><p>{habilidadeAberta.alvo}</p></div>
                  <div><strong>Duração:</strong><p>{habilidadeAberta.duracao}</p></div>
                  <div><strong>Teste/Save:</strong><p>{habilidadeAberta.teste}</p></div>
                </div>
              </div>

              <div className={styles.textoLeituraWrapper}>
                <div className={styles.tituloAlinhamento}>
                  <Scroll size={28} className={styles.iconSelo} />
                  <h1 className={styles.tituloArtigoNpc}>{habilidadeAberta.titulo}</h1>
                </div>
                <div className={styles.divisorEstilizado} />
                <p className={styles.textoLoreNpc}>{habilidadeAberta.efeitoCompleto}</p>
                <div className={styles.caixaAlertaLeitura}>
                  <Sparkles size={18} />
                  <span>
                    Habilidade do sistema{" "}
                    <strong>{sistemaAtivo?.nome || "atual"}</strong>. Consulte
                    seu Mestre para adquiri-la.
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.rodapeProtegido}>
            <span>
              Compêndio de Técnicas vinculado ao sistema{" "}
              {sistemaAtivo?.nome || ""}.
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.containerGeral}>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept=".pdf,.json,.txt"
        onChange={handleImportarHabilidade}
      />

      {/* SIDEBAR DE SISTEMAS */}
      {/* <aside className={styles.sidebarCampanhas}>
        <div className={styles.labelSecao}>SISTEMAS</div>
        {carregandoSistemas ? (
          <p style={{ color: "var(--cor-texto-muted, #888)", padding: "0 1rem", fontSize: "0.8rem" }}>
            Carregando...
          </p>
        ) : sistemas.length === 0 ? (
          <p style={{ color: "var(--cor-texto-muted, #888)", padding: "0 1rem", fontSize: "0.8rem" }}>
            Nenhum sistema encontrado.
          </p>
        ) : (
          <div className={styles.listaCampanhasLayout}>
            {sistemas.map((s) => (
              <button
                key={s.id}
                className={`${styles.itemCampanhaBtn} ${sistemaAtivo?.id === s.id ? styles.itemCampanhaAtivo : ""}`}
                onClick={() => setSistemaAtivo(s)}
              >
                <Package size={18} className={styles.iconeCampanhaBtn} />
                <span className={styles.nomeCampanhaTexto}>{s.nome || s.name || s.id}</span>
              </button>
            ))}
          </div>
        )}
      </aside> */}

      {/* PAINEL PRINCIPAL */}
      <div className={styles.painelPrincipalConteudo ?? styles.containerGeral}>
        <div className={styles.headerMenu}>
          <div className={styles.abasPrincipais}>
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

        <div className={styles.painelRolavel}>
          <div className={styles.secaoLayout}>
            <div className={styles.subHeaderInterno}>
              <div>
                <h3>
                  {abaAtiva === "todos" && `Compêndio — ${sistemaAtivo?.nome || "Sistema"}`}
                  {abaAtiva === "externos" && "Doutrinas Customizadas"}
                </h3>
                <p>
                  {abaAtiva === "todos" && "Lista completa de habilidades disponíveis no sistema selecionado."}
                  {abaAtiva === "externos" && "Regras de manobras alternativas ou homebrews carregados localmente."}
                </p>
              </div>
              {abaAtiva === "externos" && (
                <button className={styles.btnImportar} onClick={() => fileInputRef.current.click()}>
                  <UploadCloud size={16} /> Importar Técnica (.json)
                </button>
              )}
            </div>

            {carregandoHabilidades ? (
              <p style={{ color: "var(--cor-texto-muted, #888)", padding: "1rem 0" }}>
                Carregando habilidades...
              </p>
            ) : (
              <div className={styles.gridLivros}>
                {habilidadesFiltradas.length === 0 ? (
                  <p style={{ color: "var(--cor-texto-muted, #888)" }}>
                    Nenhuma habilidade encontrada para este sistema.
                  </p>
                ) : (
                  habilidadesFiltradas.map((hab) => (
                    <div key={hab.id} className={styles.cardLivro}>
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
                        <button
                          className={styles.btnAbrirLivro}
                          onClick={() => setHabilidadeAberta(hab)}
                        >
                          <Scroll size={14} /> Detalhar Técnica
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}