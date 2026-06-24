import { useState, useRef, useEffect, useContext, createContext } from 'react';
import styles from './styles.Mapa.module.css';
import { ContextoAbasPersonagem } from '../../../pages/Jogo/Jogo.jsx';
import MapaFerramentas from '../MapaFerramentas/MapaFerramentas.jsx';
import AvatarPersonagem from '../AvatarPersonagem/AvatarPersonagem.jsx';
import MenuContexto from '../MenuContexto/MenuContexto';

export const ContextoAvatar = createContext(null);

/**
 * Converte os atributos atuais do personagem (formato do backend) em
 * porcentagem de HP para a barra visual. No MB, HP = VIG, e o máximo
 * teórico de VIG é 19 (definido no schema). Se preferir não hardcodar,
 * podemos usar o próprio VIG como valor total da barra (sempre 100%).
 */
function calcularPorcentagemHP(attrs) {
  if (!attrs || attrs.VIG === undefined) return 100;
  const vig = Number(attrs.VIG);
  const maxVig = 19; // máximo do schemaAtributos do sistema
  return Math.round((vig / maxVig) * 100);
}

export default function Mapa({ mapaData, participantes }) {
  const [zoom, setZoom] = useState(1);
  const [posicao, setPosicao] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const areaMapaRef = useRef(null);

  const { abasAbertas } = useContext(ContextoAbasPersonagem);

  // Handlers de arrasto e zoom
  const handleMouseDown = e => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - posicao.x, y: e.clientY - posicao.y };
  };
  const handleMouseMove = e => {
    if (!isDragging) return;
    setPosicao({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
  };
  const handleMouseUp = () => setIsDragging(false);
  const handleWheel = e => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    setZoom(prev => Math.max(0.4, Math.min(2.5, prev + delta)));
  };

  useEffect(() => {
    const el = areaMapaRef.current;
    if (el) el.addEventListener('wheel', handleWheel, { passive: false });
    return () => { if (el) el.removeEventListener('wheel', handleWheel); };
  }, []);

  // Avatares a partir dos participantes reais
  const avatares = (participantes || []).map(p => ({
    idInstancia: p.idInstancia,
    nome: p.nome || '???',
    icone: p.tipo === 'jogador' ? '⚔' : '💀',
    porcentagemHP: calcularPorcentagemHP(p.atributosAtuais),
    pos: p.posicao ? { x: p.posicao.x, y: p.posicao.y } : { x: 0, y: 0 },
    tipo: p.tipo || 'npc',
  }));

  if (!mapaData) return <div className={styles.mapa}>Carregando mapa...</div>;

  const grid = mapaData.tiles || [];

  // Iniciativa (exemplo estático – substituir pelo estado da cena)
  const iniciativa = [
    { nome: 'Aldric', icone: '⚔', valor: 18, tipo: 'jogador' },
    { nome: 'Guarda 1', icone: '💀', valor: 14, tipo: 'inimigo' },
    { nome: 'Sena', icone: '🏹', valor: 11, tipo: 'jogador' },
  ];

  return (
    <main
      className={styles.mapa}
      ref={areaMapaRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Grade hexagonal */}
      <div
        className={styles.mapaGrid}
        style={{
          transform: `translate(${posicao.x}px, ${posicao.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
        }}
      >
        {grid.map((linha, r) =>
          linha.map((tile, c) => {
            if (!tile) return null;
            const posX = c * 75;
            const posY = r * 86.6 + (c % 2 === 0 ? 0 : 43.3);
            const tipo = tile.terreno || 'grass';
            return (
              <div key={`${r}-${c}`} className={styles.hexagono} style={{ left: posX, top: posY }}>
                <div className={styles.conteudoHex}>
                  <img src={`/assets/terrains/${tipo}.svg`} alt="" />
                  {tile.holding && <img src={`/assets/structures/${tile.holding}.svg`} alt="" />}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Iniciativa */}
      <div className={styles.iniciativa}>
        <div className={styles.iniciativaTitulo}>Iniciativa</div>
        {iniciativa.map((item, idx) => (
          <div key={idx} className={`${styles.iniciativaPersonagem} ${idx === 0 ? styles.atual : ''}`}>
            <div className={`${styles.iniciativaPonto} ${item.tipo === 'jogador' ? styles.jogador : styles.inimigo}`} />
            <span className={styles.iniciativaNome}>{item.icone} {item.nome}</span>
            <span className={styles.iniciativaNum}>{item.valor}</span>
          </div>
        ))}
      </div>

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

      <MenuContexto />
    </main>
  );
}