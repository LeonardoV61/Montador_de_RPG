import navStyles from "../Components/NavBar/styles.NavBar.module.css";
import { LayoutDashboard, ScrollText, Users, Map, Sword, BookOpen, Skull, Gem, Bell, Settings } from "lucide-react";
import NavBarU from "../Components/NavBar/navBarU";
import Recepcao from "../Components/Recepcao/Recepcao";
import IndicadorC from "../Components/Indicadores/IndicadorC";
import CampanhasP from "../Components/Campanhas/CampanhaP";
import AmigoP from "../Components/Amigos/AmigoP";
import TarefaP from "../Components/Tarefas/TarefaP";
import AtividadeP from "../Components/Atividade/AtividadeP";
import BarraL from "../Components/BarraLateral/BarraL";
export default function UserMenu() {
  return (
    <div className="app">
      <BarraL />
      <main className="main">
        <NavBarU />
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
