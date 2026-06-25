import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { personagemService } from "../../services/personagemService";
import { entidadeInstanciaService } from "../../services/entidadeInstanciaService";
import { Shield, Sword, Heart, Brain, Zap, ChevronLeft, Package, Sparkles, HelpCircle, Info } from "lucide-react";
import styles from "./styles.FichaPersonagem.module.css";

// Agrupa relações pelo campo `origem`
function agruparPorOrigem(relacoes) {
  return relacoes.reduce((acc, rel) => {
    const grupo = rel.origem || "outros";
    if (!acc[grupo]) acc[grupo] = [];
    acc[grupo].push(rel);
    return acc;
  }, {});
}

const ICONE_ORIGEM = {
  item_inicial: <Package size={16} />,
  habilidade: <Sparkles size={16} />,
  classe: <Sword size={16} />,
};

export default function FichaPersonagem({ idPersonagem, onVoltar, nome }) {
  const { id: idDaUrl } = useParams();
  const navigate = useNavigate();

  const [personagem, setPersonagem] = useState(null);
  const [atributos, setAtributos] = useState({});
  const [relacoes, setRelacoes] = useState([]);

  const [detalhesFilhos, setDetalhesFilhos] = useState({});
  const [carregando, setCarregando] = useState(true);

  const id = idPersonagem || idDaUrl;

  useEffect(() => {
    if (!id) return;

    async function carregarFichaCompleta() {
      try {
        // 1. Busca o Personagem principal
        const respPersonagem = await personagemService.buscarPorId(id);
        const dadosPersonagem = respPersonagem?.data || respPersonagem;
        setPersonagem(dadosPersonagem);

        if (dadosPersonagem?.instanciaId) {
          const instanciaId = dadosPersonagem.instanciaId;

          // 2. Busca a Instância do personagem e a lista inicial de Relações
          const [respInstancia, respRelacoes] = await Promise.all([
            entidadeInstanciaService.buscarPorId(instanciaId),
            entidadeInstanciaService.listarRelacoes(instanciaId),
          ]);

          const dadosInstancia = respInstancia?.data || respInstancia;
          const listaAtributos =
            dadosInstancia.atributosAtuais ||
            dadosInstancia.valoresAtributos ||
            dadosInstancia.atributos ||
            dadosInstancia;
          setAtributos(listaAtributos);

          const listaRelacoes = respRelacoes?.data || respRelacoes || [];
          const arrayRelacoes = Array.isArray(listaRelacoes) ? listaRelacoes : [];
          setRelacoes(arrayRelacoes);

          // 3. [CASCATA DE BUSCAS] Se existirem relações, busca a instância detalhada de cada uma em paralelo
          if (arrayRelacoes.length > 0) {
            const promessasDetalhes = arrayRelacoes.map((rel) =>
              entidadeInstanciaService
                .buscarPorId(rel.idEntidadeFilha)
                .then((res) => ({
                  id: rel.idEntidadeFilha,
                  dados: res?.data || res,
                }))
                .catch((err) => {
                  console.error(`Erro ao buscar detalhe do filho ${rel.idEntidadeFilha}:`, err);
                  return null;
                })
            );

            const resultados = await Promise.all(promessasDetalhes);
            
            // Transforma o array de resultados em um objeto/mapa de consulta rápida: { id: dados }
            const mapaDetalhes = resultados.reduce((acc, item) => {
              if (item) acc[item.id] = item.dados;
              return acc;
            }, {});

            setDetalhesFilhos(mapaDetalhes);
          }
        }
      } catch (err) {
        console.error("Erro ao carregar ficha completa:", err);
      } finally {
        setCarregando(false);
      }
    }

    carregarFichaCompleta();
  }, [id]);

  if (carregando) return <div className={styles.carregando}>Carregando ficha...</div>;
  if (!personagem) return <div className={styles.erro}>Personagem não encontrado.</div>;

  const gruposRelacoes = agruparPorOrigem(relacoes);

  return (
    <div className={styles.folha}>
      {/* ── Topo ── */}
      <button className={styles.btnVoltar} onClick={onVoltar || (() => navigate(-1))}>
        <ChevronLeft size={18} /> Voltar
      </button>

      {/* ── Cabeçalho ── */}
      <header className={styles.cabecalho}>
        <div className={styles.brasao}>⚔</div>
        <h1 className={styles.nomePersonagem}>
          {personagem.instanciaNome || personagem.nome}
        </h1>
        <span className={styles.classe}>
          {personagem.tipo || personagem.classe || "Cavaleiro"}
        </span>
        <div className={styles.divisorOuro} />
      </header>

      {/* ── Corpo em duas colunas ── */}
      <div className={styles.corpo}>

        {/* COLUNA ESQUERDA */}
        <div className={styles.colunaEsquerda}>
          {/* Virtudes */}
          <section className={styles.secao}>
            <h2 className={styles.tituloSecao}>Virtudes</h2>
            <div className={styles.gradeVirtudes}>
              {[
                { label: "VIG", icone: <Heart size={18} />, valor: atributos.VIG },
                { label: "CLA", icone: <Brain size={18} />, valor: atributos.CLA },
                { label: "SPI", icone: <Zap size={18} />, valor: atributos.SPI },
              ].map(({ label, icone, valor }) => (
                <div key={label} className={styles.cartaoVirtude}>
                  <div className={styles.virtudeTopo}>{icone}<span className={styles.virtueLabel}>{label}</span></div>
                  <div className={styles.virtueValor}>{valor ?? "—"}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Combate */}
          <section className={styles.secao}>
            <h2 className={styles.tituloSecao}>Combate</h2>
            <div className={styles.linhasAtributo}>
              {[
                { label: "Guarda (GD)",  icone: <Shield size={16} />, valor: atributos.GD },
                { label: "Armadura",     icone: <Shield size={16} />, valor: atributos.armadura },
                { label: "Glória",       icone: <Sword  size={16} />, valor: atributos.gloria ?? 0 },
              ].map(({ label, icone, valor }) => (
                <div key={label} className={styles.linhaAtributo}>
                  <span className={styles.linhaLabel}>{icone}{label}</span>
                  <span className={styles.linhaValor}>{valor ?? "—"}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Estados */}
          <section className={styles.secao}>
            <h2 className={styles.tituloSecao}>Estado</h2>
            <div className={styles.gradeEstados}>
              {[
                "fatigado", "exausto", "exposto", "comprometido",
                "machucado", "mortalmente_machucado", "morto",
              ].map((chave) => {
                const ativo = !!atributos[chave];
                return (
                  <div
                    key={chave}
                    className={`${styles.tagEstado} ${ativo ? styles.tagEstadoAtivo : ""}`}
                  >
                    {chave.replace(/_/g, " ")}
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* COLUNA DIREITA */}
        <div className={styles.colunaDireita}>
          {/* Informações */}
          <section className={styles.secao}>
            <h2 className={styles.tituloSecao}>Informações</h2>
            <div className={styles.linhasAtributo}>
              {[
                { label: "Jogador",  valor: nome },
                { label: "Campanha", valor: personagem.campanhaNome || "Nenhuma" },
                { label: "Status",   valor: personagem.ativo ? "Ativo" : "Inativo" },
              ].map(({ label, valor }) => (
                <div key={label} className={styles.linhaAtributo}>
                  <span className={styles.linhaLabel}>{label}</span>
                  <span className={styles.linhaValor}>{valor}</span>
                </div>
              ))}
            </div>
            {personagem.historia && (
              <p className={styles.paragrafo}><strong>História:</strong> {personagem.historia}</p>
            )}
            {personagem.aparencia && (
              <p className={styles.paragrafo}><strong>Aparência:</strong> {personagem.aparencia}</p>
            )}
          </section>

          {/* Relações detalhadas dinamicamente agrupadas por origem */}
          {relacoes.length > 0 && Object.entries(gruposRelacoes).map(([origem, itens]) => (
            <section key={origem} className={styles.secao}>
              <h2 className={styles.tituloSecao}>
                {ICONE_ORIGEM[origem] ?? <HelpCircle size={16} />}
                &nbsp;{origem.replace(/_/g, " ")}
              </h2>
              <ul className={styles.listaRelacoes}>
                {itens.map((rel) => {
                  const detalhe = detalhesFilhos[rel.idEntidadeFilha];

                  // Entidades de sistema (classe) não mostram detalhes internos
                  const ehClasse = origem.toLowerCase() === "classe";

                  return (
                    <li key={rel.idEntidadeFilha} className={styles.itemRelacaoCard}>
                      <div className={styles.itemRelacaoTopo}>
                        <span className={styles.nomeRelacao}>{rel.nomeEntidadeFilha}</span>
                        {rel.quantidade > 1 && (
                          <span className={styles.qtdRelacao}>×{rel.quantidade}</span>
                        )}
                        {!ehClasse && detalhe?.tipo && (
                          <span className={styles.badgeTipoFilho}>{detalhe.tipo}</span>
                        )}
                      </div>

                      {!ehClasse && (
                        detalhe ? (
                          <div className={styles.itemRelacaoConteudo}>
                            {detalhe.descricao && (
                              <p className={styles.descricaoFilho}>{detalhe.descricao}</p>
                            )}

                            {detalhe.atributosAtuais && Object.keys(detalhe.atributosAtuais).length > 0 && (
                              <div className={styles.gradeAtributosFilho}>
                                {Object.entries(detalhe.atributosAtuais)
                                  .filter(([, val]) => {
                                    // Booleanos falsos não aparecem
                                    if (typeof val === "boolean") return val === true;
                                    return true;
                                  })
                                  .map(([attrChave, attrValor]) => (
                                    <div key={attrChave} className={styles.tagAtributoFilho}>
                                      {typeof attrValor === "boolean" ? (
                                        // Booleano true: só mostra o nome
                                        <span className={styles.subAtributoLabel}>
                                          {attrChave.replace(/_/g, " ")}
                                        </span>
                                      ) : (
                                        <>
                                          <span className={styles.subAtributoLabel}>{attrChave}:</span>
                                          <span className={styles.subAtributoValor}>{String(attrValor)}</span>
                                        </>
                                      )}
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className={styles.carregandoMini}>Buscando propriedades...</div>
                        )
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}

          {relacoes.length === 0 && (
            <section className={styles.secao}>
              <h2 className={styles.tituloSecao}>Equipamentos &amp; Habilidades</h2>
              <p className={styles.vazio}>Nenhum item ou habilidade concedido ainda.</p>
            </section>
          )}
        </div>
      </div>

      {/* ── Rodapé ── */}
      <footer className={styles.rodape}>
        <span>RPG VTT • Ficha gerada automaticamente</span>
      </footer>
    </div>
  );
}