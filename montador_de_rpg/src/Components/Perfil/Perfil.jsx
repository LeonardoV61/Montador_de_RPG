import { useState, useRef, useEffect } from "react";
import { Upload, Save, User } from "lucide-react";
import styles from "./styles.PerfilJogador.module.css";
import HeronPadrao from "../../assets/perfil/Heron.png"; // Sua imagem padrão inicial

export default function PerfilJogador({ nome, setNome, imagem, setImagem, zoom, setZoom, posX, setPosX, posY, setPosY }) {
  const fileInputRef = useRef(null);

  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagem(reader.result); // Define a string Base64 da imagem
        setZoom(1);
        setPosX(0);
        setPosY(0);
      };
      reader.readAsDataURL(file);
    }
  }

  const [localNome, setLocalNome] = useState(nome);
  const [localImagem, setLocalImagem] = useState(imagem);
  const [localZoom, setLocalZoom] = useState(zoom);
  const [localPosX, setLocalPosX] = useState(posX);
  const [localPosY, setLocalPosY] = useState(posY);

  // Sincroniza os estados locais caso os dados oficiais mudem externamente (ex: carregar do localStorage)
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
        setLocalImagem(reader.result); // Atualiza o rascunho
        setLocalZoom(1);
        setLocalPosX(0);
        setLocalPosY(0);
      };
      reader.readAsDataURL(file);
    }
  }

  function handleSalvar() {
    // 1. Atualiza os estados oficiais no componente Pai (faz a Barra Lateral atualizar)
    setNome(localNome);
    setImagem(localImagem);
    setZoom(localZoom);
    setPosX(localPosX);
    setPosY(localPosY);

    // 2. Salva no banco/localStorage os dados confirmados
    const dadosPerfil = { 
      nome: localNome, 
      imagem: localImagem, 
      zoom: localZoom, 
      posX: localPosX, 
      posY: localPosY 
    };
    localStorage.setItem("perfil_rpg", JSON.stringify(dadosPerfil));
    
    alert("Perfil atualizado com sucesso no seu grimório!");
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.titulo}>Configurações de Personagem</h2>
      
      <div className={styles.cardPerfil}>
        <div className={styles.secaoAvatar}>
          <div className={styles.previewContainer}>
            <div className={styles.circuloAvatar}>
              <img 
                src={localImagem} // Usa o rascunho
                alt="Avatar Preview" 
                style={{
                  transform: `translate(${localPosX}%, ${localPosY}%) scale(${localZoom})`, // Usa o rascunho
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

          {/* Sliders conectados aos estados locais */}
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

        <div className={styles.secaoDados}>
          <div className={styles.inputGroup}>
            <label htmlFor="nomeJogador">Nome do Jogador / Mestre</label>
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

          <button className={styles.btnSalvar} onClick={handleSalvar}>
            <Save size={18} /> Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}