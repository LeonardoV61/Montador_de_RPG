import { useState, useEffect, useRef, useContext } from 'react';
import { createContext } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import styles from './styles.Mapa.module.css';
import MapaFerramentas from '../MapaFerramentas/MapaFerramentas.jsx';
import AvatarPersonagem from '../AvatarPersonagem/AvatarPersonagem.jsx';
import MenuContexto from '../MenuContexto/MenuContexto';
import { ContextoAbasPersonagem, ContextoMesaFisica } from '../../../pages/Jogo/Jogo.jsx';
import { ChaoMesa, ParedesMesa } from '../AbaDados/MesaFisica.jsx';
import { DadoFisico } from '../AbaDados/physics/objects/DadoFisico.jsx';
import { MoedaFisica } from '../AbaDados/physics/objects/MoedaFisica.jsx';

export const ContextoAvatar = createContext(null);

export default function Mapa() {
   const { abasAbertas } = useContext(ContextoAbasPersonagem);
   const dadosAberta = !!abasAbertas?.Dados;
   const anotacoesAberta = !!abasAbertas?.Anotacoes;

   const [contextoAberto, setContextoAberto] = useState(false);
   const [avatarSelecionado, setAvatarSelecionado] = useState("Aldric");

   const canvasRef = useRef(null);
   const canvasCtx2d = useRef(null);
   
   useEffect(() => {
      if (canvasRef.current) {
         canvasCtx2d.current = canvasRef.current.getContext('2d');
      }
   }, []);
   
   const HEX_SIZE = 54;
   const mapOffsetX = useRef(0);
   const mapOffsetY = useRef(0);
   const mapScale = useRef(1);
   const dragging = useRef(false);
   const dragStartX = useRef(0);
   const dragStartY = useRef(0);

   function drawHexMap() { if (!canvasCtx2d.current) return; }
   function canvasWheel(e) { e.preventDefault(); drawHexMap(); }
   function canvasClick(e) {}
   function canvasMouseDown(e) { if (e.button === 0) { dragging.current = true; } }
   function canvasMouseMove(e) { if (dragging.current) { drawHexMap(); } }
   function canvasMouseUp() { dragging.current = false; }

   const [ctxMenuX, setCtxMenuX] = useState(0);
   const [ctxMenuY, setCtxMenuY] = useState(0);

   function canvasCtxMenu(e) {
      e.preventDefault();
      setCtxMenuX(e.clientX > window.innerWidth / 2 ? e.clientX - 172 : e.clientX);
      setCtxMenuY(e.clientY > window.innerHeight / 2 ? e.clientY - 165 : e.clientY);
      setContextoAberto(true);
   }

   // --- CAPTURA DE RESULTADO DA MESA FÍSICA ---
   // O processamento do resultado (agregação, registro no histórico,
   // persistência via API e remoção do dado após contemplação) é
   // responsabilidade de Jogo.jsx, exposta aqui via onDadoParou.
   const { dadosAtivosNaMesa, possuiDadosInterativos, onDadoParou } = useContext(ContextoMesaFisica);

   return (
       <main className={styles.mapa} id="map" onClick={() => setContextoAberto(false)} style={{ position: 'fixed', top: 'var(--navbar-height, 42px)', left: 0, width: '100vw', height: 'calc(100vh - var(--navbar-height, 42px))', overflow: 'hidden', zIndex: 1 }}>
         <canvas 
            ref={canvasRef} 
            className={styles.mapaHexagonal} 
            onWheel={canvasWheel} onClick={canvasClick}
            onMouseDown={canvasMouseDown} onMouseMove={canvasMouseMove} onMouseUp={canvasMouseUp}
            onContextMenu={canvasCtxMenu} 
         />

         {/* CAMADA INVISÍVEL 3D - NÃO BLOQUEIA O FUNDO DO MAPA */}
    
         {/* O CANVAS DO MAPA 2D PRECISA COLAR NAS BORDAS E FICAR NO FUNDO DE TUDO (zIndex: 1) */}
         <canvas 
            ref={canvasRef} 
            className={styles.mapaHexagonal} 
           style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}
            onWheel={canvasWheel} onClick={canvasClick}
            onMouseDown={canvasMouseDown} onMouseMove={canvasMouseMove} onMouseUp={canvasMouseUp}
            onContextMenu={canvasCtxMenu} 
         />
         {/* CAMADA INVISÍVEL 3D PARA OS DADOS (zIndex: 2 - FICA LOGO ACIMA DO MAPA 2D) */}
         {dadosAtivosNaMesa.length > 0 && (
            <div style={{ 
               position: 'absolute', 
               top: 0, 
               left: 0, 
               width: '100vw', 
               height: '100vh', 
               zIndex: 2, 
               pointerEvents: possuiDadosInterativos ? 'auto' : 'none' 
            }}>
               <Canvas camera={{ position: [0, 5.5, 5.5], fov: 40 }} shadows gl={{ alpha: true }} resize={{ scroll: true, debounce: { scroll: 50, resize: 0 } }} onContextMenu={(e) => e.preventDefault()}>
                  <ambientLight intensity={0.6} />
                  <pointLight position={[8, 12, 8]} castShadow intensity={1.5} shadow-mapSize={[2048, 2048]} />
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


         <ContextoAvatar.Provider value={{avatarSelecionado, setAvatarSelecionado}}>
            <AvatarPersonagem tipo="jogador" nome="Aldric" icone="⚔" porcentagemHP="67"/>
            <AvatarPersonagem tipo="jogador" nome="Sena" icone="🏹" porcentagemHP="100"/>
            <AvatarPersonagem tipo="inimigo" nome="Guarda 1" icone="💀" porcentagemHP="30"/>
            <AvatarPersonagem tipo="inimigo" nome="Guarda 2" icone="💀" porcentagemHP="80"/>
            <AvatarPersonagem tipo="npc" nome="Ancião" icone="🧙" porcentagemHP="100"/>
         </ContextoAvatar.Provider>

         <div className={`${styles.iniciativa} ${anotacoesAberta ? styles.iniciativaDeslocada : ""}`}>
            <div className={styles.iniciativaTitulo}>Iniciativa</div>
            <div className={`${styles.iniciativaPersonagem} ${styles.atual}`}><div className={`${styles.iniciativaPonto} ${styles.jogador}`}></div><span className={styles.iniciativaNome}>Aldric</span><span className={styles.iniciativaNum}>18</span></div>
            <div className={styles.iniciativaPersonagem}><div className={`${styles.iniciativaPonto} ${styles.inimigo}`}></div><span className={styles.iniciativaNome}>Guarda 1</span><span className={styles.iniciativaNum}>14</span></div>
            <div className={`${styles.iniciativaPersonagem}`}><div className={`${styles.iniciativaPonto} ${styles.jogador}`}></div><span className={styles.iniciativaNome}>Sena</span><span className={styles.iniciativaNum}>11</span></div>
         </div>

         <div className={`${styles.mapaZoom} ${dadosAberta ? styles.mapaZoomDeslocado : ""}`}>
            <button className={styles.zoomBotao}>+</button>
            <button className={styles.zoomBotao}>−</button>
            <button className={styles.zoomBotao}>⌖</button>
         </div>
         <div className={styles.nomeCena}>Região de Bastionland · Mapa Hexagonal</div>
      </main>
   );
}