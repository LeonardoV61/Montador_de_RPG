import { useState, useRef } from "react";
import { Search, Users, Swords, CheckCircle, UploadCloud, ChevronLeft, AlertTriangle, UserCheck, ShieldAlert } from "lucide-react";
import styles from "./styles.GerenciadorNarrativo.module.css";

export default function GerenciadorNarrativo() {
  // Controle de abas unificado focado nos preparativos do mestre
  const [subAba, setSubAba] = useState("atores"); // "atores" (PNJs) ou "cenas" (Encontros)
  const [filtroEstado, setFiltroEstado] = useState("ativos"); // "ativos" (Na Sessão) ou "banco" (Banco de Ideias/Todos)
  const [busca, setBusca] = useState("");
  
  // Estados de visualização detalhada
  const [pnjAberto, setPnjAberto] = useState(null);
  const [encontroAberto, setEncontroAberto] = useState(null);
  
  const fileInputRef = useRef(null);

  // BANCO DE DADOS INTEGRADO
  const [pnjs, setPnjs] = useState([
    { id: "p1", titulo: "REI THORALDI OLDENBURG", versao: "Monarca", categoria: "Aliado Político", descricao: "O governante idoso de Valkaria. Embora debilitado, sua mente estratégica continua afiada.", ativo: true, alinhamento: "Leal e Bom", localizacao: "Trono de Marfim", faccao: "Corte Real", atitude: "Amistoso", historia: "O Rei precisa que os jogadores investiguem discretamente o sumiço do Arquiduque.\n\nSegredos do Mestre:\n• Ele está sendo envenenado por seu conselheiro." },
    { id: "p2", titulo: "ELARA, A SOMBRA", versao: "Assassina", categoria: "Antagonista / Rival", descricao: "Uma ladina letal caçada em três reinos. Sua lealdade pertence unicamente ao ouro.", ativo: true, alinhamento: "Neutro e Mau", localizacao: "Submundo", faccao: "Sindicato da Adaga", atitude: "Inóspito", historia: "Contratada para roubar o mesmo artefato que os heróis buscam.\n\nSegredos:\n• Pode mudar de lado se o grupo pagar o dobro." },
    { id: "p3", titulo: "MESTRE ORION", versao: "Arquimago", categoria: "Mentor Místico", descricao: "Ancião da torre arcana oriental. Detém o conhecimento para decifrar as escrituras antigas.", ativo: false, alinhamento: "Neutro Puro", localizacao: "Torre de Marfim", faccao: "Conselho dos Seis", atitude: "Indiferente", historia: "Não se importa com disputas políticas, apenas com o equilíbrio mágico." }
  ]);

  const [encontros, setEncontros] = useState([
    { id: "e1", titulo: "EMBOSCADA NA PONTE QUEBRADA", nivel: "Nível 4 (Médio)", categoria: "Combate Tático", descricao: "Bandidos posicionados nas colinas cortaram as cordas da ponte suspensa. Grupo encurralado.", recompensa: "300 XP / Joias", ativo: true, tipoCena: "Combate / Terreno Perigoso", ameacas: "4x Salteadores, 1x Atirador (Elara a Sombra espreita aqui)", perigos: "Queda no rio (CD 15)", duracao: "45 min", detalhes: "Ponto de Virada Narrativo:\nSe Elara (PNJ) estiver ativa na sessão, ela lidera este ataque pelas sombras." },
    { id: "e2", titulo: "A CÂMARA DE GÁS DE ENXOFRE", nivel: "Nível 7 (Mortal)", categoria: "Armadilha / Puzzle", descricao: "As portas da tumba se trancam magneticamente. Um gás corrosivo começa a jorrar das estátuas.", recompensa: "Baú de Mitril", ativo: false, tipoCena: "Exploração / Perigo complexo", ameacas: "Armadilha de Tumba", perigos: "Dano de Ácido (2d6/rodada)", duracao: "30 min", detalhes: "Resolução:\nExige desarmar 3 runas na parede com testes de Investigação CD 18." }
  ]);

  const alternarAtivoPnj = (id) => setPnjs(pnjs.map(p => p.id === id ? { ...p, ativo: !p.ativo } : p));
  const alternarAtivoEncontro = (id) => setEncontros(encontros.map(e => e.id === id ? { ...e, ativo: !e.ativo } : e));

  const handleImportarDocumento = (event) => {
    const arquivo = event.target.files[0];
    if (!arquivo) return;
    
    if (subAba === "atores") {
      const novoPnj = { id: `p-ext-${Date.now()}`, titulo: arquivo.name.replace(/\.[^/.]+$/, "").toUpperCase(), versao: "Custom", categoria: "Importado", descricao: "Perfil de PNJ importado para suporte de improviso.", ativo: true, alinhamento: "A definir", localizacao: "Cena Atual", faccao: "Nenhuma", atitude: "Neutro", historia: "Dados brutos do arquivo indexados." };
      setPnjs([novoPnj, ...pnjs]);
    } else {
      const novoEnc = { id: `e-ext-${Date.now()}`, titulo: arquivo.name.replace(/\.[^/.]+$/, "").toUpperCase(), nivel: "Calculando", categoria: "Cena Custom", descricao: "Gatilhos de encontro tático importados.", recompensa: "Padrão", ativo: true, tipoCena: "Improvisado", ameacas: "Ver Arquivo", perigos: "Nenhum", duracao: "Variável", detalhes: "Roteiro carregado com sucesso." };
      setEncontros([novoEnc, ...encontros]);
    }
    alert("Elemento de história materializado e enviado para os eventos ativos!");
  };

  // --- SUB-TELA: DETALHES DO PNJ ---
  if (pnjAberto) {
    return (
      <div className={styles.containerGeral}>
        <div className={styles.telaLeituraWiki}>
          <div className={styles.headerLeitura}>
            <button className={styles.btnVoltar} onClick={() => setPnjAberto(null)}><ChevronLeft size={16} /> Voltar ao Painel</button>
            <div className={styles.tagGrupo}>
              <span className={styles.tagCampanhaLeitura}>{pnjAberto.categoria}</span>
              <span className={styles.tagPapelLeitura}>{pnjAberto.versao}</span>
              <span className={styles.tagStatusLeitura}>{pnjAberto.ativo ? "Em Cena" : "No Banco"}</span>
            </div>
          </div>
          <div className={styles.corpoLeitura}>
            <div className={styles.layoutLeituraLivro}>
              <div className={styles.fichaTecnicaMagia}>
                <Users size={48} className={styles.runaIconVisual} />
                <div className={styles.atributosGrid}>
                  <div><strong>Tendência:</strong> <p>{pnjAberto.alinhamento}</p></div>
                  <div><strong>Local atual:</strong> <p>{pnjAberto.localizacao}</p></div>
                  <div><strong>Facção:</strong> <p>{pnjAberto.faccao}</p></div>
                  <div><strong>Atitude:</strong> <p>{pnjAberto.atitude}</p></div>
                </div>
              </div>
              <div className={styles.textoLeituraWrapper}>
                <h1 className={styles.tituloArtigoNpc}>{pnjAberto.titulo}</h1>
                <div className={styles.divisorEstilizado} />
                <p className={styles.textoLoreNpc}>{pnjAberto.historia}</p>
                <div className={styles.caixaAlertaLeitura}><UserCheck size={18} /><span>Atores ativos influenciam as tabelas de encontros aleatórios automaticamente.</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- SUB-TELA: DETALHES DO ENCONTRO (CORRIGIDO AQUI) ---
  if (encontroAberto) {
    return (
      <div className={styles.containerGeral}>
        <div className={styles.telaLeituraWiki}>
          <div className={styles.headerLeitura}>
            <button className={styles.btnVoltar} onClick={() => setEncontroAberto(null)}><ChevronLeft size={16} /> Voltar ao Painel</button>
            <div className={styles.tagGrupo}>
              <span className={styles.tagCampanhaLeitura}>{encontroAberto.categoria}</span>
              <span className={styles.tagPapelLeitura}>{encontroAberto.nivel}</span> {/* CORRIGIDO: de encontroAvertido para encontroAberto */}
              <span className={styles.tagRecompensaLeitura}>{encontroAberto.recompensa}</span>
            </div>
          </div>
          <div className={styles.corpoLeitura}>
            <div className={styles.layoutLeituraLivro}>
              <div className={styles.fichaTecnicaMagia}>
                <AlertTriangle size={48} className={styles.runaIconVisual} />
                <div className={styles.atributosGrid}>
                  <div><strong>Tipo de Cena:</strong> <p>{encontroAberto.tipoCena}</p></div>
                  <div><strong>Monstros:</strong> <p>{encontroAberto.ameacas}</p></div>
                  <div><strong>Perigos:</strong> <p>{encontroAberto.perigos}</p></div>
                  <div><strong>Tempo Estimado:</strong> <p>{encontroAberto.duracao}</p></div>
                </div>
              </div>
              <div className={styles.textoLeituraWrapper}>
                <h1 className={styles.tituloArtigoNpc}>{encontroAberto.titulo}</h1>
                <div className={styles.divisorEstilizado} />
                <p className={styles.textoLoreNpc}>{encontroAberto.detalhes}</p>
                <div className={styles.caixaAlertaLeitura}><ShieldAlert size={18} /><span>O disparo deste encontro altera as condições de fadiga e iniciativa dos jogadores.</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const atoresFiltrados = pnjs.filter(p => {
    const batimentoAtivo = filtroEstado === "ativos" ? p.ativo : !p.ativo;
    return batimentoAtivo && (p.titulo.toLowerCase().includes(busca.toLowerCase()) || p.categoria.toLowerCase().includes(busca.toLowerCase()));
  });

  const cenasFiltradas = encontros.filter(e => {
    const batimentoAtivo = filtroEstado === "ativos" ? e.ativo : !e.ativo;
    return batimentoAtivo && (e.titulo.toLowerCase().includes(busca.toLowerCase()) || e.categoria.toLowerCase().includes(busca.toLowerCase()));
  });

  return (
    <div className={styles.containerGeral}>
      <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleImportarDocumento} />

      <div className={styles.headerMenu}>
        <div className={styles.abasPrincipais}>
          <button className={`${styles.btnAbaPrincipal} ${subAba === "atores" ? styles.abaPrincipalAtiva : ""}`} onClick={() => { setSubAba("atores"); setBusca(""); }}>
            <Users size={16} /> Elenco de PNJs
          </button>
          <button className={`${styles.btnAbaPrincipal} ${subAba === "cenas" ? styles.abaPrincipalAtiva : ""}`} onClick={() => { setSubAba("cenas"); setBusca(""); }}>
            <Swords size={16} /> Banco de Encontros
          </button>
        </div>

        <div className={styles.controleSessaoEstado}>
          <button className={`${styles.btnEstado} ${filtroEstado === "ativos" ? styles.btnEstadoAtivo : ""}`} onClick={() => setFiltroEstado("ativos")}>
            Ativos na Crônica
          </button>
          <button className={`${styles.btnEstado} ${filtroEstado === "banco" ? styles.btnEstadoAtivo : ""}`} onClick={() => setFiltroEstado("banco")}>
            Ideias/Reserva
          </button>
        </div>

        <div className={styles.buscaWrapper}>
          <Search size={18} className={styles.buscaIcon} />
          <input type="text" placeholder={subAba === "atores" ? "Buscar PNJ..." : "Buscar Encontro..."} value={busca} onChange={(e) => setBusca(e.target.value)} />
        </div>
      </div>

      <div className={styles.painelRolavel}>
        <div className={styles.secaoLayout}>
          <div className={styles.subHeaderInterno}>
            <div>
              <h3>{subAba === "atores" ? "Personagens Não Jogáveis Governamentais" : "Cenas e Confrontos de Turno"}</h3>
              <p>Elementos sob o controle total do mestre configurados para reagir às decisões do grupo.</p>
            </div>
            <button className={styles.btnImportar} onClick={() => fileInputRef.current.click()}>
              <UploadCloud size={16} /> Improvisar Elemento (.json)
            </button>
          </div>

          <div className={styles.gridLivros}>
            {subAba === "atores" && atoresFiltrados.map(pnj => (
              <div key={pnj.id} className={styles.cardLivro}>
                <div className={styles.capaLivroContainer}>
                  <div className={styles.backgroundRunaVisual} />
                  <Users className={styles.imagemCapaIcone} size={40} />
                  <div className={styles.overlayCapa}><span className={styles.badgeCategoriaCapa}>{pnj.categoria}</span></div>
                </div>
                <div className={styles.livroInfoCorpo}>
                  <div className={styles.livroMetaHeader}>
                    <span className={styles.livroVersao}>{pnj.versao}</span>
                    <span className={styles.badgeStatusPnj}>{pnj.atitude}</span>
                  </div>
                  <h4>{pnj.titulo}</h4>
                  <p className={styles.descricaoLivroShort}>{pnj.descricao}</p>
                  <div className={styles.botoesContainerAcao}>
                    <button className={styles.btnAbrirLivro} onClick={() => setPnjAberto(pnj)}>Detalhes</button>
                    <button className={styles.btnInstalarLivro} onClick={() => alternarAtivoPnj(pnj.id)}>
                      {pnj.ativo ? "Remover" : "Trazer à Cena"}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {subAba === "cenas" && cenasFiltradas.map(enc => (
              <div key={enc.id} className={styles.cardLivro}>
                <div className={styles.capaLivroContainer}>
                  <div className={styles.backgroundRunaVisual} />
                  <Swords className={styles.imagemCapaIcone} size={40} />
                  <div className={styles.overlayCapa}><span className={styles.badgeCategoriaCapa}>{enc.categoria}</span></div>
                </div>
                <div className={styles.livroInfoCorpo}>
                  <div className={styles.livroMetaHeader}>
                    <span className={styles.livroVersao}>{enc.nivel}</span>
                    <span className={styles.badgeRecompensaEnc}>{enc.recompensa}</span>
                  </div>
                  <h4>{enc.titulo}</h4>
                  <p className={styles.descricaoLivroShort}>{enc.descricao}</p>
                  <div className={styles.botoesContainerAcao}>
                    <button className={styles.btnAbrirLivro} onClick={() => setEncontroAberto(enc)}>Detalhes</button>
                    <button className={styles.btnInstalarLivro} onClick={() => alternarAtivoEncontro(enc.id)}>
                      {enc.ativo ? "Arquivar" : "Disparar na Mesa"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}