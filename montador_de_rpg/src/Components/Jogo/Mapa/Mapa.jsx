import { useState, useEffect, useRef, useContext, createContext } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import styles from './styles.Mapa.module.css';
import { ContextoAbasPersonagem, ContextoMesaFisica } from '../../../pages/Jogo/Jogo.jsx';
import MapaFerramentas from '../MapaFerramentas/MapaFerramentas.jsx';
import AvatarPersonagem from '../AvatarPersonagem/AvatarPersonagem.jsx';
import MenuContexto from '../MenuContexto/MenuContexto';
import { ChaoMesa, ParedesMesa } from '../AbaDados/MesaFisica.jsx';
import { DadoFisico } from '../AbaDados/physics/objects/DadoFisico.jsx';
import { MoedaFisica } from '../AbaDados/physics/objects/MoedaFisica.jsx';
export const ContextoAvatar = createContext(null);

// Constantes do Gerador de Mapa
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
  { nome: "Monuments", svg: "monuments.svg" },
  { nome: "Ruins", svg: "ruins.svg" },
  { nome: "Sanctum", svg: "sanctum.svg" }
];
const CAMINHOS_RIOS_VALIDOS = ["1-2", "1-3", "1-4", "1-5", "1-6", "2-3", "2-4", "2-5", "2-6", "3-4", "3-5", "3-6", "4-5", "4-6", "5-6"];

function obterVizinhosHex(r, c, w, h) {
  const par = c % 2 === 0;
  const direcoes = [
    { dr: -1, dc: 0, vindoDe: 4, indoPara: 1 },
    { dr: par ? -1 : 0, dc: 1, vindoDe: 5, indoPara: 2 },
    { dr: par ? 0 : 1, dc: 1, vindoDe: 6, indoPara: 3 },
    { dr: 1, dc: 0, vindoDe: 1, indoPara: 4 },
    { dr: par ? 0 : 1, dc: -1, vindoDe: 2, indoPara: 5 },
    { dr: par ? -1 : 0, dc: -1, vindoDe: 3, indoPara: 6 }
  ];
  return direcoes
    .map(d => ({ r: r + d.dr, c: c + d.dc, vindoDe: d.vindoDe, indoPara: d.indoPara }))
    .filter(v => v.r >= 0 && v.r < h && v.c >= 0 && v.c < w);
}

