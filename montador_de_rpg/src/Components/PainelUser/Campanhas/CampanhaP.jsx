import { useState, useEffect } from "react";
import styles from "./styles.CampanhaP.module.css";
import { campanhaService } from "../../../services/campanhaService.js";

export default function CampanhaP({ campanha, onAbrirLobby, onDeletar }) {
  const [confirmando, setConfirmando] = useState(false);
  const [papelReal, setPapelReal] = useState(null);

  useEffect(() => {
    async function buscarPapelNaCampanha() {
      try {
        const res = await campanhaService.buscarMinhaRole(campanha.id);
        const dados = res?.data !== undefined ? res.data : res;

        if (dados && typeof dados === "object" && dados.papel) {
          setPapelReal(dados.papel.trim().toLowerCase());
        } else if (typeof dados === "string") {
          setPapelReal(dados.trim().toLowerCase());
        }
      } catch (err) {
        console.error(`Erro ao buscar papel da campanha ${campanha.id}:`, err);
      }
    }

    if (campanha?.id) buscarPapelNaCampanha();
  }, [campanha.id]);

  function handleDeletar(e) {
    e.stopPropagation();
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

  // status pode vir como "status" ou "Status" dependendo do back
  const statusValor = campanha.status ?? campanha.Status;

  return (
    <li className={styles.campaign} onClick={() => onAbrirLobby(campanha)}>
      <div className={styles.info}>
        <h4>{campanha.nome}</h4>

        {/* sistema logo abaixo do nome */}
        {campanha.sistemaNome && (
          <span className={styles.sistema}>{campanha.sistemaNome}</span>
        )}

        {campanha.descricao && (
          <p>{campanha.descricao}</p>
        )}
      </div>

      <div className={styles.acoes} onClick={(e) => e.stopPropagation()}>
        <span className={`${styles.status} ${
          statusValor === "ATIVA"     ? styles.ativa    :
          statusValor === "PAUSADA"   ? styles.pausada  : styles.finalizada
        }`}>
          {statusValor}
        </span>

        {papelReal === "mestre" && (
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