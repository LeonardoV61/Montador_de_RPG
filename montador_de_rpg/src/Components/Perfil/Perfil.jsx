import { useState, useRef } from "react";
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

  function handleSalvar() {
    // Aqui você integraria com seu banco de dados ou localStorage
    const dadosPerfil = { nome, imagem, zoom, posX, posY };
    localStorage.setItem("perfil_rpg", JSON.stringify(dadosPerfil));
    console.log("Salvando dados do perfil RPG:", dadosPerfil);
    alert("Perfil atualizado com sucesso no seu grimório!");
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.titulo}>Configurações de Personagem</h2>
      
      <div className={styles.cardPerfil}>
        {/* Lado Esquerdo: Área do Avatar e Controles de Posição */}
        <div className={styles.secaoAvatar}>
          <div className={styles.previewContainer}>
            <div className={styles.circuloAvatar}>
              <img 
                src={imagem} 
                alt="Avatar Preview" 
                style={{transform: `translate(${posX}%, ${posY}%) scale(${zoom})`, cursor: "move", width: "100%",height: "100%",objectFit: "cover"}}
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
                value={zoom} 
                onChange={(e) => setZoom(parseFloat(e.target.value))} 
              />
            </label>
            <label>
              Posição Horizontal (X):
              <input 
                type="range" 
                min="-100" 
                max="100" 
                value={posX} 
                onChange={(e) => setPosX(parseInt(e.target.value))} 
              />
            </label>
            <label>
              Posição Vertical (Y):
              <input 
                type="range" 
                min="-100" 
                max="100" 
                value={posY} 
                onChange={(e) => setPosY(parseInt(e.target.value))} 
              />
            </label>
          </div>
        </div>

        {/* Lado Direito: Formulário de Dados */}
        <div className={styles.secaoDados}>
          <div className={styles.inputGroup}>
            <label htmlFor="nomeJogador">Nome do Jogador / Mestre</label>
            <div className={styles.inputIconWrapper}>
              <User size={18} className={styles.inputIcon} />
              <input 
                id="nomeJogador"
                type="text" 
                value={nome} 
                onChange={(e) => setNome(e.target.value.toUpperCase())} // Mantém o padrão em caixa alta se desejar
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
