import { useState } from 'react';
import { createContext, useContext } from 'react';
import styles from './styles.Mapa.module.css';
import MapaFerramentas from '../MapaFerramentas/MapaFerramentas.jsx';
import AvatarPersonagem from '../AvatarPersonagem/AvatarPersonagem.jsx'
import MenuContexto from '../MenuContexto/MenuContexto';

export const ContextoAvatar = createContext(null);

export default function Mapa() {

   const [contextoAberto, setContextoAberto] = useState(false)
   const [avatarSelecionado, setAvatarSelecionado] = useState("Aldric")

   // Map interaction
   /* let dragging = false, dragStartX, dragStartY;

   canvas.addEventListener('mousedown', e => {
      if (e.button === 0) {
         dragging = true;
         dragStartX = e.clientX - mapOffsetX;
         dragStartY = e.clientY - mapOffsetY;
      }
   });
   document.addEventListener('mousemove', e => {
      if (dragging) {
         mapOffsetX = e.clientX - dragStartX;
         mapOffsetY = e.clientY - dragStartY;
         drawHexMap();
      } else {
         // hover
         const mapEl = document.getElementById('map');
         const rect = mapEl.getBoundingClientRect();
         const mx = (e.clientX - rect.left - mapEl.clientWidth/2 - mapOffsetX) / mapScale;
         const my = (e.clientY - rect.top - mapEl.clientHeight/2 - mapOffsetY) / mapScale;
         const w = HEX_SIZE * Math.sqrt(3);
         const cols=9,rows=9,h=HEX_SIZE*2,totalW=cols*w,totalH=rows*h*0.75;
         const adjX = mx + totalW/2, adjY = my + totalH/2;
         const hov = pixelToHex(adjX - w/2, adjY - HEX_SIZE);
         const changed = JSON.stringify(hov) !== JSON.stringify(hoveredHex);
         hoveredHex = hov;
         if (changed) drawHexMap();
      }
   });
   document.addEventListener('mouseup', e => { dragging = false; });

   canvas.addEventListener('click', e => {
      if (Math.abs(e.clientX - (dragStartX + mapOffsetX)) < 4 &&
            Math.abs(e.clientY - (dragStartY + mapOffsetY)) < 4) {
         const mapEl = document.getElementById('map');
         const rect = mapEl.getBoundingClientRect();
         const mx = (e.clientX - rect.left - mapEl.clientWidth/2 - mapOffsetX) / mapScale;
         const my = (e.clientY - rect.top - mapEl.clientHeight/2 - mapOffsetY) / mapScale;
         const cols=9,rows=9,w=HEX_SIZE*Math.sqrt(3),h=HEX_SIZE*2,totalW=cols*w,totalH=rows*h*0.75;
         const adjX = mx + totalW/2, adjY = my + totalH/2;
         const hex = pixelToHex(adjX - w/2, adjY - HEX_SIZE);
         if (hex) {
            selectedHex = hex;
            if (currentTool === 'fog') {
            const key = `${hex[0]},${hex[1]}`;
            if (revealed.has(key)) { revealed.delete(key); partialFog.add(key); }
            else if (partialFog.has(key)) { partialFog.delete(key); }
            else { revealed.add(key); }
            }
            drawHexMap();
         }
      }
   });

   function zoomMap(f) { mapScale = Math.min(Math.max(mapScale*f, 0.35), 3); drawHexMap(); }
   function resetMapView() { mapOffsetX=0; mapOffsetY=0; mapScale=1; drawHexMap(); }

   // Resize observer
   const ro = new ResizeObserver(() => drawHexMap());
   ro.observe(document.getElementById('map'));

   // Initial draw
   setTimeout(drawHexMap, 50); */

   return (
   <>
   <main className={styles.mapa} id="map" oncontextmenu={() => setContextoAberto(true)} onClick={() => setContextoAberto(false)}>
      <canvas id="mapaHexagonal" onWheel={e => {
         e.preventDefault();
         const escala = e.deltaY < 0 ? 1.1 : 0.91;
         mapScale = Math.min(Math.max(mapScale * escala, 0.35), 3); //possibilidade de substituir por Math.clamp(mapScale * escala, 0.35, 3)
         drawHexMap();
      }}></canvas>

      <MapaFerramentas />

      <ContextoAvatar value={[avatarSelecionado, setAvatarSelecionado]}>
         <AvatarPersonagem tipo="jogador" nome="Aldric" icone="⚔" porcentagemHP="67"/>
         <AvatarPersonagem tipo="jogador" nome="Sena" icone="🏹" porcentagemHP="100"/>
         <AvatarPersonagem tipo="inimigo" nome="Guarda 1" icone="💀" porcentagemHP="30"/>
         <AvatarPersonagem tipo="inimigo" nome="Guarda 2" icone="💀" porcentagemHP="80"/>
         <AvatarPersonagem tipo="npc" nome="Ancião" icone="🧙" porcentagemHP="100"/>
      </ContextoAvatar>

      {/* <!-- iniciativa --> */}
      <div className={styles.iniciativa}>
         <div className={styles.iniciativaTitulo}>Iniciativa</div>
         <div className={`${styles.iniciativaPersonagem} ${styles.atual}`}><div className={`${styles.iniciativaPonto} ${styles.jogador}`}></div><span className={styles.iniciativaNome}>Aldric</span><span className={styles.iniciativaNum}>18</span></div>
         <div className={styles.iniciativaPersonagem}><div className={`${styles.iniciativaPonto} ${styles.inimigo}`}></div><span className={styles.iniciativaNome}>Guarda 1</span><span className={styles.iniciativaNum}>14</span></div>
         <div className={styles.iniciativaPersonagem}><div className={`${styles.iniciativaPonto} ${styles.jogador}`}></div><span className={styles.iniciativaNome}>Sena</span><span className={styles.iniciativaNum}>11</span></div>
         <div className={styles.iniciativaPersonagem}><div className={`${styles.iniciativaPonto} ${styles.inimigo}`}></div><span className={styles.iniciativaNome}>Guarda 2</span><span className={styles.iniciativaNum}>7</span></div>
         <div className={styles.iniciativaPersonagem}><div className={`${styles.iniciativaPonto} ${styles.npc}`}></div><span className={styles.iniciativaNome}>Ancião</span><span className={styles.iniciativaNum}>3</span></div>
      </div>

      <div className={styles.mapaZoom}>
         <button className={styles.zoomBotao} onClick="zoomMap(1.2)">+</button>
         <button className={styles.zoomBotao} onClick="zoomMap(0.83)">−</button>
         <button className={styles.zoomBotao} onClick="resetMapView()" title="Reset">⌖</button>
      </div>
      <div className={styles.nomeCena}>Região de Bastionland · Mapa Hexagonal</div>
   </main>
   {contextoAberto && <MenuContexto setContextoAberto={setContextoAberto}/>}
   </>
  )
}