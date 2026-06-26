import { useNavigate } from "react-router-dom";
import styles from "./styles.CampanhaP.module.css";
import { sessaoService } from "../../../services/sessaoService.js";
import { personagemService } from "../../../services/personagemService.js"; 
import { cenaService } from "../../../services/cenaService.js";

export default function CampanhaP({ campanha, roleAtiva }) { 
  const navigate = useNavigate();

  const handleEntrarNoJogo = async () => {
    try {
      // 1. Guarda as configurações iniciais do clique
      localStorage.setItem("role_sessao_ativa", roleAtiva); 
      localStorage.setItem("idCampanhaAtiva", campanha.id);

      console.log(`Iniciando/Buscando sessão para a campanha ${campanha.id}...`);
      const respSessao = await sessaoService.iniciar(campanha.id);
      const sessao = respSessao?.data || respSessao;

      let sessaoIdReal = null;
      if (sessao && sessao.id) {
        sessaoIdReal = sessao.id;
        localStorage.setItem('idSessaoAtiva', sessaoIdReal);
      }

      // 2. Busca do personagem com tratamento defensivo
      if (roleAtiva === "jogador") {
        console.log(`Buscando o personagem do jogador para a campanha ${campanha.id}...`);
        
        const respPersonagem = await personagemService.buscarMeuPersonagem(campanha.id).catch(() => null);
        const personagem = respPersonagem?.data || respPersonagem;

        if (personagem && personagem.instanciaId) {
          localStorage.setItem('instanciaAtiva', ...[personagem.instanciaId]);
        } else {
          localStorage.setItem('instanciaAtiva', `mock-instancia-${campanha.id}`);
        }
      } else {
        localStorage.removeItem('instanciaAtiva');
      }

      // 3. Garante a existência da cena ativa usando o método do backend
      if (sessaoIdReal) {
        console.log(`Buscando ou inicializando a cena ativa para a sessão ${sessaoIdReal}...`);
        const respCena = await cenaService.buscarCenaAtiva(sessaoIdReal).catch(() => null);
        const cena = respCena?.data || respCena;

        if (cena && cena.id) {
          localStorage.setItem('idCenaAtiva', cena.id);
        }
      }

      // Tudo certo, vai para o jogo
      navigate('/jogo');

    } catch (error) {
      console.warn("Back-end offline ou erro 500. Aplicando fallbacks de segurança para o teste local:");
      
      // Fallbacks para o front não estourar em tela branca
      localStorage.setItem('idSessaoAtiva', `mock-sessao-${campanha.id}`);
      localStorage.setItem('idCenaAtiva', `mock-cena-${campanha.id}`);
      if (roleAtiva === "jogador") {
        localStorage.setItem('instanciaAtiva', `mock-instancia-${campanha.id}`);
      }
      
      navigate('/jogo');
    }
  };

  return (
    <li className={styles.campaign} onClick={handleEntrarNoJogo}>
      <div>
        <h4>{campanha.nome}</h4>
        <p>{campanha.descricao}</p>
      </div>
      <span className={`${styles.status} ${campanha.Status === "ATIVA" ? styles.ativa : campanha.Status === "PAUSADA" ? styles.pausada : styles.finalizada }`}>
        {campanha.Status || campanha.status}
      </span>
    </li>
  );
}