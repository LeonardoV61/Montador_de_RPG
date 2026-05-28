import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Map, BookOpen, Skull, Gem } from "lucide-react";
import Heron from "../../../assets/perfil/Heron.png"
import styles from "./styles.BarraL.module.css";

export default function BarraL(){
    const navigate = useNavigate();

    const [roleAtiva, setRoleAtiva] = useState("mestre");
    const [menuAtivo, setMenuAtivo] = useState("dashboard");

    function handleLogout() {
        localStorage.removeItem("authenticated");
        navigate("/");
    }

    return(
        <>
          <aside className={styles.sidebar}>
            <div className={styles.bottomUser}>
                <div className={`${styles.avatar} ${styles.small}`}><img src={Heron} alt="Avatar Heron" /></div>
                <div>
                    <h4>HERON</h4>
                </div>
            </div>
            <div>
                <div className={styles.roles}>
                    <button className={roleAtiva === "jogador" ? styles.active : ""} onClick={() => setRoleAtiva("jogador")}>Jogador</button>
                    <button className={roleAtiva === "mestre" ? styles.active : ""} onClick={() => setRoleAtiva("mestre")}>Mestre</button>
                </div>

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
                    
                    <a href="#" className={menuAtivo === "mapas" ? styles.active : ""} onClick={(e) => { e.preventDefault(); setMenuAtivo("mapas"); }}>
                        <Map size={18} />
                        Mapas & Cenas
                    </a>

                    <p className={styles.menuTitle}>FERRAMENTAS</p>
                    
                    <a href="#" className={menuAtivo === "anotacoes" ? styles.active : ""} onClick={(e) => { e.preventDefault(); setMenuAtivo("anotacoes"); }}>
                        <BookOpen size={18} />
                        Anotações
                    </a>
                    
                    <a href="#" className={menuAtivo === "pnjs" ? styles.active : ""} onClick={(e) => { e.preventDefault(); setMenuAtivo("pnjs"); }}>
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
                </div>
            </div>
          </aside>
        </>
    )
}