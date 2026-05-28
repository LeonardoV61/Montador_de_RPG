import { useState, useEffect } from "react";
import NavBarU from "../Components/NavBar/navBarU.jsx";
import Recepcao from "../Components/Recepcao/Recepcao.jsx";
import IndicadorC from "../Components/Indicadores/IndicadorC.jsx";
import CampanhasP from "../Components/Campanhas/CampanhaP.jsx";
import AmigoP from "../Components/Amigos/AmigoP.jsx";
import TarefaP from "../Components/Tarefas/TarefaP.jsx";
import AtividadeP from "../Components/Atividade/AtividadeP.jsx";
import BarraL from "../Components/BarraLateral/BarraL.jsx";
import Perfil from "../Components/Perfil/Perfil.jsx";
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
    <div className="app">
      <BarraL roleAtiva={roleAtiva} setRoleAtiva={setRoleAtiva} menuAtivo={menuAtivo} setMenuAtivo={setMenuAtivo} nome={nome} imagem={imagem} zoom={zoom} posX={posX} posY={posY}/>
      <main className="main">
        <NavBarU />
        {roleAtiva === "mestre" ? (
          menuAtivo === "dashboard" && (
            <>
              <Recepcao nome={nome}/>
              <IndicadorC />
              <section className="grid">
                <CampanhasP />
                <AmigoP />
                <TarefaP />
                <AtividadeP />
              </section>
            </>
          )
        ) : (
          menuAtivo === "dashboard" && (
              <>
                <Recepcao nome={nome}/>
                <IndicadorC />
                <section className="grid">
                  <AtividadeP />
                  <AmigoP />
                  <CampanhasP />
                </section>
              </>
            ) 
            ||
          menuAtivo === "perfil" && (
            <>
            <Perfil nome={nome} setNome={setNome} imagem={imagem} setImagem={setImagem} zoom={zoom} setZoom={setZoom} posX={posX} setPosX={setPosX} posY={posY} setPosY={setPosY}/>
            </>
          )
        )}

      </main>
    </div>
  );
}
