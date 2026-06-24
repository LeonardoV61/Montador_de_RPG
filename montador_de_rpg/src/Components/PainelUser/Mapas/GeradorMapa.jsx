import { useState, useEffect, useRef } from "react";
import styles from "./styles.Mapa.module.css";

const TERRENOS_INFO = {
  1: { nome: "Marsh", svg: "marsh.svg" },
  2: { nome: "Heath", svg: "heath.svg" },
  3: { nome: "Crag", svg: "crags.svg" },
  4: { nome: "Peaks", svg: "peaks.svg" },
  5: { nome: "Forest", svg: "forest.svg" },
  6: { nome: "Valley", svg: "valleys/1-2.svg" }, 
  7: { nome: "Hills", svg: "hills.svg" },
  8: { nome: "Meadow", svg: "meadow.svg" },
  9: { nome: "Bog", svg: "bog.svg" },
  10: { nome: "Lake", svg: "lakes.svg" },
  11: { nome: "Glade", svg: "glades.svg" },
  12: { nome: "Plains", svg: "plain.svg" }
};

const IDS_TERRENOS_BASE = [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12];

const HOLDINGS_TYPES = [
  { tipo: "Castle", svg: "castle.svg" },
  { tipo: "Fortress", svg: "fortress.svg" },
  { tipo: "Town", svg: "town.svg" },
  { tipo: "Tower", svg: "tower.svg" }
];

const LANDMARKS_TYPES = [
  { nome: "Cursed", svg: "cursed.svg" },
  { nome: "Dwellings", svg: "dwellings.svg" },
  { nome: "Hazards", svg: "hazards.svg" },
  { nome: "Monument", svg: "monument.svg" },
  { nome: "Ruins", svg: "ruins.svg" },
  { nome: "Sanctum", svg: "sanctum.svg" }
];

const CAMINHOS_RIOS_VALIDOS = ["1-2", "1-3", "1-4", "1-5", "1-6", "2-3", "2-4", "2-5", "2-6", "3-4", "3-5", "3-6", "4-5", "4-6", "5-6"];

function obterVizinhosHex(r, c, w, h) {
  const par = c % 2 === 0;
  const direcoes = [
    { dr: -1, dc: 0, vindoDe: 4, indoPara: 1 },            // 1: Topo
    { dr: par ? -1 : 0, dc: 1, vindoDe: 5, indoPara: 2 },  // 2: Nordeste
    { dr: par ? 0 : 1, dc: 1, vindoDe: 6, indoPara: 3 },   // 3: Sudeste
    { dr: 1, dc: 0, vindoDe: 1, indoPara: 4 },            // 4: Base
    { dr: par ? 0 : 1, dc: -1, vindoDe: 2, indoPara: 5 },  // 5: Sudoeste
    { dr: par ? -1 : 0, dc: -1, vindoDe: 3, indoPara: 6 }  // 6: Noroeste
  ];

  return direcoes
    .map(d => ({ r: r + d.dr, c: c + d.dc, vindoDe: d.vindoDe, indoPara: d.indoPara }))
    .filter(v => v.r >= 0 && v.r < h && v.c >= 0 && v.c < w);
}

