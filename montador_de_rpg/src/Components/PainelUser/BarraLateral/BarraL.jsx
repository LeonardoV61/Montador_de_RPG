import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, User, Map, Album, Sparkles,  PawPrint, BookOpen, Skull, Gem, Backpack } from "lucide-react";
import Heron from "../../../assets/perfil/Heron.png"
import styles from "./styles.BarraL.module.css";

export default function BarraL({ roleAtiva, setRoleAtiva, menuAtivo, setMenuAtivo, nome, imagem, zoom, posX, posY}){
    const navigate = useNavigate();

    function handleLogout() {
        localStorage.removeItem("authenticated");
        localStorage.removeItem("perfil_rpg");
        navigate("/");
    }

    return(
        <>
          <aside className={styles.sidebar}>
            <div className={styles.bottomUser}>
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

                    <a href="#" className={menuAtivo === "dashboard" ? styles.active : ""} onClick={(e) => { e.preventDefault(); setMenuAtivo("dashboard"); }}>
                        <LayoutDashboard size={18} />
                        Dashboard
                    </a>
                    
                    <a href="#" className={menuAtivo === "wiki" ? styles.active : ""} onClick={(e) => { e.preventDefault(); setMenuAtivo("wiki"); }}>
                        <Users size={18} />
                        Wiki
                    </a>
                    
                    <a href="#" className={menuAtivo === "mapas" ? styles.active : ""} onClick={(e) => { e.preventDefault(); setMenuAtivo("mapas"); }}>
                        <Map size={18} />
                        Mapas & Cenas
                    </a>

                    <p className={styles.menuTitle}>FERRAMENTAS</p>

                    <a href="#" className={menuAtivo === "compendio" ? styles.active : ""}onClick={(e) => { e.preventDefault(); setMenuAtivo("compendio"); }}>
                        <Album size={18} />
                        Compêndio
                    </a>

                    <a href="#" className={menuAtivo === "codexArcano" ? styles.active : ""}onClick={(e) => { e.preventDefault(); setMenuAtivo("codexArcano"); }}>
                        <Sparkles size={18} />
                        Codex Arcano
                    </a>                    
                    
                    <a href="#" className={menuAtivo === "bestiario" ? styles.active : ""}onClick={(e) => { e.preventDefault(); setMenuAtivo("bestiario"); }}>
                        <PawPrint  size={18} />
                        Bestiário
                    </a>
                    
                    <a href="#" className={menuAtivo === "anotacoes" ? styles.active : ""} onClick={(e) => { e.preventDefault(); setMenuAtivo("anotacoes"); }}>
                        <BookOpen size={18} />
                        Anotações
                    </a>
                    
                    <a href="#" className={menuAtivo === "eventos" ? styles.active : ""} onClick={(e) => { e.preventDefault(); setMenuAtivo("eventos"); }}>
                        <Skull size={18} />
                        PNJs & Encontros
                    </a>
            
                    <a href="#" className={menuAtivo === "itens" ? styles.active : ""}onClick={(e) => { e.preventDefault(); setMenuAtivo("itens"); }}>
                        <Gem size={18} />
                        Itens & Loot
                    </a>

                    <button className={styles.btnDouradoCheio} onClick={handleLogout}>
                        Sair
                    </button>
                </div> ) : (
                <div className={styles.menu}>
                    <p className={styles.menuTitle}>PRINCIPAL</p>

                    <a href="#" className={menuAtivo === "dashboard" ? styles.active : ""} onClick={(e) => { e.preventDefault(); setMenuAtivo("dashboard"); }}>
                        <LayoutDashboard size={18} />
                        Dashboard
                    </a>
                    
                    <a href="#" className={menuAtivo === "personagens" ? styles.active : ""} onClick={(e) => { e.preventDefault(); setMenuAtivo("personagens"); }}>
                        <Users size={18} />
                        Personagens
                    </a>
                    
                    <a href="#" className={menuAtivo === "perfil" ? styles.active : ""} onClick={(e) => { e.preventDefault(); setMenuAtivo("perfil"); }}>
                        <User size={18} />
                        Perfil
                    </a>

                    <p className={styles.menuTitle}>FERRAMENTAS</p>

                    <a href="#" className={menuAtivo === "regras" ? styles.active : ""}onClick={(e) => { e.preventDefault(); setMenuAtivo("regras"); }}>
                        <Album size={18} />
                        Regras
                    </a>

                    <a href="#" className={menuAtivo === "habilidades" ? styles.active : ""}onClick={(e) => { e.preventDefault(); setMenuAtivo("habilidades"); }}>
                        <Sparkles size={18} />
                        Habilidades
                    </a>                    
                    
                    <a href="#" className={menuAtivo === "diario" ? styles.active : ""} onClick={(e) => { e.preventDefault(); setMenuAtivo("diario"); }}>
                        <BookOpen size={18} />
                        Diário
                    </a>
                    
                    <a href="#" className={menuAtivo === "eventos" ? styles.active : ""} onClick={(e) => { e.preventDefault(); setMenuAtivo("eventos"); }}>
                        <Skull size={18} />
                        Eventos
                    </a>
            
                    <a href="#" className={menuAtivo === "inventario" ? styles.active : ""}onClick={(e) => { e.preventDefault(); setMenuAtivo("inventario"); }}>
                        <Backpack  size={18} />
                        Inventário
                    </a>

                    <button className={styles.btnDouradoCheio} onClick={handleLogout}>
                        Sair
                    </button>
                </div> )}
            </div>
          </aside>
        </>
    )
}