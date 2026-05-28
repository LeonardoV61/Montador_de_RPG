import { useState, useEffect, useRef } from "react";
import styles from "./styles.Mapa.module.css";

const MAPA_TERRENOS = {
  7: styles.planicie,
  5: styles.floresta,
  4: styles.pantano,
  9: styles.montanha,
  0: styles.pico,
  3: styles.colina,
  2: styles.agua
};

const IDS_TERRENOS = [7, 7, 7, 5, 5, 4, 9, 0, 3, 2]; 

export default function GeradorMapa() {
  const [widthInput, setWidthInput] = useState("12");
  const [heightInput, setHeightInput] = useState("12");
  const [landmarkMinInput, setLandmarkMinInput] = useState("3");
  const [landmarkMaxInput, setLandmarkMaxInput] = useState("4");
  const [holdingInput, setHoldingInput] = useState("4");
  const [mythsInput, setMythsInput] = useState("6");
  
  const [mapaWidth, setMapaWidth] = useState(12);
  const [mapaHeight, setMapaHeight] = useState(12);
  const [gridHex, setGridHex] = useState([]);
  
  // Estado que armazena a lista dinâmica de mitos gerados proceduralmente
  const [listaMitos, setListaMitos] = useState([]);
  
  const areaMapaRef = useRef(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [scrollStart, setScrollStart] = useState({ left: 0, top: 0 });

  const hexLargura = 64; 
  const hexAltura = 73.9; 
  const hEspaco = hexLargura;
  const vEspaco = hexAltura * 0.75; 

  const gerarMapaProcedural = (w, h, qtdMitos) => {
    // 1. Geração dos Tiles
    const novasLinhas = [];
    for (let r = 0; r < h; r++) {
      const linhaTiles = [];
      for (let c = 0; c < w; c++) {
        const terrenoAleatorio = IDS_TERRENOS[Math.floor(Math.random() * IDS_TERRENOS.length)];
        const landmarkAleatorio = Math.random() > 0.93 ? 11 : 0;
        linhaTiles.push([terrenoAleatorio, landmarkAleatorio, null, null, 0, null, null]);
      }
      novasLinhas.push(JSON.stringify(linhaTiles));
    }
    const mapaProcessado = novasLinhas.map((linhaStr) => JSON.parse(linhaStr));
    setGridHex(mapaProcessado);
    setMapaWidth(w);
    setMapaHeight(h);

    // 2. Geração Procedural dos Mitos espalhados pelo mapa
    const novosMitos = [];
    for (let i = 1; i <= qtdMitos; i++) {
      const rowAleatoria = Math.floor(Math.random() * h);
      const colAleatoria = Math.floor(Math.random() * w);
      novosMitos.push({
        id: i,
        nome: `Myth ${i}`, // Nome padrão inicial editável
        r: rowAleatoria,
        c: colAleatoria
      });
    }
    setListaMitos(novosMitos);

    if (areaMapaRef.current) {
      areaMapaRef.current.scrollLeft = 0;
      areaMapaRef.current.scrollTop = 0;
    }
  };

  useEffect(() => {
    gerarMapaProcedural(12, 12, 6);
  }, []);

  // Controla a edição em tempo real do nome de um mito específico na lista
  const handleMythNameChange = (id, novoNome) => {
    setListaMitos(prev => 
      prev.map(mito => mito.id === id ? { ...mito, nome: novoNome } : mito)
    );
  };

  const handleMouseDown = (e) => {
    e.preventDefault(); 
    setIsDragging(true);
    setDragStart({ x: e.pageX, y: e.pageY });
    setScrollStart({
      left: areaMapaRef.current.scrollLeft,
      top: areaMapaRef.current.scrollTop
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const mudeiX = e.pageX - dragStart.x;
    const mudeiY = e.pageY - dragStart.y;
    areaMapaRef.current.scrollLeft = scrollStart.left - mudeiX;
    areaMapaRef.current.scrollTop = scrollStart.top - mudeiY;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const handleInputChange = (value, setter) => {
    const apenasNumeros = value.replace(/\D/g, "");
    setter(apenasNumeros);
  };

  const handleGerarNovoMapa = (e) => {
    e.preventDefault();
    const finalW = Math.max(1, parseInt(widthInput, 10) || 1);
    const finalH = Math.max(1, parseInt(heightInput, 10) || 1);
    const finalMyths = parseInt(mythsInput, 10) || 0;
    
    setWidthInput(finalW.toString());
    setHeightInput(finalH.toString());
    setMythsInput(finalMyths.toString());

    gerarMapaProcedural(finalW, finalH, finalMyths);
  };

  return (
    <div className={styles.containerPainel}>
      {/* Esquerda: O Viewport do Mapa */}
      <div 
        className={`${styles.areaMapa} ${isDragging ? styles.dragging : ""}`}
        ref={areaMapaRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
      >
        <div 
          className={styles.mapaGrid}
          style={{ 
            width: `${mapaWidth * hEspaco + (hexLargura / 2)}px`, 
            height: `${(mapaHeight - 1) * vEspaco + hexAltura}px`
          }}
        >
          {gridHex.map((linha, rIndex) => 
            linha.map((tile, cIndex) => {
              const terrenoId = tile[0];
              const landmarkId = tile[1];
              const classeTerreno = MAPA_TERRENOS[terrenoId] || styles.padrao;

              const deslocamentoEsquerda = rIndex % 2 === 0 ? 0 : hexLargura / 2;
              const posX = cIndex * hEspaco + deslocamentoEsquerda;
              const posY = rIndex * vEspaco;

              // Verifica se há algum mito nesta coordenada para renderizar um marcador visual
              const temMitoAqui = listaMitos.find(m => m.r === rIndex && m.c === cIndex);

              return (
                <div
                  key={`${rIndex}-${cIndex}`}
                  className={`${styles.hexagono} ${classeTerreno}`}
                  style={{
                    left: `${posX}px`,
                    top: `${posY}px`,
                    width: `${hexLargura}px`,
                    height: `${hexAltura}px`
                  }}
                >
                  <div className={styles.conteudoHex}>
                    {landmarkId !== 0 && <span className={styles.landmark}>🏰</span>}
                    {temMitoAqui && <span className={styles.marcadorMito}>🔴</span>}
                    <span className={styles.coordenada}>{rIndex},{cIndex}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Direita: Painel Estilizado idêntico ao Mythic Bastionland */}
      <div className={styles.painelLateralInfo}>
        <h2 className={styles.tituloSecao}>MYTHS</h2>
        
        <div className={styles.containerListaMitos}>
          {listaMitos.map((mito) => (
            <div key={mito.id} className={styles.linhaMitoEditavel}>
              <span className={styles.numeroMito}>{mito.id}.</span>
              <input
                type="text"
                className={styles.inputNomeMito}
                value={mito.nome}
                onChange={(e) => handleMythNameChange(mito.id, e.target.value)}
              />
              <span className={styles.coordenadaAlvo}>{mito.r}, {mito.c}</span>
            </div>
          ))}
        </div>

        <div className={styles.headerConfig}>
          <h3 className={styles.subTitulo}>CONFIGURATION</h3>
          <button onClick={handleGerarNovoMapa} className={styles.linkRegerar}>
            Regenerate with new configuration
          </button>
        </div>
        
        <form onSubmit={handleGerarNovoMapa} className={styles.formConfig}>
          <table className={styles.tabelaConfig}>
            <tbody>
              <tr>
                <td>Width</td>
                <td>
                  <input 
                    type="text" 
                    value={widthInput} 
                    maxLength={2} 
                    onChange={(e) => handleInputChange(e.target.value, setWidthInput)} 
                  />
                </td>
              </tr>
              <tr>
                <td>Height</td>
                <td>
                  <input 
                    type="text" 
                    value={heightInput} 
                    maxLength={2} 
                    onChange={(e) => handleInputChange(e.target.value, setHeightInput)} 
                  />
                </td>
              </tr>
              <tr>
                <td>Landmark count min (per type)</td>
                <td>
                  <input 
                    type="text" 
                    value={landmarkMinInput} 
                    maxLength={2} 
                    onChange={(e) => handleInputChange(e.target.value, setLandmarkMinInput)} 
                  />
                </td>
              </tr>
              <tr>
                <td>Landmark count max (per type)</td>
                <td>
                  <input 
                    type="text" 
                    value={landmarkMaxInput} 
                    maxLength={2} 
                    onChange={(e) => handleInputChange(e.target.value, setLandmarkMaxInput)} 
                  />
                </td>
              </tr>
              <tr>
                <td>Holding count</td>
                <td>
                  <input 
                    type="text" 
                    value={holdingInput} 
                    maxLength={2} 
                    onChange={(e) => handleInputChange(e.target.value, setHoldingInput)} 
                  />
                </td>
              </tr>
              <tr>
                <td>Myths count</td>
                <td>
                  <input 
                    type="text" 
                    value={mythsInput} 
                    maxLength={2} 
                    onChange={(e) => handleInputChange(e.target.value, setMythsInput)} 
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    </div>
  );
}