export default function GeradorMapa() {
  const [widthInput, setWidthInput] = useState("12");
  const [heightInput, setHeightInput] = useState("12");
  const [holdingInput, setHoldingInput] = useState("8");
  const [mythsInput, setMythsInput] = useState("6");

  const [gridHex, setGridHex] = useState([]);
  const [listaMitos, setListaMitos] = useState([]);

  const [zoom, setZoom] = useState(1);
  const [posicao, setPosicao] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const areaMapaRef = useRef(null);

  const hexLargura = 100;
  const hexAltura = 86.85;    // Aumentamos para 87px para dar uma margem de sangria vertical
  const hEspaco = 75; 
  const vEspaco = 86.5;

  const handleInputChange = (val, setFunc) => {
    const apenasNum = val.replace(/\D/g, "");
    setFunc(apenasNum);
  };

  const normalizarRotaRio = (entrada, saida) => {
    if (entrada === saida) {
      saida = (entrada + 3) % 6 || 6;
    }
    const opcaoA = `${entrada}-${saida}`;
    const opcaoB = `${saida}-${entrada}`;
    
    if (CAMINHOS_RIOS_VALIDOS.includes(opcaoA)) return opcaoA;
    if (CAMINHOS_RIOS_VALIDOS.includes(opcaoB)) return opcaoB;
    return null;
  };

  const escavarLeitoDoRio = (grid, w, h) => {
    const rStart = Math.floor(Math.random() * h);
    const startCell = { r: rStart, c: 0 };
    
    const rEnd = Math.floor(Math.random() * h);
    const targetCell = { r: rEnd, c: w - 1 };

    let caminhoPercorrido = [];
    const visitados = new Set();

    const obterDistanciaHex = (p1, p2) => {
      const x1 = p1.c;
      const z1 = p1.r - Math.floor(p1.c / 2);
      const y1 = -x1 - z1;

      const x2 = p2.c;
      const z2 = p2.r - Math.floor(p2.c / 2);
      const y2 = -x2 - z2;

      return Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2), Math.abs(z1 - z2));
    };

    const walk = (atual) => {
      caminhoPercorrido.push(atual);
      visitados.add(`${atual.r},${atual.c}`);

      if (atual.r === targetCell.r && atual.c === targetCell.c) {
        return true;
      }

      const vizinhos = obterVizinhosHex(atual.r, atual.c, w, h);
      const opcoesValidas = vizinhos.filter(v => !visitados.has(`${v.r},${v.c}`));

      opcoesValidas.sort((a, b) => {
        const distA = obterDistanciaHex(a, targetCell);
        const distB = obterDistanciaHex(b, targetCell);
        
        const pesoRandomA = distA + (Math.random() * 2 - 1);
        const pesoRandomB = distB + (Math.random() * 2 - 1);
        
        return pesoRandomA - pesoRandomB;
      });

      for (const proximo of opcoesValidas) {
        if (walk(proximo)) {
          return true;
        }
      }

      caminhoPercorrido.pop();
      visitados.delete(`${atual.r},${atual.c}`);
      return false;
    };

    const sucesso = walk(startCell);

    if (!sucesso) {
      console.warn("Não foi possível traçar o rio. Aplicando rota de contingência básica.");
      grid[rStart][0].terreno = 6;
      grid[rStart][0].valleys = "1-4";
      return;
    }

    caminhoPercorrido.forEach(pt => {
      grid[pt.r][pt.c].terreno = 6;
    });

    for (let i = 0; i < caminhoPercorrido.length; i++) {
      const atual = caminhoPercorrido[i];
      const vizinhosDoAtual = obterVizinhosHex(atual.r, atual.c, w, h);

      let entradaEfetiva = (i === 0) ? 6 : 1;
      let saidaEfetiva = (i === caminhoPercorrido.length - 1) ? 3 : 4;

      if (i > 0) {
        const anterior = caminhoPercorrido[i - 1];
        const vAnterior = vizinhosDoAtual.find(v => v.r === anterior.r && v.c === anterior.c);
        if (vAnterior) entradaEfetiva = vAnterior.indoPara;
      }
      if (i < caminhoPercorrido.length - 1) {
        const proximo = caminhoPercorrido[i + 1];
        const vProximo = vizinhosDoAtual.find(v => v.r === proximo.r && v.c === proximo.c);
        if (vProximo) saidaEfetiva = vProximo.indoPara;
      }

      let rotaCalculada = normalizarRotaRio(entradaEfetiva, saidaEfetiva);

      if (!rotaCalculada) {
        for (let j = 1; j <= 5; j++) {
          const testeSaida = (saidaEfetiva + j) % 6 || 6;
          rotaCalculada = normalizarRotaRio(entradaEfetiva, testeSaida);
          if (rotaCalculada) break;
        }
      }

      grid[atual.r][atual.c].valleys = rotaCalculada || "1-4";
    }
  };

  const handleGerarNovoMapa = (e) => {
    if (e) e.preventDefault();
    const w = parseInt(widthInput) || 10;
    const h = parseInt(heightInput) || 10;
    const qtdHoldings = parseInt(holdingInput) || 5;
    const qtdMitos = parseInt(mythsInput) || 4;

    const novoGrid = [];
    for (let r = 0; r < h; r++) {
      const linha = [];
      for (let c = 0; c < w; c++) {
        const idSorteado = IDS_TERRENOS_BASE[Math.floor(Math.random() * IDS_TERRENOS_BASE.length)];
        linha.push({
          terreno: idSorteado,
          holding: null,
          landmark: null,
          isSeatOfPower: false,
          barriers: { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false },
          valleys: null
        });
      }
      novoGrid.push(linha);
    }

    escavarLeitoDoRio(novoGrid, w, h);

    let holdingsColocadas = 0;
    let tentatives = 0;
    while (holdingsColocadas < qtdHoldings && tentatives < 1500) {
      tentatives++;
      const r = Math.floor(Math.random() * h);
      const c = Math.floor(Math.random() * w);
      const tile = novoGrid[r][c];

      if (tile.terreno !== 6 && !tile.holding) {
        tile.holding = { ...HOLDINGS_TYPES[Math.floor(Math.random() * HOLDINGS_TYPES.length)] };
        tile.terreno = 12; 

        if (holdingsColocadas === 0) {
          tile.isSeatOfPower = true;
        }
        holdingsColocadas++;
      }
    }

    for (let r = 0; r < h; r++) {
      for (let c = 0; c < w; c++) {
        const tile = novoGrid[r][c];
        
        if (tile.terreno !== 6) {
          const vizinhos = obterVizinhosHex(r, c, w, h);

          vizinhos.forEach(v => {
            if (v.indoPara === 1 || v.indoPara === 2 || v.indoPara === 3) {
              const neighborTile = novoGrid[v.r][v.c];

              if (neighborTile && neighborTile.terreno !== 6) {
                if (Math.random() < 0.08) {
                  tile.barriers[v.indoPara] = true;
                  // Apenas o hexágono atual assume a responsabilidade de desenhar esta barreira
                  // para evitar duplicação do mesmo segmento no hexágono vizinho.
                }
              }
            }
          });
        }

        if (tile.terreno !== 6 && !tile.holding && Math.random() < 0.12) {
          tile.landmark = { ...LANDMARKS_TYPES[Math.floor(Math.random() * LANDMARKS_TYPES.length)] };
        }
      }
    }

    const mitos = [];
    for (let i = 1; i <= qtdMitos; i++) {
      mitos.push({
        id: i,
        nome: `Mythic Rumor ${i}`,
        r: Math.floor(Math.random() * h),
        c: Math.floor(Math.random() * w)
      });
    }

    setGridHex(novoGrid);
    setListaMitos(mitos);
  };

  useEffect(() => {
    handleGerarNovoMapa();
  }, []);

  useEffect(() => {
    const elementoMapa = areaMapaRef.current;
    if (elementoMapa) {
      elementoMapa.addEventListener("wheel", handleWheel, { passive: false });
    }
    return () => {
      if (elementoMapa) {
        elementoMapa.removeEventListener("wheel", handleWheel);
      }
    };
  }, [gridHex]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - posicao.x, y: e.clientY - posicao.y };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosicao({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    setZoom((prev) => Math.max(0.4, Math.min(2.5, prev + delta)));
  };

  return (
    <div className={styles.containerPainel}>
      <div 
        ref={areaMapaRef}
        className={`${styles.areaMapa} ${isDragging ? styles.dragging : ""}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
      >
        <div 
          className={styles.mapaGrid}
          style={{
            transform: `translate(${posicao.x}px, ${posicao.y}px) scale(${zoom})`,
            transformOrigin: "0 0"
          }}
        >
          {gridHex.map((linha, rIndex) => 
            linha.map((tile, cIndex) => {
              if (!tile || !tile.terreno) return null;

              const posX = cIndex * hEspaco;
              const deslocamentoTopo = cIndex % 2 === 0 ? 0 : vEspaco / 2;
              const posY = rIndex * vEspaco + deslocamentoTopo;

              const temMitoAqui = listaMitos.find(m => m.r === rIndex && m.c === cIndex);
              const temAlgumaBarreira = Object.values(tile.barriers || {}).some(Boolean);
              
              let srcChaoBase = "";
              let srcHoldingStr = null;
              const ehRio = tile.terreno === 6;
              
              if (ehRio) {
                const conexaoValley = tile.valleys || "1-2";
                srcChaoBase = `/src/assets/svgMap/terrains/valleys/${conexaoValley}.svg`;
              } else if (tile.holding) {
                srcChaoBase = `/src/assets/svgMap/terrains/plain.svg`;
                srcHoldingStr = `/src/assets/svgMap/structures/${tile.holding.svg}`;
              } else {
                const dadosTerreno = TERRENOS_INFO[tile.terreno];
                srcChaoBase = `/src/assets/svgMap/terrains/${dadosTerreno.svg}`;
              }

              const srcLandmark = tile.landmark ? `/src/assets/svgMap/modifiers/${tile.landmark.svg}` : null;
              const srcBlankMark = tile.landmark ? `/src/assets/svgMap/modifiers/blank marks/${tile.landmark.svg}` : null;

              return (
                <div
                  key={`${rIndex}-${cIndex}`}
                  className={`${styles.hexagono} ${temAlgumaBarreira ? styles.comBarreiras : ""}`}
                  style={{
                    left: `${posX}px`,
                    top: `${posY}px`,
                    width: `${hexLargura}px`,
                    height: `${hexAltura}px`,
                    // Mantém o zIndex padrão para evitar que rios estáticos matem vizinhos
                    zIndex: ehRio ? 10 : (tile.holding ? 5 : 1)
                  }}
                >
                  {/* Camada Visual do Terreno (Sob o efeito do clip-path do Hexágono) */}
                  <div className={styles.conteudoHex}>
                    {srcChaoBase && (
                      <img 
                        src={srcChaoBase} 
                        className={`${styles.camadaBase} ${tile.isSeatOfPower ? styles.seatOfPower : ""}`} 
                        alt="" 
                      />
                    )}

                    {srcHoldingStr && (
                      <img src={srcHoldingStr} className={styles.camadaBase} alt="" />
                    )}

                    {srcLandmark && srcBlankMark && (
                      <img src={srcBlankMark} className={styles.camadaBlankMark} alt="" />
                    )}

                    {srcLandmark && (
                      <img src={srcLandmark} className={styles.camadaLandmark} alt="" />
                    )}

                    {temMitoAqui && (
                      <div className={styles.bolhinhaMito}>
                        {temMitoAqui.id}
                      </div>
                    )}
                  </div>

                  {/* O SVG fica DENTRO do .hexagono para expandir junto no hover, mas ganha elevação via Z-index 3D do CSS */}
                  <svg viewBox="0 0 100 86.6" className={styles.camadaBarreira}>
                    {/* Lado 1: Topo Superior */}
                    {tile.barriers[1] && (<polygon points="25,0 75,0 71.88,5.41 28.13,5.41" fill="var(--vermelho)" />)}
                    
                    {/* Lado 2: Nordeste (Superior Direito) */}
                    {tile.barriers[2] && (<polygon points="75,0 100,43.3 93.75,43.3 71.88,5.41" fill="var(--vermelho)" />)}
                    
                    {/* Lado 3: Sudeste (Inferior Direito) */}
                    {tile.barriers[3] && (<polygon points="100,43.3 75,86.6 71.88,81.19 93.75,43.3" fill="var(--vermelho)" />)}
                    
                    {/* Lado 4: Base Inferior */}
                    {tile.barriers[4] && (<polygon points="75,86.6 25,86.6 28.13,81.19 71.88,81.19" fill="var(--vermelho)" />)}
                    
                    {/* Lado 5: Sudoeste (Inferior Esquerdo) */}
                    {tile.barriers[5] && (<polygon points="25,86.6 0,43.3 6.25,43.3 28.13,81.19" fill="var(--vermelho)" />)}
                    
                    {/* Lado 6: Noroeste (Superior Esquerdo) */}
                    {tile.barriers[6] && (<polygon points="0,43.3 25,0 28.13,5.41 6.25,43.3" fill="var(--vermelho)" />)}
                  </svg>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className={styles.painelConfig}>
        <h2 className={styles.tituloSecao}>MYTHS & RUMORS</h2>
        <div className={styles.containerListaMitos}>
          {listaMitos.map((mito) => (
            <div key={mito.id} className={styles.linhaMitoEditavel}>
              <span className={styles.numeroMito}>#{mito.id}</span>
              <input 
                type="text" 
                className={styles.inputNomeMito} 
                value={mito.nome}
                onChange={(e) => {
                  setListaMitos(prev => prev.map(m => m.id === mito.id ? {...m, nome: e.target.value} : m));
                }}
              />
              <span className={styles.coordenadaAlvo}>{mito.r + 1}, {mito.c + 1}</span>
            </div>
          ))}
        </div>

        <div className={styles.headerConfig}>
          <h3 className={styles.subTitulo}>CONFIGURATION</h3>
          <button onClick={handleGerarNovoMapa} className={styles.linkRegerar}>
            Regenerate Realm
          </button>
        </div>
        
        <form onSubmit={handleGerarNovoMapa} className={styles.formConfig}>
          <table className={styles.tabelaConfig}>
            <tbody>
              <tr>
                <td>Width</td>
                <td><input type="text" value={widthInput} maxLength={2} onChange={(e) => handleInputChange(e.target.value, setWidthInput)} /></td>
              </tr>
              <tr>
                <td>Height</td>
                <td><input type="text" value={heightInput} maxLength={2} onChange={(e) => handleInputChange(e.target.value, setHeightInput)} /></td>
              </tr>
              <tr>
                <td>Holdings</td>
                <td><input type="text" value={holdingInput} maxLength={2} onChange={(e) => handleInputChange(e.target.value, setHoldingInput)} /></td>
              </tr>
              <tr>
                <td>Myths</td>
                <td><input type="text" value={mythsInput} maxLength={2} onChange={(e) => handleInputChange(e.target.value, setMythsInput)} /></td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    </div>
  );
}