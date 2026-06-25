import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { personagemService } from "../../services/personagemService";
import { Shield, Sword, Heart, Brain, Zap, ChevronLeft } from "lucide-react";
import styles from "./styles.FichaPersonagem.module.css";

export default function FichaPersonagem({ idPersonagem, onVoltar }) {
  const { id: idDaUrl } = useParams();
  const navigate = useNavigate();
  const [personagem, setPersonagem] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const id = idPersonagem || idDaUrl;

  useEffect(() => {
    if (!id) return; // Segurança caso o ID venha nulo
    async function carregar() {
      try {
        const resp = await personagemService.buscarPorId(id);
        setPersonagem(resp?.data || resp);
      } catch (err) {
        console.error("Erro ao carregar ficha:", err);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [id]);

 if (carregando) return <div className={styles.carregando}>Carregando ficha...</div>;
  if (!personagem) return <div className={styles.erro}>Personagem não encontrado.</div>;

  const atributos = personagem.atributos || personagem.instancia?.atributosAtuais || {};
  console.log(atributos);

  return (
    <div className={styles.container}>
      {/* Altere o botão voltar para usar a função onVoltar se ela existir, senão usa o histórico */}
      <button className={styles.btnVoltar} onClick={onVoltar || (() => navigate(-1))}>
        <ChevronLeft size={20} /> Voltar
      </button>
      
      <div className={styles.cabecalho}>
        <h1>{personagem.instanciaNome || personagem.nome}</h1>
        <span className={styles.classe}>{personagem.tipo || personagem.classe}</span>
      </div>
      <div className={styles.atributos}>
        <div className={styles.atributo}>
          <Heart size={20} /> <strong>VIG:</strong> {atributos.VIG ?? "-"}
        </div>
        <div className={styles.atributo}>
          <Brain size={20} /> <strong>CLA:</strong> {atributos.CLA ?? "-"}
        </div>
        <div className={styles.atributo}>
          <Zap size={20} /> <strong>SPI:</strong> {atributos.SPI ?? "-"}
        </div>
        <div className={styles.atributo}>
          <Shield size={20} /> <strong>GD:</strong> {atributos.GD ?? "-"}
        </div>
        <div className={styles.atributo}>
          <Sword size={20} /> <strong>Glória:</strong> {atributos.gloria ?? 0}
        </div>
      </div>
      <div className={styles.detalhes}>
        <p><strong>Jogador:</strong> {personagem.usuarioEmail || personagem.usuario?.email}</p>
        <p><strong>Campanha:</strong> {personagem.campanhaNome || "Nenhuma"}</p>
        <p><strong>Status:</strong> {personagem.ativo ? "Ativo" : "Inativo"}</p>
        {personagem.historia && <p><strong>História:</strong> {personagem.historia}</p>}
        {personagem.aparencia && <p><strong>Aparência:</strong> {personagem.aparencia}</p>}
      </div>
    </div>
  );
}