export default function Mapa() {
   const { abasAbertas } = useContext(ContextoAbasPersonagem);
   const dadosAberta = !!abasAbertas?.Dados;
   const anotacoesAberta = !!abasAbertas?.Anotacoes;

   const [contextoAberto, setContextoAberto] = useState(false);
   const [avatarSelecionado, setAvatarSelecionado] = useState("Aldric");

   // Estados do Gerador de Mapa incorporados
   const [gridHex, setGridHex] = useState([]);
   const [listaMitos, setListaMitos] = useState([]);
   const [zoom, setZoom] = useState(1);
   const [posicao, setPosicao] = useState({ x: 0, y: 0 });
   const [isDragging, setIsDragging] = useState(false);
   const dragStart = useRef({ x: 0, y: 0 });

   // Dimensões do Grid do Gerador
   const widthInput = 12;
   const heightInput = 12;
   const qtdHoldings = 8;
   const qtdMitos = 6;

   const hexLargura = 100;
   const hexAltura = 86.6; 
   const hEspaco = 75; 
   const vEspaco = 86.6; 

   const normalizarRotaRio = (entrada, saida) => {
      if (entrada === saida) saida = (entrada + 3) % 6 || 6;
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
         const x1 = p1.c; const z1 = p1.r - Math.floor(p1.c / 2); const y1 = -x1 - z1;
         const x2 = p2.c; const z2 = p2.r - Math.floor(p2.c / 2); const y2 = -x2 - z2;
         return Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2), Math.abs(z1 - z2));
      };

      const walk = (atual) => {
         caminhoPercorrido.push(atual);
         visitados.add(`${atual.r},${atual.c}`);
         if (atual.r === targetCell.r && atual.c === targetCell.c) return true;
         const vizinhos = obterVizinhosHex(atual.r, atual.c, w, h);
         const opcoesValidas = vizinhos.filter(v => !visitados.has(`${v.r},${v.c}`));
         opcoesValidas.sort((a, b) => {
            return (obterDistanciaHex(a, targetCell) + (Math.random() * 2 - 1)) - (obterDistanciaHex(b, targetCell) + (Math.random() * 2 - 1));
         });
         for (const proximo of opcoesValidas) { if (walk(proximo)) return true; }
         caminhoPercorrido.pop();
         visitados.delete(`${atual.r},${atual.c}`);
         return false;
      };

      if (walk(startCell)) {
         caminhoPercorrido.forEach(pt => { grid[pt.r][pt.c].terreno = 6; });
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
            grid[atual.r][atual.c].valleys = rotaCalculada || "1-4";
         }
      }
   };

   const handleGerarNovoMapa = () => {
      const w = widthInput; const h = heightInput;
      const novoGrid = [];
      for (let r = 0; r < h; r++) {
         const linha = [];
         for (let c = 0; c < w; c++) {
            linha.push({
               terreno: IDS_TERRENOS_BASE[Math.floor(Math.random() * IDS_TERRENOS_BASE.length)],
               holding: null, landmark: null, isSeatOfPower: false,
               barriers: { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false }, valleys: null
            });
         }
         novoGrid.push(linha);
      }
      escavarLeitoDoRio(novoGrid, w, h);
      let holdingsColocadas = 0; let tentatives = 0;
      while (holdingsColocadas < qtdHoldings && tentatives < 1500) {
         tentatives++; const r = Math.floor(Math.random() * h); const c = Math.floor(Math.random() * w);
         if (novoGrid[r][c].terreno !== 6 && !novoGrid[r][c].holding) {
            novoGrid[r][c].holding = { ...HOLDINGS_TYPES[Math.floor(Math.random() * HOLDINGS_TYPES.length)] };
            novoGrid[r][c].terreno = 12;
            if (holdingsColocadas === 0) novoGrid[r][c].isSeatOfPower = true;
            holdingsColocadas++;
         }
      }
      for (let r = 0; r < h; r++) {
         for (let c = 0; c < w; c++) {
            if (novoGrid[r][c].terreno !== 6) {
               obterVizinhosHex(r, c, w, h).forEach(v => {
                  if ((v.indoPara === 1 || v.indoPara === 2 || v.indoPara === 3) && novoGrid[v.r][v.c]?.terreno !== 6) {
                     if (Math.random() < 0.08) {
                        novoGrid[r][c].barriers[v.indoPara] = true;
                     }
                  }
               });
            }
            if (novoGrid[r][c].terreno !== 6 && !novoGrid[r][c].holding && Math.random() < 0.12) {
               novoGrid[r][c].landmark = { ...LANDMARKS_TYPES[Math.floor(Math.random() * LANDMARKS_TYPES.length)] };
            }
         }
      }
      const mitos = [];
      for (let i = 1; i <= qtdMitos; i++) {
         mitos.push({ id: i, nome: `Mythic Rumor ${i}`, r: Math.floor(Math.random() * h), c: Math.floor(Math.random() * w) });
      }
      setGridHex(novoGrid);
      setListaMitos(mitos);
   };

   useEffect(() => { handleGerarNovoMapa(); }, []);

   const handleMouseDown = (e) => {
      if (e.button !== 0) return; 
      if (!possuiDadosInterativos) {
         setIsDragging(true);
         dragStart.current = { x: e.clientX - posicao.x, y: e.clientY - posicao.y };
      }
   };
   const handleMouseMove = (e) => {
      if (!isDragging) return;
      setPosicao({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
   };
   const handleMouseUpOrLeave = () => setIsDragging(false);
   const handleWheel = (e) => {
      const delta = e.deltaY < 0 ? 0.1 : -0.1;
      setZoom((prev) => Math.max(0.4, Math.min(2.5, prev + delta)));
   };

   const [ctxMenuX, setCtxMenuX] = useState(0);
   const [ctxMenuY, setCtxMenuY] = useState(0);

   function canvasCtxMenu(e) {
      e.preventDefault();
      setCtxMenuX(e.clientX > window.innerWidth / 2 ? e.clientX - 172 : e.clientX);
      setCtxMenuY(e.clientY > window.innerHeight / 2 ? e.clientY - 165 : e.clientY);
      setContextoAberto(true);
   }

   const { dadosAtivosNaMesa, possuiDadosInterativos, onDadoParou } = useContext(ContextoMesaFisica);

   return (
       <main 
         className={`${styles.mapa} ${isDragging ? styles.dragging : ""}`} 
         id="map" 
         onClick={() => setContextoAberto(false)} 
         onContextMenu={canvasCtxMenu}
         onMouseDown={handleMouseDown}
         onMouseMove={handleMouseMove}
         onMouseUp={handleMouseUpOrLeave}
         onMouseLeave={handleMouseUpOrLeave}
         onWheel={handleWheel}
         style={{ position: 'fixed', top: 'var(--navbar-height, 42px)', left: 0, width: '100vw', height: 'calc(100vh - var(--navbar-height, 42px))', overflow: 'hidden', zIndex: 1 }}
       >
         
         <div 
           className={styles.mapaGrid}
           style={{
             position: 'absolute', top: 0, left: 0, padding: '40px',
             transform: `translate(${posicao.x}px, ${posicao.y}px) scale(${zoom})`,
             transformOrigin: "0 0", zIndex: 1
           }}
         >
          {gridHex.map((linha, rIndex) => 
            linha.map((tile, cIndex) => {
              if (!tile || !tile.terreno) return null;

              const posX = cIndex * hEspaco;
              const deslocamentoTopo = cIndex % 2 === 0 ? 0 : vEspaco / 2;
              const posY = rIndex * vEspaco + deslocamentoTopo;
              const temMitoAqui = listaMitos.find(m => m.r === rIndex && m.c === cIndex);
              
              let srcChaoBase = ""; let srcHoldingStr = null;
              const ehRio = tile.terreno === 6;
              
              if (ehRio) {
                srcChaoBase = `/src/assets/svgMap/terrains/valleys/${tile.valleys || "1-2"}.svg`;
              } else if (tile.holding) {
                srcChaoBase = `/src/assets/svgMap/terrains/plain.svg`;
                srcHoldingStr = `/src/assets/svgMap/structures/${tile.holding.svg}`;
              } else {
                srcChaoBase = `/src/assets/svgMap/terrains/${TERRENOS_INFO[tile.terreno].svg}`;
              }

              const srcLandmark = tile.landmark ? `/src/assets/svgMap/modifiers/${tile.landmark.svg}` : null;
              const srcBlankMark = tile.landmark ? `/src/assets/svgMap/modifiers/blank marks/${tile.landmark.svg}` : null;

              // Identifica se este bloco específico contém barreiras vermelhas nativas
              const temAlgumaBarreira = Object.values(tile.barriers).some(b => b === true);

              return (
                <div
                  key={`${rIndex}-${cIndex}`}
                  className={`${styles.hexagono} ${temAlgumaBarreira ? styles.comBarreiras : ""}`}
                  style={{
                    position: 'absolute', left: `${posX}px`, top: `${posY}px`,
                    width: `${hexLargura}px`, height: `${hexAltura}px`,
                    zIndex: ehRio ? 10 : (tile.holding ? 5 : 1)
                  }}
                >
                  <div className={styles.conteudoHex}>
                    {srcChaoBase && <img src={srcChaoBase} className={styles.camadaBase} alt="" />}
                    {srcHoldingStr && <img src={srcHoldingStr} className={styles.camadaBase} alt="" />}
                    {srcLandmark && srcBlankMark && <img src={srcBlankMark} className={styles.camadaBlankMark} alt="" />}
                    {srcLandmark && <img src={srcLandmark} className={styles.camadaLandmark} alt="" />}
                    {temMitoAqui && <div className={styles.bolhinhaMito}>{temMitoAqui.id}</div>}
                  </div>

                  <svg viewBox="0 0 100 86.6" className={styles.camadaBarreira}>
                    {/* Exibe dinamicamente as barreiras vermelhas sorteadas */}
                    {tile.barriers[1] && <line x1="25" y1="0"    x2="75" y2="0"    stroke="#ba1a1a" strokeWidth="6" strokeLinecap="round" />}
                    {tile.barriers[2] && <line x1="75" y1="0"    x2="100" y2="43.3" stroke="#ba1a1a" strokeWidth="6" strokeLinecap="round" />}
                    {tile.barriers[3] && <line x1="100" y1="43.3" x2="75" y2="86.6" stroke="#ba1a1a" strokeWidth="6" strokeLinecap="round" />}
                    {tile.barriers[4] && <line x1="75" y1="86.6" x2="25" y2="86.6" stroke="#ba1a1a" strokeWidth="6" strokeLinecap="round" />}
                    {tile.barriers[5] && <line x1="25" y1="86.6" x2="0"   y2="43.3" stroke="#ba1a1a" strokeWidth="6" strokeLinecap="round" />}
                    {tile.barriers[6] && <line x1="0"  y1="43.3" x2="25" y2="0"    stroke="#ba1a1a" strokeWidth="6" strokeLinecap="round" />}
                  </svg>
                </div>
              );
            })
          )}
         </div>

         {/* CAMADA INVISÍVEL 3D PARA OS DADOS (zIndex: 2) */}
         {dadosAtivosNaMesa.length > 0 && (
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2, pointerEvents: possuiDadosInterativos ? 'auto' : 'none' }}>
               <Canvas camera={{ position: [0, 5.5, 5.5], fov: 40 }} shadows gl={{ alpha: true }}>
                  <ambientLight intensity={0.6} />
                  <pointLight position={[8, 12, 8]} castShadow intensity={1.5} />
                  <directionalLight position={[-5, 8, -2]} intensity={0.4} />
                  <Physics gravity={[0, -9.81, 0]} tolerance={0.002}>
                    <ChaoMesa />
                     <ParedesMesa />
                     {dadosAtivosNaMesa.map((dado) => (
                        dado.lados === 2 ? (
                           <MoedaFisica key={dado.id} id={dado.id} position={dado.posicao} onStopped={onDadoParou} />
                        ) : (
                           <DadoFisico key={dado.id} id={dado.id} lados={dado.lados} position={dado.posicao} onStopped={onDadoParou} />
                       )
                     ))}
                  </Physics>
               </Canvas>
            </div>
         )}

      <MapaFerramentas />

      <ContextoAvatar.Provider value={{ avatarSelecionado: null, setAvatarSelecionado: () => {} }}>
        {avatares.map(av => (
          <AvatarPersonagem
            key={av.idInstancia}
            nome={av.nome}
            icone={av.icone}
            porcentagemHP={av.porcentagemHP}
            tipo={av.tipo}
            posicao={av.pos}
          />
        ))}
      </ContextoAvatar.Provider>

         <div className={`${styles.iniciativa} ${anotacoesAberta ? styles.iniciativaDeslocada : ""}`}>
            <div className={styles.iniciativaTitulo}>Iniciativa</div>
            <div className={`${styles.iniciativaPersonagem} ${styles.atual}`}><div className={`${styles.iniciativaPonto} ${styles.jogador}`}></div><span className={styles.iniciativaNome}>Aldric</span><span className={styles.iniciativaNum}>18</span></div>
            <div className={styles.iniciativaPersonagem}><div className={`${styles.iniciativaPonto} ${styles.inimigo}`}></div><span className={styles.iniciativaNome}>Guarda 1</span><span className={styles.iniciativaNum}>14</span></div>
            <div className={`${styles.iniciativaPersonagem}`}><div className={`${styles.iniciativaPonto} ${styles.jogador}`}></div><span className={styles.iniciativaNome}>Sena</span><span className={styles.iniciativaNum}>11</span></div>
         </div>

         <div className={`${styles.mapaZoom} ${dadosAberta ? styles.mapaZoomDeslocado : ""}`}>
            <button className={styles.zoomBotao} onClick={() => setZoom(p => Math.min(2.5, p + 0.2))}>+</button>
            <button className={styles.zoomBotao} onClick={() => setZoom(p => Math.max(0.4, p - 0.2))}>−</button>
            <button className={styles.zoomBotao} onClick={() => { setPosicao({x:0, y:0}); setZoom(1); }}>⌖</button>
         </div>
         <div className={styles.nomeCena}>Região de Bastionland · Mapa Hexagonal</div>
         {contextoAberto && <MenuContexto x={ctxMenuX} y={ctxMenuY} />}
      </main>
   );
}