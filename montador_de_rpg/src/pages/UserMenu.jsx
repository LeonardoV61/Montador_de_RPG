import navStyles from "../Components/NavBar/styles.NavBar.module.css";
import { LayoutDashboard, ScrollText, Users, Map, Sword, BookOpen, Skull, Gem, Bell, Settings } from "lucide-react";
import NavBarU from "../Components/NavBar/navBarU";
import Recepcao from "../Components/PainelUser/Recepcao/Recepcao";
import IndicadorC from "../Components/PainelUser/Indicadores/IndicadorC";
import CampanhasP from "../Components/PainelUser/Campanhas/CampanhaP";
import AmigoP from "../Components/PainelUser/Amigos/AmigoP";
import TarefaP from "../Components/PainelUser/Tarefas/TarefaP";
import AtividadeP from "../Components/PainelUser/Atividade/AtividadeP";
import BarraL from "../Components/PainelUser/BarraLateral/BarraL";
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
