import "./UserMenu.css";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ScrollText,
  Users,
  Map,
  Sword,
  BookOpen,
  Skull,
  Gem,
  Bell,
  Settings,
} from "lucide-react";

export default function UserMenu() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("authenticated");
    navigate("/");
  }

  return (
    <div className="app">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div>
          <div className="profile">
            <div className="avatar"></div>
            <div>
              <h2>HERON</h2>
              <span>Mestre</span>
            </div>
          </div>

          <div className="roles">
            <button>Jogador</button>
            <button className="active">Mestre</button>
            <button>Admin</button>
          </div>

          <div className="menu">
            <p className="menu-title">PRINCIPAL</p>
            <a href="#" className="active">
              <LayoutDashboard size={18} />
              Dashboard
            </a>
            <a href="#">
              <ScrollText size={18} />
              Campanhas
            </a>
            <a href="#">
              <Users size={18} />
              Personagens
            </a>
            <a href="#">
              <Map size={18} />
              Mapas & Cenas
            </a>
            <a href="#">
              <Sword size={18} />
              Mesa de Jogo
            </a>

            <p className="menu-title">FERRAMENTAS</p>
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

            <p className="menu-title">CONTAS</p>
            <a href="#">
              <Users size={18} />
              Jogadores
            </a>
            <a href="#">
              <Bell size={18} />
              Notificações
            </a>
            <a href="#">
              <Settings size={18} />
              Configurações
            </a>
          </div>
        </div>

        <div className="bottom-user">
          <div className="avatar small"></div>
          <div>
            <h4>HERON</h4>
            <span>Mestre</span>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="main">
        {/* NAVBAR */}
        <header className="topbar">
          <a href="#" className="active">
            Resumo
          </a>
          <a href="#">Campanhas</a>
          <a href="#">Personagens</a>
          <a href="#">Jogadores</a>
          <a href="#">Configurações</a>
          <button className="logout-button" onClick={handleLogout}>
            Sair
          </button>
        </header>

        {/* HERO */}
        <section className="hero">
          <h1>BEM-VINDO, HERON</h1>
          <p>
            Você tem uma sessão agendada para amanhã.
            Falta preparar 2 itens.
          </p>
        </section>

        {/* CARDS */}
        <section className="cards">
          <div className="card">
            <h2>3</h2>
            <span>CAMPANHAS ATIVAS</span>
          </div>
          <div className="card">
            <h2>9</h2>
            <span>JOGADORES</span>
          </div>
          <div className="card">
            <h2>14</h2>
            <span>CENAS CRIADAS</span>
          </div>
          <div className="card">
            <h2>8</h2>
            <span>SESSÕES ESTE MÊS</span>
          </div>
          <div className="card danger">
            <h2>2</h2>
            <span>ITENS P/ PREPARAR</span>
          </div>
        </section>

        {/* GRID */}
        <section className="grid">
          {/* CAMPANHAS */}
          <div className="panel large">
            <div className="panel-header">
              <h3>MINHAS CAMPANHAS</h3>
              <button>+ Nova Campanha</button>
            </div>

            <div className="campaign">
              <div>
                <h4>O REINO ARRUINADO</h4>
                <p>Mythic Bastionland • 4 jogadores</p>
              </div>
              <span className="status active-status">ATIVA</span>
            </div>

            <div className="campaign">
              <div>
                <h4>CINZAS DA VELHA CIDADE</h4>
                <p>Rune 2e • 3 jogadores</p>
              </div>
              <span className="status active-status">ATIVA</span>
            </div>

            <div className="campaign">
              <div>
                <h4>O TEMPLO SUBMERSO</h4>
                <p>OSE • 2 jogadores</p>
              </div>
              <span className="status paused">PAUSADA</span>
            </div>
          </div>

          {/* ONLINE */}
          <div className="panel">
            <div className="panel-header">
              <h3>JOGADORES ONLINE</h3>
              <span>5 online</span>
            </div>
            <ul className="list">
              <li>Erik Guilherme</li>
              <li>Leonardo ProPlayer</li>
              <li>Lucas Carril</li>
              <li>Oséias Augusto</li>
              <li>Vinícius Lemos</li>
            </ul>
          </div>

          {/* TASKS */}
          <div className="panel large">
            <div className="panel-header">
              <h3>PREPARAÇÃO PARA PRÓXIMA SESSÃO</h3>
            </div>
            <ul className="list">
              <li className="done">Escrever resumo da sessão anterior</li>
              <li className="done">Preparar mapa do templo</li>
              <li>Definir estatísticas dos guardas</li>
              <li>Criar cena de introdução</li>
            </ul>
          </div>

          {/* ACTIVITY */}
          <div className="panel">
            <div className="panel-header">
              <h3>ATIVIDADE RECENTE</h3>
            </div>
            <ul className="list">
              <li>Mariana atualizou a ficha</li>
              <li>Ricardo criou personagem</li>
              <li>Sessão VII finalizada</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
