import { useNavigate } from "react-router-dom";
import styles from "./styles.CampanhaP.module.css";

// 1. Adicione a prop roleAtiva aqui
export default function CampanhaP({ campanha, roleAtiva }) { 
  const navigate = useNavigate();

  // console.log(campanha)
  // 2. Crie uma função para gerenciar o clique e a persistência
  const handleEntrarNoJogo = () => {
    localStorage.setItem("role_sessao_ativa", roleAtiva); // Salva se é mestre ou jogador
    navigate('/jogo');
    localStorage.setItem('instanciaAtiva', personagem.instanciaId);
    localStorage.setItem('idSessaoAtiva', idSessao);
  };

  return (
    <li className={styles.campaign} onClick={handleEntrarNoJogo}>
      <div>
        <h4>{campanha.nome}</h4>
        <p>{campanha.descricao}</p>
      </div>
      <span className={`${styles.status} ${campanha.Status == "ATIVA" ? styles.ativa : campanha.status == "PAUSADA" ? styles.pausada : styles.finalizada }`}>{campanha.Status}</span>
    </li>
  );
}