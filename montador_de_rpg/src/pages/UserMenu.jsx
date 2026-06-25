import { useState, useEffect} from "react";
import styles from "../Components/PainelUser/Css/styles.UserMenu.module.css";
import NavBarU from "../Components/NavBar/navBarU.jsx";
import Recepcao from "../Components/PainelUser/Recepcao/Recepcao.jsx";
import IndicadorC from "../Components/PainelUser/Indicadores/IndicadorC.jsx";
import PanelDashboard from "../Components/PainelUser/PanelDashboard/PanelDashboard.jsx";
import CampanhasP from "../Components/PainelUser/Campanhas/CampanhaP.jsx";
import AmigoP from "../Components/PainelUser/Amigos/AmigoP.jsx";
import TarefaP from "../Components/PainelUser/Tarefas/TarefaP.jsx";
import AtividadeP from "../Components/PainelUser/Atividade/AtividadeP.jsx";
import BarraL from "../Components/PainelUser/BarraLateral/BarraL.jsx";
import Wiki from "../Components/PainelUser/Wiki/Wiki.jsx";
import GeradorMapa from "../Components/PainelUser/Mapas/GeradorMapa.jsx";
import Compendio from "../Components/PainelUser/Compendio/Compendio.jsx";
import Personagens from "../Components/PainelUser/Personagens/Personagens.jsx";
import Perfil from "../Components/PainelUser/Perfil/Perfil.jsx";
import Regras from "../Components/PainelUser/Regras/Regras.jsx";
import CodexArcano from "../Components/PainelUser/Codex/CodexArcano.jsx";
import Bestiario from "../Components/PainelUser/Bestiario/Bestiario.jsx";
import Habilidades from "../Components/PainelUser/Habilidades/Habilidades.jsx";
import Diario from "../Components/PainelUser/Diário/Diario.jsx";
import GerenciadorNarrativo from "../Components/PainelUser/Eventos/GerenciadorNarrativo.jsx";
import Eventos from "../Components/PainelUser/EventosJ/Eventos.jsx";
import Anotacao from "../Components/PainelUser/Anotacao/Anotacao.jsx";
import Loots from "../Components/PainelUser/Loot/Loots.jsx";
import Inventario from "../Components/PainelUser/Inventário/inventario.jsx";
import HeronPadrao from "../assets/perfil/Heron.png";

// Criação de personagem — único ponto de entrada
import CriacaoPersonagem from "../pages/Personagens/CriacaoPersonagem.jsx";

import ModalNovaCampanha from "../Components/PainelUser/Campanhas/ModalNovaCampanha.jsx";
import ModalNovaSessao from "../Components/PainelUser/Campanhas/ModalNovaSessao.jsx";
import ModalNovaCena from "../Components/PainelUser/Campanhas/ModalNovaCena.jsx";

import { campanhaService } from "../services/campanhaService.js";
import { usuarioService } from "../services/usuarioService.js";

