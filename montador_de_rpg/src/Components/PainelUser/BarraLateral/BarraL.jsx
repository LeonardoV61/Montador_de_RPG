import { LayoutDashboard, Users, User, Map, Album, Sparkles, PawPrint, BookOpen, Skull, Gem, Backpack, Swords, Play } from "lucide-react";
import styles from "./styles.BarraL.module.css";
import { useEffect } from "react";

export default function BarraL({
  roleAtiva, setRoleAtiva,
  menuAtivo, setMenuAtivo,
  nome, imagem, zoom, posX, posY,
  onNovaCampanha,
  onNovaSessao,
  onNovaCena
}) {
  useEffect(() => {
    setMenuAtivo("dashboard");
  }, [roleAtiva, setMenuAtivo]);

  function mudarMenu(e, menu) {
    e.preventDefault();
    setMenuAtivo(menu);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.usuario} onClick={(e) => { e.preventDefault(); setRoleAtiva("jogador"); setMenuAtivo("perfil"); }}>
        <div className={`${styles.avatar} ${styles.small}`} style={{ overflow: "hidden", position: "relative" }}>
          <img
            src={imagem}
            alt={`Avatar ${nome}`}
            style={{ transform: `translate(${posX}%, ${posY}%) scale(${zoom})`, width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <div>
          <h4>{nome}</h4>
        </div>
      </div>
      <div>
        <div className={styles.roles}>
          <button className={roleAtiva === "jogador" ? styles.active : ""} onClick={() => setRoleAtiva("jogador")}>Jogador</button>
          <button className={roleAtiva === "mestre" ? styles.active : ""} onClick={() => setRoleAtiva("mestre")}>Mestre</button>
        </div>
        {roleAtiva === "mestre" ? (
          <div className={styles.menu}>
            <p className={styles.menuTitle}>PRINCIPAL</p>

            <a href="#" className={menuAtivo === "dashboard" ? styles.active : ""} onClick={(e) => mudarMenu(e, "dashboard")}>
              <LayoutDashboard size={18} />
              Dashboard
            </a>

            <a href="#" className={menuAtivo === "wiki" ? styles.active : ""} onClick={(e) => mudarMenu(e, "wiki")}>
              <Users size={18} />
              Wiki
            </a>

            <a href="#" className={menuAtivo === "mapas" ? styles.active : ""} onClick={(e) => mudarMenu(e, "mapas")}>
              <Map size={18} />
              Mapas & Cenas
            </a>

            <p className={styles.menuTitle}>JOGO</p>

            <a href="#" onClick={(e) => { e.preventDefault(); onNovaCampanha?.(); }}>
              <Play size={18} />
              Nova Campanha
            </a>

            {/* <a href="#" onClick={(e) => { e.preventDefault(); onNovaSessao?.(); }}>
              <Play size={18} />
              Nova Sessão
            </a>

            <a href="#" onClick={(e) => { e.preventDefault(); onNovaCena?.(); }}>
              <Play size={18} />
              Nova Cena
            </a> */}

            <p className={styles.menuTitle}>FERRAMENTAS</p>

            <a href="#" className={menuAtivo === "compendio" ? styles.active : ""} onClick={(e) => mudarMenu(e, "compendio")}>
              <Album size={18} />
              Compêndio
            </a>

            <a href="#" className={menuAtivo === "codexArcano" ? styles.active : ""} onClick={(e) => mudarMenu(e, "codexArcano")}>
              <Sparkles size={18} />
              Codex Arcano
            </a>

            <a href="#" className={menuAtivo === "bestiario" ? styles.active : ""} onClick={(e) => mudarMenu(e, "bestiario")}>
              <PawPrint size={18} />
              Bestiário
            </a>

            <a href="#" className={menuAtivo === "anotacoes" ? styles.active : ""} onClick={(e) => mudarMenu(e, "anotacoes")}>
              <BookOpen size={18} />
              Anotações
            </a>

            <a href="#" className={menuAtivo === "eventos" ? styles.active : ""} onClick={(e) => mudarMenu(e, "eventos")}>
              <Skull size={18} />
              PNJs & Encontros
            </a>

            <a href="#" className={menuAtivo === "itens" ? styles.active : ""} onClick={(e) => mudarMenu(e, "itens")}>
              <Gem size={18} />
              Itens & Loot
            </a>
          </div>
        ) : (
          <div className={styles.menu}>
            <p className={styles.menuTitle}>PRINCIPAL</p>

            <a href="#" className={menuAtivo === "dashboard" ? styles.active : ""} onClick={(e) => mudarMenu(e, "dashboard")}>
              <LayoutDashboard size={18} />
              Dashboard
            </a>

            <a href="#" className={menuAtivo === "personagens" ? styles.active : ""} onClick={(e) => mudarMenu(e, "personagens")}>
              <Users size={18} />
              Personagens
            </a>

            <a href="#" className={menuAtivo === "perfil" ? styles.active : ""} onClick={(e) => mudarMenu(e, "perfil")}>
              <User size={18} />
              Perfil
            </a>

            <p className={styles.menuTitle}>FERRAMENTAS</p>

            <a href="#" className={menuAtivo === "regras" ? styles.active : ""} onClick={(e) => mudarMenu(e, "regras")}>
              <Album size={18} />
              Regras
            </a>

            <a href="#" className={menuAtivo === "habilidades" ? styles.active : ""} onClick={(e) => mudarMenu(e, "habilidades")}>
              <Sparkles size={18} />
              Habilidades
            </a>

            <a href="#" className={menuAtivo === "diario" ? styles.active : ""} onClick={(e) => mudarMenu(e, "diario")}>
              <BookOpen size={18} />
              Diário
            </a>

            <a href="#" className={menuAtivo === "eventos" ? styles.active : ""} onClick={(e) => mudarMenu(e, "eventos")}>
              <Skull size={18} />
              Eventos
            </a>

            <a href="#" className={menuAtivo === "inventario" ? styles.active : ""} onClick={(e) => mudarMenu(e, "inventario")}>
              <Backpack size={18} />
              Inventário
            </a>

            {/* <p className={styles.menuTitle}>CRIAÇÃO</p> */}

            {/* <a href="#" onClick={(e) => { e.preventDefault(); setMenuAtivo('criarPersonagem') }}>
              <Swords size={18} />
              Criar Personagem
            </a> */}
          </div>
        )}
      </div>
    </aside>
  );
}