import { useState, useEffect } from "react";
import styles from "../Components/PainelUser/Css/styles.UserMenu.module.css"
import NavBarU from "../Components/NavBar/navBarU.jsx";
import Recepcao from "../Components/PainelUser/Recepcao/Recepcao.jsx";
import IndicadorC from "../Components/PainelUser/Indicadores/IndicadorC.jsx";
import CampanhasP from "../Components/PainelUser/Campanhas/CampanhaP.jsx";
import AmigoP from "../Components/PainelUser/Amigos/AmigoP.jsx";
import TarefaP from "../Components/PainelUser/Tarefas/TarefaP.jsx";
import AtividadeP from "../Components/PainelUser/Atividade/AtividadeP.jsx";
import BarraL from "../Components/PainelUser/BarraLateral/BarraL.jsx";
import Wiki from "../Components/PainelUser/Wiki/Wiki.jsx";
import GeradorMapa from "../Components/PainelUser/Mapas/GeradorMapa.jsx";
import Compendio from "../Components/PainelUser/Compendio/Compendio.jsx";
import Personagens from "../Components/PainelUser/Personagens/Personagens.jsx"
import Perfil from "../Components/PainelUser/Perfil/Perfil.jsx";
import Regras from "../Components/PainelUser/Regras/Regras.jsx";
import CodexArcano from "../Components/PainelUser/Codex/CodexArcano.jsx";
import Bestiario from "../Components/PainelUser/Bestiario/Bestiario.jsx";
import Habilidades from "../Components/PainelUser/Habilidades/Habilidades.jsx";
import Diario from "../Components/PainelUser/Diário/Diario.jsx";
import GerenciadorNarrativo from "../Components/PainelUser/Eventos/GerenciadorNarrativo.jsx";
import Eventos from "../Components/PainelUser/EventosJ/Eventos.jsx";
import HeronPadrao from "../assets/perfil/Heron.png"; 




export default function UserMenu() {
  const [roleAtiva, setRoleAtiva] = useState("mestre");
  const [menuAtivo, setMenuAtivo] = useState("dashboard");

  const [nome, setNome] = useState("HERON");
  const [imagem, setImagem] = useState(HeronPadrao);
  const [zoom, setZoom] = useState(1);
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);

  useEffect(() => {
    const dadosSalvos = localStorage.getItem("perfil_rpg");
    
    if (dadosSalvos) {
      // Se encontrou dados salvos, transforma de texto para Objeto JS
      const perfil = JSON.parse(dadosSalvos);
      
      // Modifica os estados do React com os dados do localStorage
      setNome(perfil.nome || "HERON");
      setImagem(perfil.imagem || HeronPadrao);
      setZoom(perfil.zoom || 1);
      setPosX(perfil.posX || 0);
      setPosY(perfil.posY || 0);
    }
  }, []);
  return (
    <div className={styles.app}>
      <BarraL roleAtiva={roleAtiva} setRoleAtiva={setRoleAtiva} menuAtivo={menuAtivo} setMenuAtivo={setMenuAtivo} nome={nome} imagem={imagem} zoom={zoom} posX={posX} posY={posY}/>
      <main className={styles.main}>
        <NavBarU />
        {roleAtiva === "mestre" ? (
          menuAtivo === "dashboard" && (
            <>
              <Recepcao nome={nome}/>
              <IndicadorC />
              <section className={styles.grid}>
                <CampanhasP />
                <AmigoP />
                <TarefaP />
                <AtividadeP />
              </section>
            </>
          )
          ||
          menuAtivo === "wiki" && (
            <>
              <Wiki />
            </>
          )
          ||
          menuAtivo === "mapas" && (
            <>
              <GeradorMapa />
            </>
          )
          ||
          menuAtivo === "compendio" && (
            <>
              <Compendio />
            </>
          )
          ||
          menuAtivo === "codexArcano" && (
            <>
              <CodexArcano />
            </>
          )
          ||
          menuAtivo === "bestiario" && (
            <>
              <Bestiario />
            </>
          )
          ||
          menuAtivo === "eventos" && (
            <>
              <GerenciadorNarrativo />
            </>
          )
        ) : (
          menuAtivo === "dashboard" && (
              <>
                <Recepcao nome={nome}/>
                <IndicadorC />
                <section className={styles.grid}>
                  <AtividadeP />
                  <AmigoP />
                  <CampanhasP />
                </section>
              </>
          ) 
          ||
          menuAtivo === "personagens" && (
            <>
              <Personagens />
            </>
          )
          ||
          menuAtivo === "perfil" && (
            <>
            <Perfil nome={nome} setNome={setNome} imagem={imagem} setImagem={setImagem} zoom={zoom} setZoom={setZoom} posX={posX} setPosX={setPosX} posY={posY} setPosY={setPosY}/>
            </>
          )
          ||
          menuAtivo === "regras" && (
            <>
            <Regras />
            </>
          )
          ||
          menuAtivo === "habilidades" && (
            <>
              <Habilidades />
            </>
          )
          ||
          menuAtivo === "diario" && (
            <>
              <Diario />
            </>
          )
                    ||
          menuAtivo === "eventos" && (
            <>
              <Eventos />
            </>
          )


          )}


      </main>
    </div>
  );
}
