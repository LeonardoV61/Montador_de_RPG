import { LayoutDashboard, Users, Map, BookOpen, Skull, Gem } from "lucide-react";
import styles from "./styles.BarraL.module.css"

export default function BarraL(){
    return(
        <>
          <aside className={styles.sidebar}>
            <div className={styles.bottomUser}>
                <div className={`${styles.avatar} ${styles.small}`}></div>
                <div>
                    <h4>HERON</h4>
                </div>
            </div>
            <div>
                <div className={styles.roles}>
                    <button>Jogador</button>
                    <button className={styles.active}>Mestre</button>
                </div>

                <div className={styles.menu}>
                    <p className={styles.menuTitle}>PRINCIPAL</p>
                    <a href="#" className={styles.active}>
                        <LayoutDashboard size={18} />
                        Dashboard
                    </a>
                    <a href="#">
                        <Users size={18} />
                        Personagens
                    </a>
                    <a href="#">
                        <Map size={18} />
                        Mapas & Cenas
                    </a>
                    <p className={styles.menuTitle}>FERRAMENTAS</p>
                    <a href="#">
                        <BookOpen size={18} />
                        Anotações
                    </a>
                    <a href="#">
                        <Skull size={18} />
                        PNJs & Encontros
                    </a>
                    <a href="#">
                        <Gem size={18} />
                        Itens & Loot
                    </a>
                </div>
            </div>
          </aside>
        </>
    )
}