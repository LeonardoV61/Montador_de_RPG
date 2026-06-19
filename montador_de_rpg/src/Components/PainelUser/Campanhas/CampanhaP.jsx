import { useNavigate } from "react-router-dom";
import styles from "./styles.CampanhaP.module.css";

// 1. Adicione a prop roleAtiva aqui
export default function CampanhaP({ campanha, roleAtiva }) { 
  const navigate = useNavigate();

  // 2. Crie uma função para gerenciar o clique e a persistência
  const handleEntrarNoJogo = () => {
    localStorage.setItem("role_sessao_ativa", roleAtiva); // Salva se é mestre ou jogador
    navigate('/jogo'); // Redireciona
  };

  return (
    <li className={styles.campaign} onClick={handleEntrarNoJogo}>
      <div>
        <h4>{campanha.titulo}</h4>
        <p>{campanha.detalhes}</p>
      </div>
      <span className={`${styles.status} ${campanha.status == "ATIVA" ? styles.ativa : campanha.status == "PAUSADA" ? styles.pausada : styles.finalizada }`}>{campanha.status}</span>
    </li>
  );
}