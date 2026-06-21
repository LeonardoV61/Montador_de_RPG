import { useState, useEffect } from "react";
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

import { campanhaService } from "../services/campanhaService.js";
import { usuarioService } from "../services/usuarioService.js";

export default function UserMenu() {
  const [roleAtiva, setRoleAtiva] = useState("mestre");
  const [menuAtivo, setMenuAtivo] = useState("dashboard");

  const [campanhas, setCampanhas] = useState([
    {
      id: 1,
      titulo: "O REINO ARRUINADO",
      detalhes: "Mythic Bastionland • 4 jogadores",
      status: "ATIVA",
    },
    {
      id: 2,
      titulo: "CINZAS DA VELHA CIDADE",
      detalhes: "Rune 2e • 3 jogadores",
      status: "PAUSADA",
    },
    {
      id: 3,
      titulo: "O TEMPLO SUBMERSO",
      detalhes: "OSE • 2 jogadores",
      status: "FINALIZADA",
    },
  ]);

  const [amigos, setAmigos] = useState([
    { id: 1, nome: "Erik Guilherme", online: true },
    { id: 2, nome: "Leonardo ProPlayer", online: true },
    { id: 3, nome: "Lucas Carril", online: false },
    { id: 4, nome: "Oséias Augusto", online: false },
    { id: 5, nome: "Vinícius Lemos", online: true },
  ].sort((a, b) => a.nome.localeCompare(b.nome)));

  const [atividades, setAtividades] = useState([
    { id: 1, descricao: "Oséias atualizou a ficha", momento: "15:25:54" },
    { id: 2, descricao: "Erik Guilherme criou personagem", momento: "13:10:35" },
    { id: 3, descricao: "Sessão VII finalizada", momento: "11:14:24" },
  ]);

  const [tarefas, setTarefas] = useState([
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

  useEffect(() => {
    const carregarDados = async () => {
      // Perfil do usuário
      try {
        const resPerfil = await usuarioService.perfil();
        const perfil = resPerfil?.data?.data || resPerfil?.data || resPerfil;
        if (perfil && perfil.apelido) {
          setNome(perfil.apelido);
          setImagem(perfil.urlImagem || HeronPadrao);
          setZoom(perfil.zoom || 1);
          setPosX(perfil.posX || 0);
          setPosY(perfil.posY || 0);
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
        }
      }

      // Campanhas
      try {
        const resCamp = await campanhaService.listarTodas();
        const campanhasData = resCamp?.data?.data || resCamp?.data || resCamp;
        if (Array.isArray(campanhasData) && campanhasData.length > 0) {
          setCampanhas(campanhasData);
        }
      } catch {
        // mantém mock
      }

      // Amigos (usuários)
      try {
        const resUsuarios = await usuarioService.listarTodos();
        const usuariosData = resUsuarios?.data?.data || resUsuarios?.data || resUsuarios;
        if (Array.isArray(usuariosData) && usuariosData.length > 0) {
          const formatados = usuariosData
            .map((u) => ({
              id: u.id,
              nome: u.apelido,
              online: u.online ?? false,
            }))
            .sort((a, b) => a.nome.localeCompare(b.nome));
          setAmigos(formatados);
        }
      } catch {
        // mantém mock
      }
    };

    carregarDados();
  }, []);

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
      />
      <main className={styles.main}>
        <NavBarU />
        {roleAtiva === "mestre" ? (
          menuAtivo === "dashboard" && (
            <>
              <Recepcao nome={nome} />
              <IndicadorC />
              <section className={styles.grid}>
                <PanelDashboard titulo={"MINHAS CAMPANHAS"} canto={"btn"}>
                  {campanhas.map((campanha) => (
                    <CampanhasP key={campanha.id} campanha={campanha} roleAtiva={roleAtiva} />
                  ))}
                </PanelDashboard>
                <PanelDashboard
                  titulo={"JOGADORES ONLINE"}
                  canto={amigos.filter((amigo) => amigo.online).length}
                >
                  {amigos.map((amigo) => (
                    <AmigoP key={amigo.id} amigo={amigo} />
                  ))}
                </PanelDashboard>
                <PanelDashboard titulo={"PREPARAÇÃO PARA PRÓXIMA SESSÃO"}>
                  {tarefas.map((tarefa) => (
                    <TarefaP key={tarefa.id} tarefa={tarefa} />
                  ))}
                </PanelDashboard>
                <PanelDashboard titulo={"ATIVIDADE RECENTE"}>
                  {atividades.map((atividade) => (
                    <AtividadeP key={atividade.id} atividade={atividade} />
                  ))}
                </PanelDashboard>
              </section>
            </>
          )
          || menuAtivo === "wiki" && ( <><Wiki /></> )
          || menuAtivo === "mapas" && ( <><GeradorMapa /></> )
          || menuAtivo === "compendio" && ( <><Compendio /></> )
          || menuAtivo === "codexArcano" && ( <><CodexArcano /></> )
          || menuAtivo === "bestiario" && ( <><Bestiario /></> )
          || menuAtivo === "eventos" && ( <><GerenciadorNarrativo /></> )
          || menuAtivo === "anotacoes" && ( <><Anotacao /></> )
          || menuAtivo === "itens" && ( <><Loots /></> )
        ) : (
          menuAtivo === "dashboard" && (
            <>
              <Recepcao nome={nome} />
              <IndicadorC />
              <section className={styles.grid}>
                <PanelDashboard titulo={"MINHAS CAMPANHAS"} canto={"btn"}>
                  {campanhas.map((campanha) => (
                    <CampanhasP key={campanha.id} campanha={campanha} roleAtiva={roleAtiva} />
                  ))}
                </PanelDashboard>
                <PanelDashboard
                  titulo={"JOGADORES ONLINE"}
                  canto={amigos.filter((amigo) => amigo.online).length}
                >
                  {amigos.map((amigo) => (
                    <AmigoP key={amigo.id} amigo={amigo} />
                  ))}
                </PanelDashboard>
                <PanelDashboard titulo={"PREPARAÇÃO PARA PRÓXIMA SESSÃO"}>
                  {tarefas.map((tarefa) => (
                    <TarefaP key={tarefa.id} tarefa={tarefa} />
                  ))}
                </PanelDashboard>
                <PanelDashboard titulo={"ATIVIDADE RECENTE"}>
                  {atividades.map((atividade) => (
                    <AtividadeP key={atividade.id} atividade={atividade} />
                  ))}
                </PanelDashboard>
              </section>
            </>
          ) 
          || menuAtivo === "personagens" && ( <><Personagens /></> )
          || menuAtivo === "perfil" && (
            <Perfil
              nome={nome} setNome={setNome}
              imagem={imagem} setImagem={setImagem}
              zoom={zoom} setZoom={setZoom}
              posX={posX} setPosX={setPosX}
              posY={posY} setPosY={setPosY}
            />
          )
          || menuAtivo === "regras" && ( <><Regras /></> )
          || menuAtivo === "habilidades" && ( <><Habilidades /></> )
          || menuAtivo === "diario" && ( <><Diario /></> )
          || menuAtivo === "eventos" && ( <><Eventos /></> )
          || menuAtivo === "inventario" && ( <><Inventario /></> )
        )}
      </main>
    </div>
  );
}