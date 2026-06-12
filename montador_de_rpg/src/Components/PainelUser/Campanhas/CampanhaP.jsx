import { useNavigate } from "react-router-dom";
import styles from "./styles.CampanhaP.module.css";

// 1. Adicione a prop roleAtiva aqui
export default function CampanhaP({ roleAtiva }) { 
  const navigate = useNavigate();

  // 2. Crie uma função para gerenciar o clique e a persistência
  const handleEntrarNoJogo = () => {
    localStorage.setItem("role_sessao_ativa", roleAtiva); // Salva se é mestre ou jogador
    navigate('/jogo'); // Redireciona
  };

  return (
    <div className={`${styles.panel} ${styles.large}`}>
      <div className={styles.panelHeader}>
        <h3>MINHAS CAMPANHAS</h3>
        <button>+ Nova Campanha</button>
      </div>

      {/* Substitua os cliques antigos por essa nova função em todas as campanhas */}
      <button className={styles.campaign} onClick={handleEntrarNoJogo}>
        <div>
          <h4>O REINO ARRUINADO</h4>
          <p>Mythic Bastionland • 4 jogadores</p>
        </div>
        <span className={`${styles.status} ${styles.activeStatus}`}>ATIVA</span>
      </button>

      <button className={styles.campaign} onClick={handleEntrarNoJogo}>
        <div>
          <h4>CINZAS DA VELHA CIDADE</h4>
          <p>Rune 2e • 3 jogadores</p>
        </div>
        <span className={`${styles.status} ${styles.activeStatus}`}>ATIVA</span>
      </button>

      <button className={styles.campaign} onClick={handleEntrarNoJogo}>
        <div>
          <h4>O TEMPLO SUBMERSO</h4>
          <p>OSE • 2 jogadores</p>
        </div>
        <span className={`${styles.status} ${styles.paused}`}>PAUSADA</span>
      </button>
    </div>
  );
}