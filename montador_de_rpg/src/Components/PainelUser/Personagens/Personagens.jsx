import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Plus, Compass, Search, Eye, Sparkles, BookOpen, ChevronLeft, Scroll } from "lucide-react";
import { personagemService } from "../../../services/personagemService";
import { usuarioService } from "../../../services/usuarioService";
import styles from "./styles.Personagens.module.css";

export default function Personagens( { menuAtivo, setMenuAtivo, setPersonagemSelecionadoId } ) {
  const [abaAtiva, setAbaAtiva] = useState("meus");
  const [busca, setBusca] = useState("");
  const [personagens, setPersonagens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [usuarioId, setUsuarioId] = useState(null);
  const [npcSelecionado, setNpcSelecionado] = useState(null);

  // Dados mockados de NPCs (mantidos como exemplo)
  const [npcsAvistados] = useState([
    { 
      id: "npc-1", 
      nome: "HERON, O SÁBIO", 
      papel: "Mentor / Mago", 
      campanha: "A Maldição de Strahd", 
      descricao: "Um antigo mago que guarda os segredos do grimório...",
      loreCompleta: "Heron nasceu nas eras de prata..."
    },
    { 
      id: "npc-2", 
      nome: "PREFEITO VALLAKOVICH", 
      papel: "Líder Político", 
      campanha: "A Maldição de Strahd", 
      descricao: "Governante paranoico da cidade de Vallaki.",
      loreCompleta: "O Barão Vargas Vallakovich é o atual governante..."
    }
  ]);

  // Busca o usuário logado e carrega os personagens
  useEffect(() => {
    async function carregar() {
      try {
        const perfil = await usuarioService.perfil();
        const id = perfil?.data?.id || perfil?.id;
        setUsuarioId(id);
        if (id) {
          const resp = await personagemService.listarPorUsuario(id);
          console.log("RESPOSTA PERSONAGEM:", resp)
          const lista = resp?.data || resp || [];
          setPersonagens(Array.isArray(lista) ? lista : []);
        }
      } catch (err) {
        console.error("Erro ao carregar personagens:", err);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  function handleCriarPersonagem(e) {
    e.preventDefault(); 
    setMenuAtivo('criarPersonagem')
  }

  function handleVerFicha(personagem) {
    setPersonagemSelecionadoId(personagem.id);
    setMenuAtivo('verFicha');
  }

  // --- SE TIVER UM NPC SELECIONADO, RENDERIZA A TELA COMPLETA DA WIKI ---
  if (npcSelecionado) {
    return (
      <div className={styles.containerGeral}>
        <div className={styles.telaLeituraWiki}>
          <div className={styles.headerLeitura}>
            <button className={styles.btnVoltar} onClick={() => setNpcSelecionado(null)}>
              <ChevronLeft size={16} /> Voltar para os Registros
            </button>
            <div className={styles.tagGrupo}>
              <span className={styles.tagCampanhaLeitura}>{npcSelecionado.campanha}</span>
              <span className={styles.tagPapelLeitura}>{npcSelecionado.papel}</span>
            </div>
          </div>
          <div className={styles.corpoLeitura}>
            <div className={styles.tituloAlinhamento}>
              <Scroll size={28} className={styles.iconSelo} />
              <h1 className={styles.tituloArtigoNpc}>{npcSelecionado.nome}</h1>
            </div>
            <div className={styles.divisorEstilizado} />
            <p className={styles.textoLoreNpc}>{npcSelecionado.loreCompleta}</p>
          </div>
          <div className={styles.rodapeProtegido}>
            <span>Manuscrito original guardado pelo Mestre da Campanha. Registro protegido contra alterações.</span>
          </div>
        </div>
      </div>
    );
  }

  // --- TELA PRINCIPAL ---
  return (
    <div className={styles.containerGeral}>
      <div className={styles.headerMenu}>
        <div className={styles.abasPrincipais}>
          <button 
            className={`${styles.btnAbaPrincipal} ${abaAtiva === "meus" ? styles.abaPrincipalAtiva : ""}`}
            onClick={() => { setAbaAtiva("meus"); setBusca(""); }}
          >
            <Sparkles size={16} /> Meus Personagens
          </button>
          <button 
            className={`${styles.btnAbaPrincipal} ${abaAtiva === "npcs" ? styles.abaPrincipalAtiva : ""}`}
            onClick={() => { setAbaAtiva("npcs"); setBusca(""); }}
          >
            <BookOpen size={16} /> NPCs Conhecidos
          </button>
        </div>
        <div className={styles.buscaWrapper}>
          <Search size={18} className={styles.buscaIcon} />
          <input 
            type="text" 
            placeholder={abaAtiva === "meus" ? "Buscar meu herói..." : "Buscar NPC avistado..."} 
            value={busca} 
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.painelRolavel}> 
        {abaAtiva === "meus" && (
          <div className={styles.secaoLayout}>
            <div className={styles.subHeaderInterno}>
              <div>
                <h3>Seus Registros de Heróis</h3>
                <p>Gerencie e edite suas fichas ativas nas campanhas</p>
              </div>
              <button className={styles.btnCriarHeroi} onClick={handleCriarPersonagem}>
                <Plus size={16} /> Criar Novo Personagem
              </button>
            </div>
            
            {carregando ? (
              <p className={styles.textoCarregando}>Carregando seus personagens...</p>
            ) : personagens.length === 0 ? (
              <p className={styles.textoVazio}>Nenhum personagem criado ainda. Clique em "Criar Novo Personagem" para começar.</p>
            ) : (
              <div className={styles.gridCards}>
                {personagens
                  .filter(p => (p.instanciaNome || p.nome || "").toLowerCase().includes(busca.toLowerCase()))
                  .map(p => (
                    <div key={p.id} className={styles.cardHeroi}>
                      <div className={styles.cardHeader}>
                        <span className={styles.tagCampanha}><Compass size={12} /> {p.campanhaNome || "Sem campanha"}</span>
                        <span className={p.ativo ? styles.statusVivo : styles.statusMorto}>
                          {p.ativo ? "Vivo" : "Inativo"}
                        </span>
                      </div>
                      <div className={styles.cardCorpo}>
                        <h4>{p.instanciaNome || p.nome || "Sem nome"}</h4>
                        <p><Shield size={13} /> {p.tipo || p.classe || "Aventureiro"}</p>
                      </div>
                      <button className={styles.btnAcaoCard} onClick={() => handleVerFicha(p)}>
                        Ver Ficha & Atributos
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {abaAtiva === "npcs" && (
          <div className={styles.secaoLayout}>
            <div className={styles.subHeaderInterno}>
              <div>
                <h3>Bestiário & Cidadãos Encontrados</h3>
                <p>NPCs revelados pelo Mestre durante a sua jornada (Somente Leitura)</p>
              </div>
            </div>
            <div className={styles.gridCards}>
              {npcsAvistados
                .filter(npc => npc.nome.toLowerCase().includes(busca.toLowerCase()) || npc.campanha.toLowerCase().includes(busca.toLowerCase()))
                .map(npc => (
                  <div key={npc.id} className={`${styles.cardHeroi} ${styles.cardNpc}`}>
                    <div className={styles.cardHeader}>
                      <span className={styles.tagCampanha}><Compass size={12} /> {npc.campanha}</span>
                      <span className={styles.tagPapel}>{npc.papel}</span>
                    </div>
                    <div className={styles.cardCorpo}>
                      <h4>{npc.nome}</h4>
                      <p className={styles.descricaoNpc}>{npc.descricao}</p>
                    </div>
                    <button className={`${styles.btnAcaoCard} ${styles.btnVerNpc}`} onClick={() => setNpcSelecionado(npc)}>
                      <Eye size={14} /> Consultar Lore
                    </button>
                  </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}