export default function UserMenu() {
  const [roleAtiva, setRoleAtiva] = useState("mestre");
  const [menuAtivo, setMenuAtivo] = useState("dashboard");
  const [usuarioId, setUsuarioId] = useState(null);
  const [modalNovaCampanha, setModalNovaCampanha] = useState(false);
  const [modalNovaSessao, setModalNovaSessao] = useState(null);
  const [modalNovaCena, setModalNovaCena] = useState(null);

  const [campanhas, setCampanhas] = useState([
    { id: 1, nome: "O REINO ARRUINADO", descricao: "Mythic Bastionland • 4 jogadores", Status: "ATIVA" },
    { id: 2, nome: "CINZAS DA VELHA CIDADE", descricao: "Rune 2e • 3 jogadores", Status: "PAUSADA" },
    { id: 3, nome: "O TEMPLO SUBMERSO", descricao: "OSE • 2 jogadores", Status: "FINALIZADA" },
  ]);

  const [amigos, setAmigos] = useState([]);
  const [atividades] = useState([
    { id: 1, descricao: "Oséias atualizou a ficha", momento: "15:25:54" },
    { id: 2, descricao: "Erik Guilherme criou personagem", momento: "13:10:35" },
    { id: 3, descricao: "Sessão VII finalizada", momento: "11:14:24" },
  ]);
  const [tarefas] = useState([
    { id: 1, descricao: "Escrever resumo da sessão anterior", feito: true },
    { id: 2, descricao: "Preparar mapa do templo", feito: true },
    { id: 3, descricao: "Definir estatísticas dos guardas", feito: false },
    { id: 4, descricao: "Criar cena de introdução", feito: false },
  ]);

  const [nome, setNome] = useState("HERON");
  const [imagem, setImagem] = useState(HeronPadrao);
  const [zoom, setZoom] = useState(1);
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);
  const [indicadores, setIndicadores] = useState(null);

  // Perfil do usuário
  useEffect(() => {
    (async () => {
      try {
        const resPerfil = await usuarioService.perfil();
        const perfil = resPerfil?.data?.data || resPerfil?.data || resPerfil;
        if (perfil) {
          setNome(perfil.apelido);
          setImagem(perfil.urlImagem || HeronPadrao);
          setZoom(perfil.zoom || 1);
          setPosX(perfil.posX || 0);
          setPosY(perfil.posY || 0);
          setUsuarioId(perfil.id);
        }
      } catch {
        const dadosSalvos = localStorage.getItem("perfil_rpg");
        if (dadosSalvos) {
          const perfil = JSON.parse(dadosSalvos);
          setNome(perfil.nome || "HERON");
          setImagem(perfil.imagem || HeronPadrao);
          setZoom(perfil.zoom || 1);
          setPosX(perfil.posX || 0);
          setPosY(perfil.posY || 0);
          setUsuarioId(perfil.id);
        }
      }
    })();
  }, []);

  // Indicadores
  useEffect(() => {
    async function carregarIndicadores() {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Sem token");
        const res = await fetch("/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Status " + res.status);
        const data = await res.json();
        setIndicadores(data);
      } catch {
        setIndicadores({
          campanhasAtivas: 2,
          jogadores: 5,
          cenasCriadas: 10,
          sessoesEsteMes: 3,
          cenasParaPreparar: 1,
        });
      }
    }
    carregarIndicadores();
  }, []);

  // Amigos
  useEffect(() => {
    if (!usuarioId) return;
    async function carregarAmigos() {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Sem token");
        const res = await fetch("/api/amigos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Status " + res.status);
        const lista = await res.json();
        const formatados = lista
          .map((a) => ({
            id: a.remetenteId === usuarioId ? a.destinatarioId : a.remetenteId,
            nome: a.remetenteId === usuarioId ? a.destinatarioApelido : a.remetenteApelido,
            online: false,
          }))
          .sort((a, b) => a.nome.localeCompare(b.nome));
        setAmigos(formatados);
      } catch {
        setAmigos([
          { id: 1, nome: "Erik Guilherme", online: true },
          { id: 2, nome: "Leonardo ProPlayer", online: true },
          { id: 3, nome: "Lucas Carril", online: false },
          { id: 4, nome: "Oséias Augusto", online: false },
          { id: 5, nome: "Vinícius Lemos", online: true },
        ].sort((a, b) => a.nome.localeCompare(b.nome)));
      }
    }
    carregarAmigos();
  }, [usuarioId]);

  // Campanhas
  useEffect(() => {
    async function carregarCampanhas() {
      try {
        const resCamp = await campanhaService.listarTodas();
        const campanhasData = resCamp?.data?.data || resCamp?.data || resCamp;
        if (Array.isArray(campanhasData) && campanhasData.length > 0) {
          setCampanhas(campanhasData);
        }
      } catch {
        // mantém mock
      }
    }
    carregarCampanhas();
  }, []);

  // ── renderização de conteúdo por aba ────────────────────────────
  function renderConteudo() {
    // ── Mestre ──
    if (roleAtiva === 'mestre') {
      switch (menuAtivo) {
        case 'dashboard': return renderDashboard();
        case 'wiki':      return <Wiki />;
        case 'mapas':     return <GeradorMapa />;
        case 'compendio': return <Compendio />;
        case 'codexArcano': return <CodexArcano />;
        case 'bestiario': return <Bestiario />;
        case 'eventos':   return <GerenciadorNarrativo />;
        case 'anotacoes': return <Anotacao />;
        case 'itens':     return <Loots />;
        default:          return null;
      }
    }

    // ── Jogador ──
    switch (menuAtivo) {
      case 'dashboard':       return renderDashboard();
      case 'personagens':     return <Personagens menuAtivo={menuAtivo} setMenuAtivo={setMenuAtivo}/>;
      case 'criarPersonagem': return <CriacaoPersonagem />;
      case 'perfil':          return (
        <Perfil
          nome={nome} setNome={setNome}
          imagem={imagem} setImagem={setImagem}
          zoom={zoom} setZoom={setZoom}
          posX={posX} setPosX={setPosX}
          posY={posY} setPosY={setPosY}
        />
      );
      case 'regras':      return <Regras />;
      case 'habilidades': return <Habilidades />;
      case 'diario':      return <Diario />;
      case 'eventos':     return <Eventos />;
      case 'inventario':  return <Inventario />;
      default:            return null;
    }
  }

  function renderDashboard() {
    return (
      <>
        <Recepcao nome={nome} />
        <IndicadorC dados={indicadores} />
        <section className={styles.grid}>
          <PanelDashboard
            titulo="MINHAS CAMPANHAS"
            canto="btn"
            botao={
              roleAtiva === 'mestre'
                ? <button onClick={() => setModalNovaCampanha(true)}>+ Nova</button>
                : undefined
            }
          >
            {campanhas.map((c) => (
              <CampanhasP key={c.id} campanha={c} roleAtiva={roleAtiva} />
            ))}
          </PanelDashboard>
          <PanelDashboard titulo="JOGADORES ONLINE" canto={amigos.filter((a) => a.online).length}>
            {amigos.map((a) => <AmigoP key={a.id} amigo={a} />)}
          </PanelDashboard>
          <PanelDashboard titulo="PREPARAÇÃO PARA PRÓXIMA SESSÃO">
            {tarefas.map((t) => <TarefaP key={t.id} tarefa={t} />)}
          </PanelDashboard>
          <PanelDashboard titulo="ATIVIDADE RECENTE">
            {atividades.map((a) => <AtividadeP key={a.id} atividade={a} />)}
          </PanelDashboard>
        </section>
      </>
    );
  }

  return (
    <div className={styles.app}>
      <BarraL
        roleAtiva={roleAtiva}
        setRoleAtiva={setRoleAtiva}
        menuAtivo={menuAtivo}
        setMenuAtivo={setMenuAtivo}
        nome={nome}
        imagem={imagem}
        zoom={zoom}
        posX={posX}
        posY={posY}
        onNovaCampanha={() => setModalNovaCampanha(true)}
        onNovaSessao={() => setModalNovaSessao(null)}
        onNovaCena={() => setModalNovaCena(null)}
      />
      <main className={styles.main}>
        <NavBarU />
        {renderConteudo()}
      </main>

      {modalNovaCampanha && (
        <ModalNovaCampanha
          usuarioId={usuarioId}
          onClose={() => setModalNovaCampanha(false)}
          onCriada={(nova) => setCampanhas((prev) => [...prev, nova])}
        />
      )}
      {modalNovaSessao && (
        <ModalNovaSessao
          campanhaId={modalNovaSessao}
          onClose={() => setModalNovaSessao(null)}
          onCriada={(sessao) => console.log('Sessão iniciada', sessao)}
        />
      )}
      {modalNovaCena && (
        <ModalNovaCena
          sessaoId={modalNovaCena}
          onClose={() => setModalNovaCena(null)}
          onCriada={(cena) => console.log('Cena criada', cena)}
        />
      )}
    </div>
  );
}