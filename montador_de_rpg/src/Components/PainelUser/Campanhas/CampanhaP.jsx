// CampanhaP.jsx
import styles from "./styles.CampanhaP.module.css";

export default function CampanhaP({ campanha, roleAtiva, onAbrirLobby }) {
  return (
    <li className={styles.campaign} onClick={() => onAbrirLobby(campanha)}>
      <div>
        <h4>{campanha.nome}</h4>
        <p>{campanha.descricao}</p>
      </div>
      <span className={`${styles.status} ${
        campanha.Status === "ATIVA" ? styles.ativa :
        campanha.Satus === "PAUSADA" ? styles.pausada : styles.finalizada
      }`}>
        {campanha.Status}
      </span>
    </li>
  );
}