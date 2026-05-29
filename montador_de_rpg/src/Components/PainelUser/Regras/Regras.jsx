import { useState } from "react";
import { Search, BookOpen, ChevronLeft, Shield, Swords, Map, Bookmark } from "lucide-react";
import MytB from "../../../assets/livros/Mythic_BastionLand.png";
import styles from "./styles.Regras.module.css";

export default function Regras() {
  const [categoriaAtiva, setCategoriaAtiva] = useState("basico");
  const [busca, setBusca] = useState("");
  const [regraAberta, setRegraAberta] = useState(null);

  // Banco de dados interno focado apenas nas regras de Mythic Bastionland
  const [regras] = useState([
    {
      id: "regra-1",
      titulo: "Testes de Salvaguarda (Saves)",
      categoria: "basico",
      descricao: "A mecânica central do jogo para evitar perigos e consequências.",
      bannerUrl: MytB, 
      sinopse: "Role 1d20 para rolar igual ou abaixo do seu Atributo (FOR, DES, ou CAR). Um 1 é sempre um sucesso e 20 é sempre uma falha. Se o perigo for mitigado por equipamento ou preparação, você não rola, você simplesmente tem sucesso."
    },
    {
      id: "regra-2",
      titulo: "Combate e Dano",
      categoria: "combate",
      descricao: "Regras para ataques, armaduras e perda de Guarda/Vigor.",
      bannerUrl: MytB, 
      sinopse: "No combate não há rolagem de ataque. Você rola diretamente o dado de dano da sua arma. A Armadura subtrai do dano recebido. O dano restante reduz primeiro a sua Guarda. Se a Guarda chegar a 0, o excesso reduz seu Vigor e você deve fazer um Teste de Salvaguarda de FOR para não sofrer Dano Crítico."
    },
    {
      id: "regra-3",
      titulo: "Exploração e Terrenos",
      categoria: "exploracao",
      descricao: "Navegando pelo Reino, revelando hexágonos e os perigos da viagem.",
      bannerUrl: MytB, 
      sinopse: "O mapa do Reino é dividido em hexágonos. Ao realizar a transição entre terrenos distintos, como deixar as planícies abertas para adentrar uma floresta densa, o ritmo da viagem muda. O Mestre deve verificar encontros ou descobertas baseadas nos Mitos locais a cada novo hexágono explorado."
    },
    {
      id: "regra-4",
      titulo: "Os Mitos (The Myths)",
      categoria: "exploracao",
      descricao: "Criaturas e lendas que distorcem a realidade ao seu redor.",
      bannerUrl: MytB, 
      sinopse: "Os Mitos não são monstros comuns com fichas de combate padrão. Eles alteram o mundo, deixam presságios no terreno e exigem investigação antes que os Cavaleiros possam sequer pensar em enfrentá-los diretamente."
    },
    {
      id: "regra-5",
      titulo: "Glória e Juramentos",
      categoria: "basico",
      descricao: "O avanço dos Cavaleiros e os fardos que carregam.",
      bannerUrl: MytB, 
      sinopse: "Cavaleiros não ganham XP matando monstros. A Glória é alcançada honrando Juramentos, enfrentando Mitos e espalhando seus feitos pelo Reino."
    }
  ]);

  // --- TELA DE LEITURA DA REGRA ---
  if (regraAberta) {
    return (
      <div className={styles.containerGeral}>
        <div className={styles.telaLeituraWiki}>
          <div className={styles.headerLeitura}>
            <button className={styles.btnVoltar} onClick={() => setRegraAberta(null)}>
              <ChevronLeft size={16} /> Voltar ao Índice
            </button>
            <div className={styles.tagGrupo}>
              <span className={styles.tagCampanhaLeitura}>
                {regraAberta.categoria.toUpperCase()}
              </span>
            </div>
          </div>

          <div className={styles.corpoLeitura}>
            <div className={styles.layoutLeituraLivro}>
              <div className={styles.capaLeituraWrapper}>
                <img src={regraAberta.bannerUrl} alt={regraAberta.titulo} />
              </div>
              
              <div className={styles.textoLeituraWrapper}>
                <div className={styles.tituloAlinhamento}>
                  <Bookmark size={28} className={styles.iconSelo} />
                  <h1 className={styles.tituloArtigoNpc}>{regraAberta.titulo}</h1>
                </div>
                <div className={styles.divisorEstilizado} />
                
                {/* Aqui você pode renderizar o texto da regra (pode até usar um parser de Markdown no futuro) */}
                <p className={styles.textoLoreNpc}>{regraAberta.sinopse}</p>
                
              </div>
            </div>
          </div>

          <div className={styles.rodapeProtegido}>
            <span>Bastionland &copy; Chris McDowall. Índice de regras local.</span>
          </div>
        </div>
      </div>
    );
  }

  // --- FILTRO DE BUSCA E CATEGORIAS ---
  const regrasFiltradas = regras.filter(r => {
    let correspondeCategoria = categoriaAtiva === "todos" || r.categoria === categoriaAtiva;
    const respondeBusca = r.titulo.toLowerCase().includes(busca.toLowerCase()) || 
                          r.descricao.toLowerCase().includes(busca.toLowerCase());
    
    return correspondeCategoria && respondeBusca;
  });

  return (
    <div className={styles.containerGeral}>
      
      {/* HEADER PRINCIPAL */}
      <div className={styles.headerMenu}>
        <div className={styles.abasPrincipais}>
          <button 
            className={`${styles.btnAbaPrincipal} ${categoriaAtiva === "todos" ? styles.abaPrincipalAtiva : ""}`}
            onClick={() => { setCategoriaAtiva("todos"); setBusca(""); }}
          >
            <BookOpen size={16} /> Todas as Regras
          </button>
          
          <button 
            className={`${styles.btnAbaPrincipal} ${categoriaAtiva === "basico" ? styles.abaPrincipalAtiva : ""}`}
            onClick={() => { setCategoriaAtiva("basico"); setBusca(""); }}
          >
            <Shield size={16} /> Regras Básicas
          </button>

          <button 
            className={`${styles.btnAbaPrincipal} ${categoriaAtiva === "combate" ? styles.abaPrincipalAtiva : ""}`}
            onClick={() => { setCategoriaAtiva("combate"); setBusca(""); }}
          >
            <Swords size={16} /> Combate
          </button>

          <button 
            className={`${styles.btnAbaPrincipal} ${categoriaAtiva === "exploracao" ? styles.abaPrincipalAtiva : ""}`}
            onClick={() => { setCategoriaAtiva("exploracao"); setBusca(""); }}
          >
            <Map size={16} /> Exploração
          </button>
        </div>

        <div className={styles.buscaWrapper}>
          <Search size={18} className={styles.buscaIcon} />
          <input 
            type="text" 
            placeholder="Buscar regra ou termo..." 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
      </div>

      {/* PAINEL ROLÁVEL */}
      <div className={styles.painelRolavel}>
        <div className={styles.secaoLayout}>
          
          <div className={styles.subHeaderInterno}>
            <div>
              <h3>
                {categoriaAtiva === "todos" && "Índice Completo de Regras"}
                {categoriaAtiva === "basico" && "O Cavaleiro e o Mundo"}
                {categoriaAtiva === "combate" && "Lâminas e Sangue"}
                {categoriaAtiva === "exploracao" && "Hexágonos e Mitos"}
              </h3>
              <p>
                {categoriaAtiva === "todos" && "Consulte rapidamente qualquer mecânica de Mythic Bastionland."}
                {categoriaAtiva === "basico" && "Atributos, Salvaguardas, Glória e as fundações do sistema."}
                {categoriaAtiva === "combate" && "Guarda, Vigor, Dano Crítico e manobras táticas."}
                {categoriaAtiva === "exploracao" && "Viagens por planícies, passagens de florestas e presságios."}
              </p>
            </div>
          </div>

          <div className={styles.gridLivros}>
            {regrasFiltradas.map(regra => (
              <div key={regra.id} className={styles.cardLivro}>
                
                <div className={styles.capaLivroContainer}>
                  <img src={regra.bannerUrl} alt={regra.titulo} className={styles.imagemCapa} />
                  <div className={styles.overlayCapa}>
                    <span className={styles.badgeCategoriaCapa}>
                      {regra.categoria.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className={styles.livroInfoCorpo}>
                  <h4>{regra.titulo}</h4>
                  <p className={styles.descricaoLivroShort}>{regra.descricao}</p>
                  
                  <button className={styles.btnAbrirLivro} onClick={() => setRegraAberta(regra)}>
                    <BookOpen size={14} /> Ler Regra
                  </button>
                </div>

              </div>
            ))}
            
            {regrasFiltradas.length === 0 && (
              <div style={{ padding: "2rem", color: "#888" }}>
                Nenhuma regra encontrada com esse termo.
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}