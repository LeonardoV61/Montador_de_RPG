import { useState } from "react";
import styles from "./styles.CampanhaP.module.css";

export default function CampanhaP({ campanha, roleAtiva, onAbrirLobby, onDeletar }) {
  const [confirmando, setConfirmando] = useState(false);

  function handleDeletar(e) {
    e.stopPropagation()
    if (confirmando) {
      onDeletar?.(campanha.id);
      setConfirmando(false);
    } else {
      setConfirmando(true);
    }
  }

  function handleCancelar(e) {
    e.stopPropagation();
    setConfirmando(false);
  }

  return (
    <li className={styles.campaign} onClick={() => onAbrirLobby(campanha)}>
      <div className={styles.info}>
        <h4>{campanha.nome}</h4>
        <p>{campanha.descricao}</p>
      </div>

      <div className={styles.acoes} onClick={(e) => e.stopPropagation()}>
        <span className={`${styles.status} ${
          campanha.Status === "ATIVA"    ? styles.ativa :
          campanha.Status === "PAUSADA"  ? styles.pausada : styles.finalizada
        }`}>
          {campanha.Status}
        </span>

        {/* Só o mestre pode deletar */}
        {roleAtiva === "mestre" && (
          confirmando ? (
            <div className={styles.confirmar}>
              <span className={styles.confirmarTexto}>Deletar?</span>
              <button className={styles.btnSim} onClick={handleDeletar}>Sim</button>
              <button className={styles.btnNao} onClick={handleCancelar}>Não</button>
            </div>
          ) : (
            <button
              className={styles.btnDeletar}
              title="Deletar campanha"
              onClick={handleDeletar}
            >
              {/* Ícone de lixeira SVG */}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4h6v2" />
              </svg>
            </button>
          )
        )}
      </div>
    </li>
  );
}