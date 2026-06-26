import { useState, useEffect } from "react";
import { Search, ShieldAlert, Sword, Coins, Flame, Eye, Package, ChevronLeft } from "lucide-react";
import { personagemService } from "../../../services/personagemService";
import { entidadeInstanciaService } from "../../../services/entidadeInstanciaService";
import { usuarioService } from "../../../services/usuarioService";
import styles from "./styles.inventario.module.css";

export default function Inventario() {
  const [abaAtiva, setAbaAtiva] = useState("todos");
  const [busca, setBusca] = useState("");
  const [itemAberto, setItemAberto] = useState(null);

  const [personagens, setPersonagens] = useState([]);
  const [personagemAtivo, setPersonagemAtivo] = useState(null);

  // Itens reais: relações do tipo "item" vindas da instância do personagem
  const [itens, setItens] = useState([]);
  const [carregandoPersonagens, setCarregandoPersonagens] = useState(true);
  const [carregandoItens, setCarregandoItens] = useState(false);

  // Moedas: lidas dos atributos da instância do personagem
  const [moedas, setMoedas] = useState({});
  const capacidadeMaxima = 50;

  // 1. Carrega os personagens do usuário logado (igual ao Personagens.jsx)
  useEffect(() => {
    async function carregarPersonagens() {
      try {
        const perfil = await usuarioService.perfil();
        const usuarioId = perfil?.data?.id || perfil?.id;
        if (usuarioId) {
          const resp = await personagemService.listarPorUsuario(usuarioId);
          const lista = resp?.data || resp || [];
          const array = Array.isArray(lista) ? lista : [];
          setPersonagens(array);
          // Seleciona o primeiro personagem automaticamente
          if (array.length > 0) setPersonagemAtivo(array[0]);
        }
      } catch (err) {
        console.error("Erro ao carregar personagens:", err);
      } finally {
        setCarregandoPersonagens(false);
      }
    }
    carregarPersonagens();
  }, []);

  // 2. Quando o personagem ativo muda, busca as relações da sua instância
  //    e filtra as que têm tipo "item", buscando os detalhes de cada uma
  useEffect(() => {
    if (!personagemAtivo?.instanciaId) return;

    async function carregarItens() {
      setCarregandoItens(true);
      setItens([]);
      setMoedas({});
      try {
        const instanciaId = personagemAtivo.instanciaId;

        // Busca instância (para moedas/atributos) e relações em paralelo
        const [respInstancia, respRelacoes] = await Promise.all([
          entidadeInstanciaService.buscarPorId(instanciaId),
          entidadeInstanciaService.listarRelacoes(instanciaId),
        ]);

        // Extrai moedas dos atributos da instância
        const dadosInstancia = respInstancia?.data || respInstancia;
        const atributos =
          dadosInstancia?.atributosAtuais ||
          dadosInstancia?.valoresAtributos ||
          dadosInstancia?.atributos ||
          {};
        // Convenciona que moedas são atributos cujas chaves são siglas (ex: TO, TQ, PC, PO...)
        const moedasEncontradas = Object.fromEntries(
          Object.entries(atributos).filter(
            ([k, v]) => typeof v === "number" && k === k.toUpperCase() && k.length <= 3
          )
        );
        setMoedas(moedasEncontradas);

        // Filtra relações cujo filho é do tipo "item"
        const listaRelacoes = respRelacoes?.data || respRelacoes || [];
        const relacoes = Array.isArray(listaRelacoes) ? listaRelacoes : [];

        // Busca os detalhes de cada entidade filha em paralelo
        const promessas = relacoes.map((rel) =>
          entidadeInstanciaService
            .buscarPorId(rel.idEntidadeFilha)
            .then((res) => ({ rel, dados: res?.data || res }))
            .catch(() => null)
        );
        const resultados = await Promise.all(promessas);

        // Monta os itens apenas onde o tipo da entidade filha é "item"
        const itensReais = resultados
          .filter((r) => r && r.dados?.tipo === "item")
          .map(({ rel, dados }) => ({
            id: rel.idEntidadeFilha,
            titulo: dados.instanciaNome || dados.nome || rel.nomeEntidadeFilha || "Item sem nome",
            subtitulo: dados.subtitulo || dados.atributosAtuais?.subtitulo || "",
            categoria: dados.raridade || dados.atributosAtuais?.raridade || dados.categoria || "Comum",
            tipo: dados.atributosAtuais?.tipoItem || dados.tipoItem || "equipamento",
            descricao: dados.descricao || dados.atributosAtuais?.descricao || "",
            custo: dados.atributosAtuais?.custo || dados.custo || "—",
            peso: Number(dados.atributosAtuais?.peso || dados.peso || 0),
            propriedades: dados.atributosAtuais?.propriedades || dados.propriedades || null,
            quantidade: rel.quantidade || 1,
          }));

        setItens(itensReais);
      } catch (err) {
        console.error("Erro ao carregar itens:", err);
      } finally {
        setCarregandoItens(false);
      }
    }

    carregarItens();
  }, [personagemAtivo]);

  // Filtro por aba e busca
  const itensFiltrados = itens.filter((item) => {
    const pertenceAba =
      abaAtiva === "todos" ||
      (abaAtiva === "equipamentos" && item.tipo === "equipamento") ||
      (abaAtiva === "consumiveis" && item.tipo === "consumivel");

    const correspondeBusca =
      item.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      item.subtitulo.toLowerCase().includes(busca.toLowerCase());

    return pertenceAba && correspondeBusca;
  });

  const pesoAtual = itens.reduce((acc, curr) => acc + curr.peso * (curr.quantidade || 1), 0);

  const renderizarMoedas = () => {
    const obterCorMoeda = (sigla) => {
      if (sigla.includes("O")) return "#d97706";
      if (sigla.includes("P") || sigla.includes("L")) return "#cbd5e1";
      if (sigla.includes("Q") || sigla.includes("C")) return "#b45309";
      return "#a855f7";
    };
    return Object.entries(moedas).map(([sigla, valor]) => (
      <div key={sigla} className={styles.itemMoeda}>
        <Coins size={16} color={obterCorMoeda(sigla)} />
        <span>{valor} {sigla}</span>
      </div>
    ));
  };

  // Tela de detalhe do item
  if (itemAberto) {
    return (
      <div className={styles.containerGeral}>
        <div className={styles.telaLeituraWiki}>
          <div className={styles.headerLeitura}>
            <button className={styles.btnVoltar} onClick={() => setItemAberto(null)}>
              <ChevronLeft size={16} /> Voltar ao Arsenal
            </button>
            <span className={styles.badgeCategoriaLeitura}>{itemAberto.categoria}</span>
          </div>
          <div className={styles.corpoLeitura}>
            <h1 className={styles.tituloItemAberto}>{itemAberto.titulo}</h1>
            <p className={styles.subtituloItemAberto}>
              {itemAberto.subtitulo} {itemAberto.custo !== "—" && `• ${itemAberto.custo}`}
            </p>
            <div className={styles.divisorEstilizado} />
            <p className={styles.descricaoCompleta}>{itemAberto.descricao || "Sem descrição disponível."}</p>
            {itemAberto.propriedades && (
              <div className={styles.caixaPropriedades}>
                <strong>Propriedades Mágicas/Técnicas:</strong>
                <p>{itemAberto.propriedades}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.containerGeral}>
      {/* SIDEBAR DE PERSONAGENS */}
      <aside className={styles.sidebarCampanhas}>
        <div className={styles.labelSecao}>PERSONAGENS</div>
        {carregandoPersonagens ? (
          <p style={{ color: "var(--cor-texto-muted, #888)", padding: "0 1rem", fontSize: "0.8rem" }}>
            Carregando...
          </p>
        ) : personagens.length === 0 ? (
          <p style={{ color: "var(--cor-texto-muted, #888)", padding: "0 1rem", fontSize: "0.8rem" }}>
            Nenhum personagem encontrado.
          </p>
        ) : (
          <div className={styles.listaCampanhasLayout}>
            {personagens.map((p) => (
              <button
                key={p.id}
                className={`${styles.itemCampanhaBtn} ${personagemAtivo?.id === p.id ? styles.itemCampanhaAtivo : ""}`}
                onClick={() => setPersonagemAtivo(p)}
              >
                <Package size={18} className={styles.iconeCampanhaBtn} />
                <span className={styles.nomeCampanhaTexto}>
                  {p.instanciaNome || p.nome || "Sem nome"}
                </span>
              </button>
            ))}
          </div>
        )}
      </aside>

      {/* PAINEL PRINCIPAL */}
      <div className={styles.painelPrincipalConteudo}>
        <header className={styles.headerMenu}>
          <div className={styles.blocoInfoEsquerda}>
            <h2 className={styles.tituloPainel}>MOCHILA DE AVENTUREIRO</h2>
            {personagemAtivo && (
              <div className={styles.barraCapacidadeContainer}>
                <span className={styles.textoCapacidade}>
                  Carga: {pesoAtual.toFixed(1)} / {capacidadeMaxima} Kg
                </span>
                <div className={styles.trilhoBarra}>
                  <div
                    className={styles.preenchimentoBarra}
                    style={{ width: `${Math.min((pesoAtual / capacidadeMaxima) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
          <div className={styles.grupoMoedas}>
            {renderizarMoedas()}
          </div>
        </header>

        <div className={styles.areaFiltrosAcoes}>
          <div className={styles.abasTipoFiltro}>
            <button className={`${styles.abaBotao} ${abaAtiva === "todos" ? styles.abaBotaoAtiva : ""}`} onClick={() => setAbaAtiva("todos")}>Todos</button>
            <button className={`${styles.abaBotao} ${abaAtiva === "equipamentos" ? styles.abaBotaoAtiva : ""}`} onClick={() => setAbaAtiva("equipamentos")}>Equipamentos</button>
            <button className={`${styles.abaBotao} ${abaAtiva === "consumiveis" ? styles.abaBotaoAtiva : ""}`} onClick={() => setAbaAtiva("consumiveis")}>Consumíveis</button>
          </div>
          <div className={styles.caixaPesquisaGeral}>
            <Search size={18} className={styles.iconeLupa} />
            <input
              type="text"
              placeholder="Buscar itens na mochila..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className={styles.inputFiltroTexto}
            />
          </div>
        </div>

        <div className={styles.containerListaScroll}>
          {carregandoItens ? (
            <div className={styles.caixaAlertaLeitura} style={{ gridColumn: "1/-1" }}>
              <span>Carregando itens do personagem...</span>
            </div>
          ) : (
            <div className={styles.gradeItensDoArsenal}>
              {!personagemAtivo ? (
                <div className={styles.caixaAlertaLeitura} style={{ gridColumn: "1/-1" }}>
                  <ShieldAlert size={20} />
                  <span>Selecione um personagem para ver sua mochila.</span>
                </div>
              ) : itensFiltrados.length > 0 ? (
                itensFiltrados.map((item) => (
                  <div key={item.id} className={styles.cardItemArsenal}>
                    <div className={styles.cardItemCorpoInfo}>
                      <div className={styles.linhaSuperiorCard}>
                        <span className={styles.badgeTipoItem}>
                          {item.tipo === "equipamento" ? <Sword size={14} /> : <Flame size={14} />}{" "}
                          {item.tipo.toUpperCase()}
                        </span>
                        <span className={styles.tagPesoItem}>{item.peso} Kg</span>
                      </div>
                      <h3 className={styles.itemTituloArsenal}>{item.titulo}</h3>
                      {item.quantidade > 1 && (
                        <span style={{ fontSize: "0.75rem", opacity: 0.6 }}>×{item.quantidade}</span>
                      )}
                      <div className={styles.blocoFixoRodapeCard}>
                        <p className={styles.itemSubtituloArsenal}>
                          {item.subtitulo}{item.subtitulo && item.custo !== "—" ? " • " : ""}{item.custo !== "—" ? item.custo : ""}
                        </p>
                        <button className={styles.btnAbrirLivro} onClick={() => setItemAberto(item)}>
                          <Eye size={16} /> Inspecionar Item
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.caixaAlertaLeitura} style={{ gridColumn: "1/-1" }}>
                  <ShieldAlert size={20} />
                  <span>Nenhum item encontrado na mochila deste personagem.</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}