import { useState, useRef, useEffect } from "react";
import { Upload, Save, User, Link2, Unlink, Lock, Key } from "lucide-react"; // Importei os ícones Lock e Key
import styles from "./styles.PerfilJogador.module.css";
import Chrome from "../../../assets/icons/google-icon.svg";
import Disc from "../../../assets/icons/discord-icon.svg";
// import HeronPadrao from "../../../assets/perfil/Heron.png"; // Mantido comentado se não estiver em uso

export default function PerfilJogador({ nome, setNome, imagem, setImagem, zoom, setZoom, posX, setPosX, posY, setPosY }) {
  const fileInputRef = useRef(null);
  
  // --- ESTADOS LOCAIS (Rascunho) ---
  const [localNome, setLocalNome] = useState(nome);
  const [localImagem, setLocalImagem] = useState(imagem);
  const [localZoom, setLocalZoom] = useState(zoom);
  const [localPosX, setLocalPosX] = useState(posX);
  const [localPosY, setLocalPosY] = useState(posY);

  // --- ESTADOS DE REDEFINIR SENHA ---
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  // --- ESTADO DE CONTAS VINCULADAS ---
  const [contas, setContas] = useState([
    { id: "google", nome: "Google", conectado: true, email: "mestre.heron@gmail.com", srcIcone: Chrome },
    { id: "discord", nome: "Discord", conectado: false, email: "", srcIcone: Disc },
  ]);

  // Sincroniza os estados locais caso os dados oficiais mudem externamente
  useEffect(() => {
    setLocalNome(nome);
    setLocalImagem(imagem);
    setLocalZoom(zoom);
    setLocalPosX(posX);
    setLocalPosY(posY);
  }, [nome, imagem, zoom, posX, posY]);

  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalImagem(reader.result);
        setLocalZoom(1);
        setLocalPosX(0);
        setLocalPosY(0);
      };
      reader.readAsDataURL(file);
    }
  }

  // Alternador de conexões (Mock Auth)
  function handleToggleConta(id) {
    setContas(prevContas =>
      prevContas.map(conta => {
        if (conta.id === id) {
          return {
            ...conta,
            conectado: !conta.conectado,
            email: !conta.conectado ? `heron.${id}@grimorio.com` : ""
          };
        }
        return conta;
      })
    );
  }

  // Handler para Redefinir Senha
  function handleRedefinirSenha() {
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      alert("Por favor, preencha todos os campos de senha.");
      return;
    }
    if (novaSenha !== confirmarSenha) {
      alert("A nova senha e a confirmação não coincidem!");
      return;
    }
    
    // Aqui você faria a chamada para sua API/Backend atualizar a senha de fato
    console.log("Senha alterada com sucesso. (Mock)");
    alert("Sua senha foi redefinida com sucesso!");
    
    // Limpa os campos após o sucesso
    setSenhaAtual("");
    setNovaSenha("");
    setConfirmarSenha("");
  }

  function handleSalvar() {
    // Atualiza os estados oficiais no componente Pai
    setNome(localNome);
    setImagem(localImagem);
    setZoom(localZoom);
    setPosX(localPosX);
    setPosY(localPosY);

    // Salva no localStorage
    const dadosPerfil = { 
      nome: localNome, 
      imagem: localImagem, 
      zoom: localZoom, 
      posX: localPosX, 
      posY: localPosY 
    };
    localStorage.setItem("perfil_rpg", JSON.stringify(dadosPerfil));
    alert("Configurações do perfil salvas com sucesso!");
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.titulo}>Configurações do Perfil</h2>
      
      <div className={styles.cardPerfil}>
        
        {/* LADO ESQUERDO: Área do Avatar Identica à Anterior */}
        <div className={styles.secaoAvatar}>
          <div className={styles.previewContainer}>
            <div className={styles.circuloAvatar}>
              <img 
                src={localImagem} 
                alt="Avatar Preview" 
                style={{
                  transform: `translate(${localPosX}%, ${localPosY}%) scale(${localZoom})`, 
                  cursor: "move", 
                  width: "100%", 
                  height: "100%", 
                  objectFit: "cover"
                }}
              />
            </div>
          </div>

          <button 
            className={styles.btnUpload} 
            onClick={() => fileInputRef.current.click()}
          >
            <Upload size={16} /> Alterar Imagem
          </button>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            className={styles.hiddenInput}
          />

          {/* Sliders de Ajuste Fino */}
          <div className={styles.controlesImagem}>
            <label>
              Zoom:
              <input 
                type="range" 
                min="1" 
                max="3" 
                step="0.1" 
                value={localZoom} 
                onChange={(e) => setLocalZoom(parseFloat(e.target.value))} 
              />
            </label>
            <label>
              Posição Horizontal (X):
              <input 
                type="range" 
                min="-100" 
                max="100" 
                value={localPosX} 
                onChange={(e) => setLocalPosX(parseInt(e.target.value))} 
              />
            </label>
            <label>
              Posição Vertical (Y):
              <input 
                type="range" 
                min="-100" 
                max="100" 
                value={localPosY} 
                onChange={(e) => setLocalPosY(parseInt(e.target.value))} 
              />
            </label>
          </div>
        </div>

        {/* LADO DIREITO: Identidade do Usuário e Vínculos */}
        <div className={styles.secaoDados}>
          
          {/* Bloco 1: Campo de Nome */}
          <div className={styles.blocoConfig}>
            <h3 className={styles.subtituloSecao}>Identidade</h3>
            <div className={styles.inputGroup}>
              <label htmlFor="nomeJogador">Nome de Exibição (Herói / Mestre)</label>
              <div className={styles.inputIconWrapper}>
                <User size={18} className={styles.inputIcon} />
                <input 
                  id="nomeJogador"
                  type="text" 
                  value={localNome} 
                  onChange={(e) => setLocalNome(e.target.value.toUpperCase())} 
                  placeholder="Digite seu nome de herói..."
                />
              </div>
            </div>
          </div>

          {/* NOVO BLOCO: Redefinir Senha */}
          <div className={styles.blocoConfig}>
            <h3 className={styles.subtituloSecao}>Segurança</h3>
            
            <div className={styles.inputGroup}>
              <label htmlFor="senhaAtual">Senha Atual</label>
              <div className={styles.inputIconWrapper}>
                <Lock size={18} className={styles.inputIcon} />
                <input 
                  id="senhaAtual"
                  type="password" 
                  value={senhaAtual} 
                  onChange={(e) => setSenhaAtual(e.target.value)} 
                  placeholder="Sua senha atual"
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="novaSenha">Nova Senha</label>
              <div className={styles.inputIconWrapper}>
                <Key size={18} className={styles.inputIcon} />
                <input 
                  id="novaSenha"
                  type="password" 
                  value={novaSenha} 
                  onChange={(e) => setNovaSenha(e.target.value)} 
                  placeholder="Sua nova senha"
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="confirmarSenha">Confirmar Nova Senha</label>
              <div className={styles.inputIconWrapper}>
                <Key size={18} className={styles.inputIcon} />
                <input 
                  id="confirmarSenha"
                  type="password" 
                  value={confirmarSenha} 
                  onChange={(e) => setConfirmarSenha(e.target.value)} 
                  placeholder="Repita a nova senha"
                />
              </div>
            </div>

            <button 
              type="button" 
              className={styles.btnSecundario} // Recomendo criar esta classe no CSS
              onClick={handleRedefinirSenha}
              style={{ marginTop: "10px" }}
            >
              Atualizar Senha
            </button>
          </div>

          {/* Bloco 3: Lista de Vínculos de Contas */}
          <div className={styles.blocoConfig}>
            <h3 className={styles.subtituloSecao}>Vincular Contas Externas</h3>
            <div className={styles.listaContas}>
              {contas.map((conta) => (
                <div key={conta.id} className={`${styles.itemConta} ${conta.conectado ? styles.contaConectada : ""}`}>
                  <div className={styles.infoContaLeft}>
                    <img 
                      src={conta.srcIcone} 
                      alt={`Ícone ${conta.nome}`} 
                      className={styles.iconeMidiaSVG} 
                    />
                    <div>
                      <p className={styles.nomeMidia}>{conta.nome}</p>
                      <p className={styles.statusMidia}>
                        {conta.conectado ? conta.email : "Nenhuma conta vinculada"}
                      </p>
                    </div>
                  </div>
                  
                  <button 
                    type="button"
                    className={conta.conectado ? styles.btnDesvincular : styles.btnVincular}
                    onClick={() => handleToggleConta(conta.id)}
                  >
                    {conta.conectado ? (
                      <>
                        <Unlink size={14} /> Desvincular
                      </>
                    ) : (
                      <>
                        <Link2 size={14} /> Vincular Conta
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Botão Salvar Alinhado na parte inferior */}
          <button className={styles.btnSalvar} onClick={handleSalvar}>
            <Save size={18} /> Salvar Alterações do Perfil
          </button>
        </div>

      </div>
    </div>
  );
}