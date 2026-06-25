import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { personagemService } from "../../services/personagemService";
import { entidadeInstanciaService } from "../../services/entidadeInstanciaService";
import { Shield, Sword, Heart, Brain, Zap, ChevronLeft, Package, Sparkles, HelpCircle } from "lucide-react";
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
};

export default function FichaPersonagem({ idPersonagem, onVoltar, nome }) {
  const { id: idDaUrl } = useParams();
  const navigate = useNavigate();

  const [personagem, setPersonagem] = useState(null);
  const [atributos, setAtributos] = useState({});
  const [relacoes, setRelacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const id = idPersonagem || idDaUrl;

  useEffect(() => {
    if (!id) return;

    async function carregarFichaCompleta() {
      try {
        const respPersonagem = await personagemService.buscarPorId(id);
        const dadosPersonagem = respPersonagem?.data || respPersonagem;
        setPersonagem(dadosPersonagem);

        if (dadosPersonagem?.instanciaId) {
          const instanciaId = dadosPersonagem.instanciaId;

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
          setRelacoes(Array.isArray(listaRelacoes) ? listaRelacoes : []);
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

          {/* Relações agrupadas por origem */}
          {relacoes.length > 0 && Object.entries(gruposRelacoes).map(([origem, itens]) => (
            <section key={origem} className={styles.secao}>
              <h2 className={styles.tituloSecao}>
                {ICONE_ORIGEM[origem] ?? <HelpCircle size={16} />}
                &nbsp;{origem.replace(/_/g, " ")}
              </h2>
              <ul className={styles.listaRelacoes}>
                {itens.map((rel) => (
                  <li key={rel.idEntidadeFilha} className={styles.itemRelacao}>
                    <span className={styles.nomeRelacao}>{rel.nomeEntidadeFilha}</span>
                    {rel.quantidade > 1 && (
                      <span className={styles.qtdRelacao}>×{rel.quantidade}</span>
                    )}
                  </li>
                ))}
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