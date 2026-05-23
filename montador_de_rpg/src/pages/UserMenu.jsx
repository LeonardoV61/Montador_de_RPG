import "./UserMenu.css";
import { useNavigate } from "react-router-dom";
import navStyles from "../Components/NavBar/styles.NavBar.module.css";
import { LayoutDashboard, ScrollText, Users, Map, Sword, BookOpen, Skull, Gem, Bell, Settings } from "lucide-react";
import Recepcao from "../Components/Recepcao/Recepcao";
import IndicadorC from "../Components/Indicadores/IndicadorC";
import CampanhasP from "../Components/Campanhas/CampanhaP";
import AmigoP from "../Components/Amigos/AmigoP";
import TarefaP from "../Components/Tarefas/TarefaP";
import AtividadeP from "../Components/Atividade/AtividadeP";
import BarraL from "../Components/BarraLateral/BarraL";
export default function UserMenu() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("authenticated");
    navigate("/");
  }

  return (
    <div className="app">
      {/* SIDEBAR */}
      <BarraL />

      {/* MAIN */}
      <main className="main">
        {/* NAVBAR */}
        <header className={navStyles.navContainer}>
          <div className={navStyles.navContents}>
            <div className={navStyles.links}>
              <a href="#" className={navStyles.link}>
                Resumo
              </a>
              <a href="#" className={navStyles.link}>
                Campanhas
              </a>
              <a href="#" className={navStyles.link}>
                Personagens
              </a>
              <a href="#" className={navStyles.link}>
                Jogadores
              </a>
              <a href="#" className={navStyles.link}>
                Configurações
              </a>
            </div>
          </div>
          <button className={navStyles.btnDouradoCheio} onClick={handleLogout}>
            Sair
          </button>
        </header>
        <Recepcao />
        <IndicadorC />
        <section className="grid">
          <CampanhasP />
          <AmigoP />
          <TarefaP />
          <AtividadeP />
        </section>
      </main>
    </div>
  );
}
