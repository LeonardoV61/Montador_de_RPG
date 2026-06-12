import React, { useState, useEffect } from 'react';
import { 
  Type, FileText, Group, Square, Layers, BookOpen, 
  MousePointer, Hand, Lasso, PenTool, Eraser, Grid, Download, Link2,
  CornerDownRight, MoveRight, Search, ChevronRight,
  LayoutGrid, Star, Clock, FolderOpen
} from 'lucide-react';
import styles from './styles.Anotacao.module.css';
 
// --- CONSTANTES E FUNÇÕES AUXILIARES MANTIDAS ---
const PRESETS_ELEMENTOS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#a855f7', '#ec4899', '#ffffff'];
const PRESETS_POSTIT   = ['#fffbbf', '#fde68a', '#bbf7d0', '#bfdbfe', '#fecaca', '#e9d5ff', '#fed7aa'];
const PRESETS_CANETA   = ['#ffffff', '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#a855f7', '#000000'];
 
const gerarCorRGBDA = (hex, alpha = 1, darkFactor = 0) => {
  if (!hex || !hex.startsWith('#')) return hex;
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  if (darkFactor > 0) {
    r = Math.max(0, Math.floor(r * (1 - darkFactor)));
    g = Math.max(0, Math.floor(g * (1 - darkFactor)));
    b = Math.max(0, Math.floor(b * (1 - darkFactor)));
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
 
// Função geométrica: Verifica se um ponto está dentro de um polígono
const pontoNoPoligono = (ponto, poligono) => {
  const x = ponto.x, y = ponto.y;
  let inside = false;
  for (let i = 0, j = poligono.length - 1; i < poligono.length; j = i++) {
    const xi = poligono[i].x, yi = poligono[i].y;
    const xj = poligono[j].x, yj = poligono[j].y;
    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
};
 
// Verifica se o bounding box do elemento intercepta ou está contido no polígono do lasso
const elementoNoLasso = (el, pontosLasso) => {
  if (pontosLasso.length < 3) return false;
  
  const cantos = [
    { x: el.x, y: el.y },
    { x: el.x + el.largura, y: el.y },
    { x: el.x, y: el.y + el.altura },
    { x: el.x + el.largura, y: el.y + el.altura }
  ];
  
  return cantos.some(canto => pontoNoPoligono(canto, pontosLasso));
};

  
 
export default function AnotacaoCanvas({ modoJogo }) {
  // --- ESTADO REINTEGRADO: GESTÃO DE CAMPANHAS ---
  const [campanhas, setCampanhas] = useState([
    { id: 1, nome: "Crônica Principal", elementos: [], linhas: [], cor: '#3b82f6', favorita: true },
    { id: 2, nome: "Arco Secundário", elementos: [], linhas: [], cor: '#a855f7', favorita: false },
    { id: 3, nome: "Notas Rápidas", elementos: [], linhas: [], cor: '#10b981', favorita: false },
  ]);
  const [campanhaAtivaId, setCampanhaAtivaId] = useState(1);
  const [buscaCampanha, setBuscaCampanha] = useState("");
 
  // Estados locais do Tabuleiro Ativo (agora sincronizados com o array de campanhas)
  const [elementos, setElementos] = useState([]);
  const [linhas, setLinhas] = useState([]);
  
  const [ferramentaAtiva, setFerramentaAtiva] = useState('select'); 
  const [elementosSelecionadosIds, setElementosSelecionadosIds] = useState([]);
  const [elementoSelecionadoId, setElementoSelecionadoId] = useState(null);
  const [editandoTextoId, setEditandoTextoId] = useState(null); 
  const [menuAberto, setMenuAberto] = useState(null); 
  const [tipoGrid, setTipoGrid] = useState('dots-light');
  
  // ... [Estados de desenho, lasso, arrastar/redimensionar permanecem iguais] ...
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [lassoPontos, setLassoPontos] = useState([]);
 
  // Estados de desenho (caneta)
  const [isDrawing, setIsDrawing] = useState(false);
  const [corCaneta, setCorCaneta] = useState('#ffffff');
  const [espessuraCaneta, setEspessuraCaneta] = useState(3);
 
  // Estados de lasso
  const [isLassoing, setIsLassoing] = useState(false);
 
  // Estados de arrastar e redimensionar
  const [arrastandoId, setArrastandoId] = useState(null);
  const [offsetElemento, setOffsetElemento] = useState({ x: 0, y: 0 });
  const [handleRedimensionamento, setHandleRedimensionamento] = useState(null);
  const [dimensoesIniciais, setDimensoesIniciais] = useState(null);
 
  // Estado de exportação
  const [exportConfig, setExportConfig] = useState({ area: 'visivel', fundo: 'escuro', resolucao: '1x' });
 
  const isSelected = elementosSelecionadosIds.length > 0;
  const elementoSelecionado = elementos.find(el => el.id === elementoSelecionadoId);
 
  // --- FUNÇÕES DE LOGICA DE CAMPANHAS REINTEGRADAS ---
  const selecionarCampanha = (id) => {
    if (id === campanhaAtivaId) return;
    setCampanhas(prev => {
      const atualizadas = prev.map(c => c.id === campanhaAtivaId ? { ...c, elementos, linhas } : c);
      const proxima = atualizadas.find(c => c.id === id);
      if (proxima) {
        setElementos(proxima.elementos || []);
        setLinhas(proxima.linhas || []);
        setCampanhaAtivaId(id);
      }
      return atualizadas;
    });
  };
 
  const toggleFavorita = (e, id) => {
    e.stopPropagation();
    setCampanhas(prev => prev.map(c => c.id === id ? { ...c, favorita: !c.favorita } : c));
  };
 
  const campanhasFiltradas = campanhas.filter(c =>
    c.nome.toLowerCase().includes(buscaCampanha.toLowerCase())
  );
  const favoritadas = campanhasFiltradas.filter(c => c.favorita);
  const outras = campanhasFiltradas.filter(c => !c.favorita);
  // OBTENÇÃO DINÂMICA DO TAMANHO DO GRID COM BASE NO ESTADO
  const obterTamanhoGrid = () => {
    if (tipoGrid === 'dots-light') return 22;
    if (tipoGrid === 'dots-small') return 11;
    return 1; // Sem grid (movimento livre por pixel)
  };
 
  // FUNÇÕES DE CALIBRAGEM MATEMÁTICA ASSET-GRID DINÂMICAS COM AJUSTE DE QUADRO (-4px)
  const snapNoGridX = (val) => {
    const tamanhoGrid = obterTamanhoGrid();
    if (tamanhoGrid === 1) return val;
    return Math.round((val - 11) / tamanhoGrid) * tamanhoGrid + 11;
  };
 
  const snapNoGridY = (val, tipoElemento = '') => {
    const tamanhoGrid = obterTamanhoGrid();
    if (tamanhoGrid === 1) return val;
    
    // Se for quadro, puxa levemente 4px para cima para a barra de título encaixar perfeitamente na linha horizontal superior
    const offsetExtra = tipoElemento === 'quadro' ? -4 : 0;
    return Math.round((val - 11 - offsetExtra) / tamanhoGrid) * tamanhoGrid + 11 + offsetExtra;
  };
 
  const snapDimensao = (dim) => {
    const tamanhoGrid = obterTamanhoGrid();
    if (tamanhoGrid === 1) return dim;
    return Math.round(dim / tamanhoGrid) * tamanhoGrid;
  };
 
  // Atalho teclado para Deletar elementos múltiplos
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (elementosSelecionadosIds.length === 0) return;
      const tagAtiva = document.activeElement ? document.activeElement.tagName : '';
      const estaDigitando = tagAtiva === 'TEXTAREA' || tagAtiva === 'INPUT';
 
      if (!estaDigitando && (e.key === 'Delete' || e.key === 'Backspace')) {
        setElementos(prev => prev.filter(el => !elementosSelecionadosIds.includes(el.id)));
        setElementosSelecionadosIds([]);
        setElementoSelecionadoId(null);
        setEditandoTextoId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [elementosSelecionadosIds]);
 
  const adicionarElemento = (tipo, propsCustomizadas = {}) => {
    const novo = {
      id: Date.now(),
      tipo,
      x: snapNoGridX(110),
      y: snapNoGridY(110, tipo),
      largura: tipo === 'quadro' ? 352 : (tipo === 'post-it' ? 176 : 110),
      altura: tipo === 'quadro' ? 198 : (tipo === 'post-it' ? 110 : 110),
      conteudo: tipo === 'post-it' ? 'Nota...' : tipo === 'texto' ? 'Texto Livre' : '',
      titulo: tipo === 'quadro' ? 'Novo Agrupamento' : undefined,
      cor: tipo === 'post-it' ? '#fffbbf' : '#3b82f6',
      subTipo: tipo === 'forma' ? 'rect' : undefined,
      ...propsCustomizadas
    };
    setElementos([...elementos, novo]);
    setElementosSelecionadosIds([novo.id]);
    setElementoSelecionadoId(novo.id);
  };
 
  const atualizarPropriedadeElemento = (id, propriedades) => {
    setElementos(prev => prev.map(el => el.id === id ? { ...el, ...propriedades } : el));
  };
 
  const handleCanvasMouseDown = (e) => {
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('select')) return;
 
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left - pan.x);
    const y = Math.round(e.clientY - rect.top - pan.y);
 
    if (ferramentaAtiva === 'pen') {
      setIsDrawing(true);
      setLinhas([...linhas, { id: Date.now(), pontos: [{ x, y }], cor: corCaneta, espessura: espessuraCaneta }]);
      return;
    }
 
    if (ferramentaAtiva === 'lasso') {
      setIsLassoing(true);
      setLassoPontos([{ x, y }]);
      return;
    }
 
    if (ferramentaAtiva === 'hand') {
      setIsPanning(true);
      setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      return;
    }
 
    if (ferramentaAtiva === 'select') {
      const clicouNumElemento = e.target.closest('[data-element-id]');
      if (!clicouNumElemento) {
        setElementosSelecionadosIds([]);
        setElementoSelecionadoId(null);
      } else if (elementosSelecionadosIds.length > 0) {
        const primeiroId = elementosSelecionadosIds[0];
        setArrastandoId(primeiroId);
        const elFoco = elementos.find(el => el.id === primeiroId);
        if (elFoco) {
          setOffsetElemento({
            x: (e.clientX - pan.x) - elFoco.x,
            y: (e.clientY - pan.y) - elFoco.y
          });
        }
      }
    }
  };
 
  const handleResizeMouseDown = (e, elId, handleType) => {
    e.stopPropagation(); e.preventDefault();
    const el = elementos.find(item => item.id === elId);
    if (!el) return;
    setHandleRedimensionamento(handleType);
    setDimensoesIniciais({
      x: el.x, y: el.y, largura: el.largura, altura: el.altura, mouseX: e.clientX, mouseY: e.clientY
    });
  };
 
  const handleElementMouseDown = (e, id) => {
    if (ferramentaAtiva === 'hand' || ferramentaAtiva === 'pen' || ferramentaAtiva === 'lasso') return;
    e.stopPropagation();
 
    if (editandoTextoId === id) return;
 
    if (ferramentaAtiva === 'eraser') {
      setElementos(elementos.filter(el => el.id !== id));
      if (elementosSelecionadosIds.includes(id)) {
        setElementosSelecionadosIds(elementosSelecionadosIds.filter(selId => selId !== id));
        if (elementoSelecionadoId === id) setElementoSelecionadoId(null);
      }
      return;
    }
 
    if (e.shiftKey) {
      if (elementosSelecionadosIds.includes(id)) {
        const filtrados = elementosSelecionadosIds.filter(selId => selId !== id);
        setElementosSelecionadosIds(filtrados);
        setElementoSelecionadoId(filtrados[0] || null);
      } else {
        setElementosSelecionadosIds([...elementosSelecionadosIds, id]);
        setElementoSelecionadoId(id);
      }
    } else {
      if (!elementosSelecionadosIds.includes(id)) {
        setElementosSelecionadosIds([id]);
        setElementoSelecionadoId(id);
      }
    }
 
    if (ferramentaAtiva === 'select') {
      setArrastandoId(id);
      const elementoClicado = elementos.find(el => el.id === id);
      if (elementoClicado) {
        setOffsetElemento({
          x: (e.clientX - pan.x) - elementoClicado.x,
          y: (e.clientY - pan.y) - elementoClicado.y
        });
      }
    }
  };
 
  const handleCanvasMouseMove = (e) => {
    if (isDrawing && ferramentaAtiva === 'pen') {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = Math.round(e.clientX - rect.left - pan.x);
      const y = Math.round(e.clientY - rect.top - pan.y);
      setLinhas(prev => {
        if (!prev.length) return prev;
        const copia = [...prev];
        const atual = { ...copia[copia.length - 1] };
        atual.pontos = [...atual.pontos, { x, y }];
        copia[copia.length - 1] = atual;
        return copia;
      });
      return;
    }
 
    if (isLassoing && ferramentaAtiva === 'lasso') {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = Math.round(e.clientX - rect.left - pan.x);
      const y = Math.round(e.clientY - rect.top - pan.y);
      setLassoPontos(prev => [...prev, { x, y }]);
      return;
    }
 
    if (isPanning) {
      setPan({ x: e.clientX - startPan.x, y: e.clientY - startPan.y });
      return;
    }
 
    if (handleRedimensionamento && dimensoesIniciais) {
      const dx = e.clientX - dimensoesIniciais.mouseX;
      const dy = e.clientY - dimensoesIniciais.mouseY;
 
      setElementos(prevElementos => prevElementos.map(el => {
        if (el.id === elementoSelecionadoId) {
          let vLargura = dimensoesIniciais.largura;
          let vAltura = dimensoesIniciais.altura;
          let vX = dimensoesIniciais.x;
          let vY = dimensoesIniciais.y;
 
          if (handleRedimensionamento.includes('R')) vLargura = dimensoesIniciais.largura + dx;
          if (handleRedimensionamento.includes('L')) {
            vLargura = dimensoesIniciais.largura - dx;
            vX = dimensoesIniciais.x + dx;
          }
          if (handleRedimensionamento.includes('B')) vAltura = dimensoesIniciais.altura + dy;
          if (handleRedimensionamento.includes('T')) {
            vAltura = dimensoesIniciais.altura - dy;
            vY = dimensoesIniciais.y + dy;
          }
 
          let snapLargura = snapDimensao(vLargura);
          let snapAltura = snapDimensao(vAltura);
          let snapX = snapNoGridX(vX);
          let snapY = snapNoGridY(vY, el.tipo);
 
          const tamanhoMin = obterTamanhoGrid() === 1 ? 5 : obterTamanhoGrid();
          if (snapLargura < tamanhoMin) snapLargura = tamanhoMin;
          if (snapAltura < tamanhoMin) snapAltura = tamanhoMin;
 
          return { ...el, x: snapX, y: snapY, largura: snapLargura, altura: snapAltura };
        }
        return el;
      }));
      return;
    }
 
    if (arrastandoId !== null && ferramentaAtiva === 'select') {
      const elementoFoco = elementos.find(el => el.id === arrastandoId);
      
      if (elementoFoco) {
        const mouseLocalX = e.clientX - pan.x;
        const mouseLocalY = e.clientY - pan.y;
 
        const posXDesejada = mouseLocalX - offsetElemento.x;
        const posYDesejada = mouseLocalY - offsetElemento.y;
 
        const virtualX = elementoFoco._virtualX !== undefined ? elementoFoco._virtualX + (posXDesejada - elementoFoco.x) : posXDesejada;
        const virtualY = elementoFoco._virtualY !== undefined ? elementoFoco._virtualY + (posYDesejada - elementoFoco.y) : posYDesejada;
 
        const xSnap = snapNoGridX(virtualX);
        const ySnap = snapNoGridY(virtualY, elementoFoco.tipo);
 
        const deltaSnapX = xSnap - elementoFoco.x;
        const deltaSnapY = ySnap - elementoFoco.y;
 
        if (deltaSnapX !== 0 || deltaSnapY !== 0) {
          setElementos(prev => prev.map(el => {
            if (elementosSelecionadosIds.includes(el.id)) {
              if (el.id === arrastandoId) {
                return { 
                  ...el, 
                  x: el.x + deltaSnapX, 
                  y: el.y + deltaSnapY,
                  _virtualX: virtualX,
                  _virtualY: virtualY
                };
              }
              return { ...el, x: el.x + deltaSnapX, y: el.y + deltaSnapY };
            }
            return el;
          }));
        }
      }
      return;
    }
  };
 
  const handleCanvasMouseUp = () => {
    if (isLassoing && ferramentaAtiva === 'lasso') {
      const localizados = elementos.filter(el => elementoNoLasso(el, lassoPontos));
      if (localizados.length > 0) {
        setElementosSelecionadosIds(localizados.map(el => el.id));
        setElementoSelecionadoId(localizados[0].id);
      } else {
        setElementosSelecionadosIds([]);
        setElementoSelecionadoId(null);
      }
      setLassoPontos([]);
      setIsLassoing(false);
    }
 
    setElementos(prev => prev.map(el => {
      let limpo = { ...el };
      if (limpo._virtualX !== undefined || limpo._virtualY !== undefined) {
        delete limpo._virtualX;
        delete limpo._virtualY;
      }
      
      limpo.x = snapNoGridX(limpo.x);
      limpo.y = snapNoGridY(limpo.y, limpo.tipo);
      limpo.largura = snapDimensao(limpo.largura);
      limpo.altura = snapDimensao(limpo.altura);
      
      return limpo;
    }));
 
    setArrastandoId(null); 
    setIsPanning(false); 
    setIsDrawing(false);
    setHandleRedimensionamento(null); 
    setDimensoesIniciais(null);
  };
 
  const obterStrokeDasharray = (estilo) => {
    if (estilo === 'tracejado') return '8,6';
    if (estilo === 'pontilhado') return '2,4';
    return 'none';
  };

  // Correção se o seu CSS usar hífens:
  const classeContainer = modoJogo 
    ? `${styles.canvasContainer} ${styles.canvasModoJogo}` 
    : styles.canvasContainer;
 
  return (
    <div className={classeContainer}>
      {!modoJogo && (
        <aside className={styles.sidebar}>
          {/* LOGO / HEADER */}
          <div className={styles.sidebarHeader}>
            <div className={styles.sidebarLogo}>
              <div className={styles.sidebarLogoIcon}>
                <LayoutGrid size={14} />
              </div>
              <span className={styles.sidebarLogoText}>Canvas</span>
            </div>
          </div>
  
          {/* BARRA DE PESQUISA */}
          <div className={styles.sidebarSearchWrapper}>
            <Search size={13} className={styles.sidebarSearchIcon} />
            <input
              type="text"
              className={styles.sidebarSearchInput}
              placeholder="Buscar campanha..."
              value={buscaCampanha}
              onChange={(e) => setBuscaCampanha(e.target.value)}
            />
            {buscaCampanha && (
              <button className={styles.sidebarSearchClear} onClick={() => setBuscaCampanha("")}>×</button>
            )}
          </div>
  
  
          {/* LISTA DE CAMPANHAS */}
          <div className={styles.sidebarList}>
            {/* FAVORITAS */}
            {favoritadas.length > 0 && (
              <div className={styles.sidebarSection}>
                <div className={styles.sidebarSectionLabel}>
                  <Star size={10} /> Favoritas
                </div>
                {favoritadas.map(c => (
                  <div
                    key={c.id}
                    onClick={() => selecionarCampanha(c.id)}
                    className={`${styles.sidebarItem} ${c.id === campanhaAtivaId ? styles.sidebarItemActive : ''}`}
                  >
                    <span className={styles.sidebarItemDot} style={{ backgroundColor: c.cor }} />
                    <span className={styles.sidebarItemName}>{c.nome}</span>
                    <div className={styles.sidebarItemActions}>
                      <button className={styles.sidebarItemBtn} onClick={(e) => toggleFavorita(e, c.id)} title="Desfavoritar">
                        <Star size={11} fill={c.favorita ? c.cor : 'none'} stroke={c.cor} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
  
            {/* TODAS / OUTRAS */}
            <div className={styles.sidebarSection}>
              {favoritadas.length > 0 && (
                <div className={styles.sidebarSectionLabel}>
                  <Clock size={10} /> Recentes
                </div>
              )}
              {outras.length === 0 && favoritadas.length === 0 && (
                <div className={styles.sidebarEmpty}>
                  <FolderOpen size={28} />
                  <span>Nenhuma campanha encontrada</span>
                </div>
              )}
              {outras.map(c => (
                <div
                  key={c.id}
                  onClick={() => selecionarCampanha(c.id)}
                  className={`${styles.sidebarItem} ${c.id === campanhaAtivaId ? styles.sidebarItemActive : ''}`}
                >
                  <span className={styles.sidebarItemDot} style={{ backgroundColor: c.cor }} />
                  <span className={styles.sidebarItemName}>{c.nome}</span>
                  <div className={styles.sidebarItemActions}>
                    <button className={styles.sidebarItemBtn} onClick={(e) => toggleFavorita(e, c.id)} title="Favoritar">
                      <Star size={11} fill="none" stroke={c.cor} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
  
          {/* RODAPÉ DA SIDEBAR */}
          <div className={styles.sidebarFooter}>
            <div className={styles.sidebarFooterInfo}>
              <span className={styles.sidebarFooterCount}>{campanhas.length} campanha{campanhas.length !== 1 ? 's' : ''}</span>
              <ChevronRight size={12} style={{ color: '#334155' }} />
            </div>
          </div>
        </aside>
      )}



      <div 
        id="canvas-container"
        className={`${styles.canvasContainer} ${
          ferramentaAtiva === 'hand' ? (isPanning ? styles.cursorPanning : styles.cursorHand) : 
          ferramentaAtiva === 'eraser' ? styles.cursorEraser : 
          ferramentaAtiva === 'pen' ? styles.cursorPen : styles.cursorSelect
        }`}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
      >
        {tipoGrid !== 'none' && (
          <div 
            id="canvas-grid" 
            className={tipoGrid === 'dots-small' ? styles.canvasGridSmall : styles.canvasDotGrid} 
            style={{ backgroundPosition: `${pan.x}px ${pan.y}px` }}
          />
        )}
        
        {/* SIDEBAR LATERAL DE FERRAMENTAS RESTAURADA */}
        <div className={styles.toolbarSidebar} onMouseDown={(e) => e.stopPropagation()}>
          <button onClick={() => { adicionarElemento('texto'); setMenuAberto(null); }} className={styles.sidebarButton}>
            <Type size={18} />
          </button>
 
          <div className={styles.sidebarButtonContainer}>
            <button 
              onClick={() => setMenuAberto(menuAberto === 'postit' ? null : 'postit')} 
              className={`${styles.sidebarButton} ${menuAberto === 'postit' ? styles.sidebarButtonActive : ''}`}
            >
              <FileText size={18} />
            </button>
 
            {menuAberto === 'postit' && (
              <div className={styles.shapesPopover}>
                <h4 className={styles.menuSectionHeader}>Cor do Post-it</h4>
                <div className={styles.gridPaleta}>
                  {PRESETS_POSTIT.map((cor) => (
                    <button key={cor} onClick={() => adicionarElemento('post-it', { cor })} className={styles.colorCircleButton} style={{ backgroundColor: cor }} />
                  ))}
                  <label className={styles.colorCircleButton} style={{ background: 'linear-gradient(to right, red, orange, yellow, green, blue, violet)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }} title="Custom RGBDA">
                    🌈
                    <input type="color" defaultValue="#fffbbf" onChange={(e) => adicionarElemento('post-it', { cor: e.target.value })} style={{ opacity: 0, position: 'absolute', width: '20px', height: '20px', cursor: 'pointer' }} />
                  </label>
                </div>
              </div>
            )}
          </div>
 
          <div className={styles.sidebarButtonContainer}>
            <button 
              onClick={() => setMenuAberto(menuAberto === 'quadro' ? null : 'quadro')} 
              className={`${styles.sidebarButton} ${menuAberto === 'quadro' ? styles.sidebarButtonActive : ''}`}
            >
              <Group size={18} />
            </button>
 
            {menuAberto === 'quadro' && (
              <div className={styles.shapesPopover}>
                <h4 className={styles.menuSectionHeader}>Agrupamentos</h4>
                <div className={styles.gridPaleta}>
                  {PRESETS_ELEMENTOS.map((cor) => (
                    <button key={cor} onClick={() => adicionarElemento('quadro', { cor })} className={styles.colorCircleButton} style={{ backgroundColor: cor }} />
                  ))}
                  <label className={styles.colorCircleButton} style={{ background: 'linear-gradient(to right, red, orange, yellow, green, blue, violet)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Custom RGBDA">
                    🎨
                    <input type="color" defaultValue="#3b82f6" onChange={(e) => adicionarElemento('quadro', { cor: e.target.value })} style={{ opacity: 0, position: 'absolute', width: '20px', height: '20px', cursor: 'pointer' }} />
                  </label>
                </div>
              </div>
            )}
          </div>
 
          <div className={styles.sidebarButtonContainer}>
            <button 
              onClick={() => setMenuAberto(menuAberto === 'formas' ? null : 'formas')}
              className={`${styles.sidebarButton} ${menuAberto === 'formas' ? styles.sidebarButtonActive : ''}`}
            >
              <Square size={18} />
            </button>
 
            {menuAberto === 'formas' && (
              <div className={styles.shapesPopover}>
                <h4 className={styles.menuSectionHeader}>Formas Básicas</h4>
                <div className={styles.shapeGrid}>
                  <button onClick={() => adicionarElemento('forma', { subTipo: 'rect' })} className={styles.shapeGridButton}><div className={styles.menuShapeIcon} /></button>
                  <button onClick={() => adicionarElemento('forma', { subTipo: 'rounded-full' })} className={styles.shapeGridButton}><div className={styles.menuShapeIcon} style={{ borderRadius: '50%' }} /></button>
                  <button onClick={() => adicionarElemento('forma', { subTipo: 'ellipse' })} className={styles.shapeGridButton}><div className={styles.menuShapeIcon} style={{ borderRadius: '50%', width: '22px', height: '12px' }} /></button>
                  <button onClick={() => adicionarElemento('forma', { subTipo: 'diamond' })} className={styles.shapeGridButton}><div className={`${styles.menuShapeIcon} ${styles.shapeDiamond}`} /></button>
                  <button onClick={() => adicionarElemento('forma', { subTipo: 'triangle' })} className={styles.shapeGridButton}><div className={`${styles.menuShapeIcon} ${styles.shapeTriangle}`} /></button>
                  <button onClick={() => adicionarElemento('forma', { subTipo: 'star' })} className={styles.shapeGridButton}><div className={`${styles.menuShapeIcon} ${styles.shapeStar}`} style={{ border: 'none', background: '#3b82f6', clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }} /></button>
                  <button onClick={() => adicionarElemento('forma', { subTipo: 'hexagon' })} className={styles.shapeGridButton}><div className={`${styles.menuShapeIcon} ${styles.shapeHexagon}`} /></button>
                  <button onClick={() => adicionarElemento('forma', { subTipo: 'pentagon' })} className={styles.shapeGridButton}><div className={`${styles.menuShapeIcon} ${styles.shapePentagon}`} /></button>
                </div>
 
                <h4 className={styles.menuSectionHeader} style={{ marginTop: '10px' }}>Setas e Conectores</h4>
                <div className={styles.shapeGrid}>
                  <button onClick={() => adicionarElemento('forma', { subTipo: 'arrow-right' })} className={styles.shapeGridButton} title="Seta Direta"><MoveRight size={18} style={{ color: '#3b82f6' }} /></button>
                  <button onClick={() => adicionarElemento('forma', { subTipo: 'elbow-arrow', elbowDirecao: 'RD', elbowPonta: 'seta' })} className={styles.shapeGridButton} title="Seta Conectora Cotovelo"><CornerDownRight size={18} style={{ color: '#3b82f6' }} /></button>
                </div>
              </div>
            )}
          </div>
 
          <div className={styles.sidebarButtonContainer}>
            <button 
              onClick={() => setMenuAberto(menuAberto === 'midia' ? null : 'midia')} 
              className={`${styles.sidebarButton} ${menuAberto === 'midia' ? styles.sidebarButtonActive : ''}`}
            >
              <Layers size={18} />
            </button>
 
            {menuAberto === 'midia' && (
              <div className={styles.shapesPopover} style={{ width: '200px', padding: '12px' }}>
                <h4 className={styles.menuSectionHeader}>Mídia externa</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <button onClick={() => adicionarElemento('embed')} className={styles.shapeGridButton} style={{ width: '100%', justifyContent: 'flex-start', padding: '8px', gap: '8px' }}>
                    <Link2 size={16} style={{ color: '#3b82f6' }} />
                    <span style={{ fontSize: '11px', fontWeight: '500' }}>Site / Embed</span>
                  </button>
                  <button onClick={() => adicionarElemento('bookmark')} className={styles.shapeGridButton} style={{ width: '100%', justifyContent: 'flex-start', padding: '8px', gap: '8px' }}>
                    <FileText size={16} style={{ color: '#10b981' }} />
                    <span style={{ fontSize: '11px', fontWeight: '500' }}>Bookmark</span>
                  </button>
                </div>
              </div>
            )}
          </div>
 
          <div className={styles.sidebarButtonContainer}>
            <button 
              onClick={() => setMenuAberto(menuAberto === 'recursos' ? null : 'recursos')}
              className={`${styles.sidebarButton} ${menuAberto === 'recursos' ? styles.sidebarButtonActive : ''}`}
            >
              <BookOpen size={18} />
            </button>
            {menuAberto === 'recursos' && (
              <div className={styles.shapesPopover} style={{ width: '180px' }}>
                <h4 className={styles.menuSectionHeader}>Módulos do Sistema</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <button className={styles.shapeGridButton} style={{ padding: '6px 10px', fontSize: '11px', width: '100%' }}>📖 Abrir Biblioteca</button>
                </div>
              </div>
            )}
          </div>
 
          <div className={styles.sidebarDivider} />
 
          <button onClick={() => { setFerramentaAtiva('select'); setMenuAberto(null); }} className={`${styles.sidebarButton} ${ferramentaAtiva === 'select' ? styles.sidebarButtonActive : ''}`}><MousePointer size={18} /></button>
          <button onClick={() => { setFerramentaAtiva('hand'); setElementosSelecionadosIds([]); setElementoSelecionadoId(null); setEditandoTextoId(null); setMenuAberto(null); }} className={`${styles.sidebarButton} ${ferramentaAtiva === 'hand' ? styles.sidebarButtonActive : ''}`}><Hand size={18} /></button>
          <button onClick={() => { setFerramentaAtiva('lasso'); setMenuAberto(null); }} className={`${styles.sidebarButton} ${ferramentaAtiva === 'lasso' ? styles.sidebarButtonActive : ''}`}><Lasso size={18} /></button>
          
          <div className={styles.sidebarButtonContainer}>
            <button 
              onClick={() => { setFerramentaAtiva('pen'); setMenuAberto(menuAberto === 'caneta' ? null : 'caneta'); }} 
              className={`${styles.sidebarButton} ${ferramentaAtiva === 'pen' ? styles.sidebarButtonActive : ''}`}
            >
              <PenTool size={18} />
            </button>
 
            {menuAberto === 'caneta' && (
              <div className={styles.shapesPopover}>
                <h4 className={styles.menuSectionHeader}>Cor da Caneta</h4>
                <div className={styles.gridPaleta}>
                  {PRESETS_CANETA.map((cor) => (
                    <button key={cor} onClick={() => { setCorCaneta(cor); }} className={`${styles.colorCircleButton} ${corCaneta === cor ? styles.elementSelected : ''}`} style={{ backgroundColor: cor }} />
                  ))}
                  <label className={styles.colorCircleButton} style={{ background: 'linear-gradient(to right, red, orange, yellow, green, blue, violet)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Custom RGBDA">
                    🎨
                    <input type="color" value={corCaneta} onChange={(e) => setCorCaneta(e.target.value)} style={{ opacity: 0, position: 'absolute', width: '20px', height: '20px', cursor: 'pointer' }} />
                  </label>
                </div>
              </div>
            )}
          </div>
 
          <button onClick={() => { setFerramentaAtiva('eraser'); setElementosSelecionadosIds([]); setElementoSelecionadoId(null); setMenuAberto(null); }} className={`${styles.sidebarButton} ${ferramentaAtiva === 'eraser' ? styles.sidebarButtonActive : ''}`}><Eraser size={18} /></button>
 
          <div className={styles.sidebarDivider} />
 
          <button onClick={() => setMenuAberto(menuAberto === 'exportar' ? null : 'exportar')} className={`${styles.sidebarButton} ${menuAberto === 'exportar' ? styles.sidebarButtonActive : ''}`}><Download size={18} /></button>
 
          <div className={styles.sidebarButtonContainer}>
            <button onClick={() => setMenuAberto(menuAberto === 'grid' ? null : 'grid')} className={`${styles.sidebarButton} ${menuAberto === 'grid' ? styles.sidebarButtonActive : ''}`}><Grid size={18} /></button>
            {menuAberto === 'grid' && (
              <div className={styles.shapesPopover} style={{ width: '150px' }}>
                <h4 className={styles.menuSectionHeader}>Variações do Fundo</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <button onClick={() => { setTipoGrid('dots-light'); setMenuAberto(null); }} className={`${styles.shapeGridButton} ${tipoGrid === 'dots-light' ? styles.sidebarButtonActive : ''}`} style={{ fontSize: '11px', padding: '6px', width: '100%' }}>Padrão (22px)</button>
                  <button onClick={() => { setTipoGrid('dots-small'); setMenuAberto(null); }} className={`${styles.shapeGridButton} ${tipoGrid === 'dots-small' ? styles.sidebarButtonActive : ''}`} style={{ fontSize: '11px', padding: '6px', width: '100%' }}>Pequeno (11px)</button>
                  <button onClick={() => { setTipoGrid('none'); setMenuAberto(null); }} className={`${styles.shapeGridButton} ${tipoGrid === 'none' ? styles.sidebarButtonActive : ''}`} style={{ fontSize: '11px', padding: '6px', width: '100%' }}>Sem Grid (Livre)</button>
                </div>
              </div>
            )}
          </div>
        </div>
 
        {/* POPOVER DE EXPORTAR RESTAURADO */}
        {menuAberto === 'exportar' && (
          <div className={styles.modalExportar} onMouseDown={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Exportar quadro</h3>
              <button className={styles.sidebarButton} style={{ width: '24px', height: '24px' }} onClick={() => setMenuAberto(null)}>×</button>
            </div>
            <div className={styles.modalSection}>
              <div className={styles.modalSectionTitle}>Área</div>
              <div className={styles.modalOptionGroup}>
                <button className={`${styles.modalOptionButton} ${exportConfig.area === 'visivel' ? styles.modalOptionButtonActive : ''}`} onClick={() => setExportConfig({...exportConfig, area: 'visivel'})}>Área visível</button>
                <button className={`${styles.modalOptionButton} ${exportConfig.area === 'inteiro' ? styles.modalOptionButtonActive : ''}`} onClick={() => setExportConfig({...exportConfig, area: 'inteiro'})}>Canvas inteiro</button>
              </div>
            </div>
            <div className={styles.modalSection}>
              <div className={styles.modalSectionTitle}>Fundo</div>
              <div className={styles.modalOptionGroup}>
                <button className={`${styles.modalOptionButton} ${exportConfig.fundo === 'escuro' ? styles.modalOptionButtonActive : ''}`} onClick={() => setExportConfig({...exportConfig, fundo: 'escuro'})}>Escuro</button>
                <button className={`${styles.modalOptionButton} ${exportConfig.fundo === 'branco' ? styles.modalOptionButtonActive : ''}`} onClick={() => setExportConfig({...exportConfig, fundo: 'branco'})}>Branco</button>
              </div>
            </div>
            <button className={styles.btnPrimaryExport}>Exportar PNG {exportConfig.resolucao}</button>
          </div>
        )}
 
        {/* TABULEIRO EXPANDIDO */}
        <div id="canvas-board" className={styles.canvasBoard} style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }}>
          
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: (ferramentaAtiva === 'eraser' || ferramentaAtiva === 'lasso') ? 'auto' : 'none', zIndex: 35 }}>
            {linhas.map((linha) => (
              <path
                key={linha.id}
                d={linha.pontos.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')}
                fill="none" stroke={linha.cor} strokeWidth={linha.espessura} strokeLinecap="round" strokeLinejoin="round"
                onMouseDown={(e) => {
                  if (ferramentaAtiva === 'eraser') { e.stopPropagation(); setLinhas(prev => prev.filter(l => l.id !== linha.id)); }
                }}
              />
            ))}
 
            {lassoPontos.length > 1 && (
              <polygon
                points={lassoPontos.map(p => `${p.x},${p.y}`).join(' ')}
                fill="rgba(59, 130, 246, 0.08)"
                stroke="#3b82f6"
                strokeWidth="1.5"
                strokeDasharray="4,4"
              />
            )}
          </svg>
 
          {/* RENDERS DOS ELEMENTOS DO CANVAS */}
          {elementos.map((el) => {
            const elSelected = elementosSelecionadosIds.includes(el.id);
            const isEditingText = editandoTextoId === el.id;
            const zIndexDinamico = el.tipo === 'quadro' ? (elSelected ? 15 : 10) : (elSelected ? 90 : 20);
 
            return (
 
              <div
                key={el.id}
                data-element-id={el.id}
                onMouseDown={(e) => handleElementMouseDown(e, el.id)}
                onDoubleClick={(e) => { e.stopPropagation(); setElementosSelecionadosIds([el.id]); setElementoSelecionadoId(el.id); setEditandoTextoId(el.id); }}
                style={{ top: el.y, left: el.x, width: el.largura, height: el.altura, zIndex: zIndexDinamico, pointerEvents: (ferramentaAtiva === 'hand' || ferramentaAtiva === 'lasso') ? 'none' : 'auto' }}
                className={`${styles.canvasElement} ${elSelected ? styles.elementSelected : ''}`}
              >
                
                {elSelected && elementosSelecionadosIds.length === 1 && (
                  <>
                    <div className={`${styles.handleDot} ${styles.handleTL}`} onMouseDown={(e) => handleResizeMouseDown(e, el.id, 'TL')} />
                    <div className={`${styles.handleDot} ${styles.handleTC}`} onMouseDown={(e) => handleResizeMouseDown(e, el.id, 'T')} />
                    <div className={`${styles.handleDot} ${styles.handleTR}`} onMouseDown={(e) => handleResizeMouseDown(e, el.id, 'TR')} />
                    <div className={`${styles.handleDot} ${styles.handleMR}`} onMouseDown={(e) => handleResizeMouseDown(e, el.id, 'R')} />
                    <div className={`${styles.handleDot} ${styles.handleBR}`} onMouseDown={(e) => handleResizeMouseDown(e, el.id, 'BR')} />
                    <div className={`${styles.handleDot} ${styles.handleBC}`} onMouseDown={(e) => handleResizeMouseDown(e, el.id, 'B')} />
                    <div className={`${styles.handleDot} ${styles.handleBL}`} onMouseDown={(e) => handleResizeMouseDown(e, el.id, 'BL')} />
                    <div className={`${styles.handleDot} ${styles.handleML}`} onMouseDown={(e) => handleResizeMouseDown(e, el.id, 'L')} />
                  </>
                )}
 
                {el.tipo === 'texto' && (
                  <div className={styles.textoContainer}>
                    <textarea 
                      className={styles.textoAreaInput} value={el.conteudo}
                      onChange={(e) => atualizarPropriedadeElemento(el.id, { conteudo: e.target.value })}
                      readOnly={!isEditingText} style={{ pointerEvents: isEditingText ? 'auto' : 'none' }}
                      onBlur={() => setEditandoTextoId(null)} placeholder="Digite seu texto..."
                    />
                  </div>
                )}
 
                {el.tipo === 'post-it' && (
                  <div className={styles.postItCard} style={{ backgroundColor: gerarCorRGBDA(el.cor, 1, 0) }}>
                    <textarea
                      value={el.conteudo} onChange={(e) => atualizarPropriedadeElemento(el.id, { conteudo: e.target.value })}
                      className={styles.postItTextarea} readOnly={!isEditingText}
                      style={{ pointerEvents: isEditingText ? 'auto' : 'none' }} onBlur={() => setEditandoTextoId(null)}
                    />
                  </div>
                )}
 
                {el.tipo === 'quadro' && (
                  <div className={styles.quadroWrapper}>
                    <div 
                      className={styles.quadroTitle} 
                      style={{ 
                        backgroundColor: gerarCorRGBDA(el.cor, 0.15, 0),
                        borderColor: gerarCorRGBDA(el.cor, 1, 0)
                      }} 
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      {isEditingText ? (
                        <input 
                          type="text" className={styles.quadroTitleInput} value={el.titulo || ''}
                          onChange={(e) => atualizarPropriedadeElemento(el.id, { titulo: e.target.value })}
                          onBlur={() => setEditandoTextoId(null)} onKeyDown={(e) => { if (e.key === 'Enter') setEditandoTextoId(null); }}
                          autoFocus
                        />
                      ) : (
                        <span onDoubleClick={(e) => { e.stopPropagation(); setElementosSelecionadosIds([el.id]); setElementoSelecionadoId(el.id); setEditandoTextoId(el.id); }}>{el.titulo}</span>
                      )}
                    </div>
 
                    <div 
                      className={styles.quadroCard} 
                      style={{ 
                        borderColor: gerarCorRGBDA(el.cor, 1, 0), 
                        backgroundColor: gerarCorRGBDA(el.cor, 0.15, 0)
                      }}
                    />
                  </div>
                )}
 
                {el.tipo === 'embed' && (
                  <div className={styles.embedCard}>
                    <Link2 size={18} style={{ color: '#3b82f6' }} />
                    <span style={{ fontSize: '11px', color: '#e4e4e7' }}>Site / Embed Externo</span>
                  </div>
                )}
 
                {el.tipo === 'bookmark' && (
                  <div className={styles.embedCard}>
                    <FileText size={18} style={{ color: '#10b981' }} />
                    <span style={{ fontSize: '11px', color: '#e4e4e7' }}>Bookmark</span>
                  </div>
                )}
 
                {el.tipo === 'forma' && (
                  <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ display: 'block' }}>
                    <defs>
                      <marker id={`arrow-head-${el.id}`} viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                        <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill={gerarCorRGBDA(el.cor, 1, 0)} />
                      </marker>
                    </defs>
 
                    {(el.subTipo === 'rect' || !el.subTipo) && (
                      <rect x="4" y="4" width="92" height="92" rx="4" fill="rgba(30, 41, 59, 0.15)" stroke={gerarCorRGBDA(el.cor, 1, 0)} strokeWidth="2.5" />
                    )}
                    {el.subTipo === 'rounded-full' && (
                      <circle cx="50" cy="50" r="45" fill="rgba(30, 41, 59, 0.15)" stroke={gerarCorRGBDA(el.cor, 1, 0)} strokeWidth="2.5" />
                    )}
                    {el.subTipo === 'ellipse' && (
                      <ellipse cx="50" cy="50" rx="46" ry="30" fill="rgba(30, 41, 59, 0.15)" stroke={gerarCorRGBDA(el.cor, 1, 0)} strokeWidth="2.5" />
                    )}
                    {el.subTipo === 'diamond' && (
                      <polygon points="50,5 95,50 50,95 5,50" fill="rgba(30, 41, 59, 0.15)" stroke={gerarCorRGBDA(el.cor, 1, 0)} strokeWidth="2.5" strokeLinejoin="round" />
                    )}
                    {el.subTipo === 'triangle' && (
                      <polygon points="50,8 8,92 92,92" fill="rgba(30, 41, 59, 0.15)" stroke={gerarCorRGBDA(el.cor, 1, 0)} strokeWidth="2.5" strokeLinejoin="round" />
                    )}
                    {el.subTipo === 'star' && (
                      <polygon points="50,5 63,35 95,38 70,60 78,92 50,75 22,92 30,60 5,38 37,35" fill="rgba(30, 41, 59, 0.15)" stroke={gerarCorRGBDA(el.cor, 1, 0)} strokeWidth="2.5" strokeLinejoin="round" />
                    )}
                    {el.subTipo === 'hexagon' && (
                      <polygon points="50,5 90,25 90,75 50,95 10,75 10,25" fill="rgba(30, 41, 59, 0.15)" stroke={gerarCorRGBDA(el.cor, 1, 0)} strokeWidth="2.5" strokeLinejoin="round" />
                    )}
                    {el.subTipo === 'pentagon' && (
                      <polygon points="50,5 95,38 78,92 22,92 5,38" fill="rgba(30, 41, 59, 0.15)" stroke={gerarCorRGBDA(el.cor, 1, 0)} strokeWidth="2.5" strokeLinejoin="round" />
                    )}
 
                    {el.subTipo === 'arrow-right' && (
                      <line 
                        x1="10" y1="50" x2="85" y2="50" stroke={gerarCorRGBDA(el.cor, 1, 0)} 
                        strokeWidth={el.elbowEspessura || "4"} strokeLinecap="round" 
                        strokeDasharray={obterStrokeDasharray(el.elbowEstilo)}
                        markerEnd={`url(#arrow-head-${el.id})`} 
                      />
                    )}
 
                    {el.subTipo === 'elbow-arrow' && (() => {
                      let pathD = "M 10 50 L 50 50 L 50 85"; 
                      if (el.elbowDirecao === 'RU') pathD = "M 10 50 L 50 50 L 50 15";
                      if (el.elbowDirecao === 'LD') pathD = "M 90 50 L 50 50 L 50 85";
                      if (el.elbowDirecao === 'LU') pathD = "M 90 50 L 50 50 L 50 15";
 
                      return (
                        <path 
                          d={pathD} fill="none" stroke={gerarCorRGBDA(el.cor, 1, 0)} 
                          strokeWidth={el.elbowEspessura || "4"} strokeLinejoin="round" strokeLinecap="round" 
                          strokeDasharray={obterStrokeDasharray(el.elbowEstilo)}
                          markerEnd={el.elbowPonta === 'seta' ? `url(#arrow-head-${el.id})` : ''} 
                        />
                      );
                    })()}
                  </svg>
                )}
 
                {elSelected && elementosSelecionadosIds.length === 1 && el.subTipo !== 'elbow-arrow' && el.subTipo !== 'arrow-right' && (
                  <div className={styles.propertyToolbar} onMouseDown={(e) => e.stopPropagation()}>
                    {el.tipo !== 'texto' && el.tipo !== 'embed' && el.tipo !== 'bookmark' && (
                      <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '12px' }}>
                        🎨 Cor:
                        <input type="color" value={el.cor} onChange={(e) => atualizarPropriedadeElemento(el.id, { cor: e.target.value })} style={{ width: '18px', height: '18px', padding: 0, border: 'none', cursor: 'pointer', backgroundColor: 'transparent' }} />
                      </label>
                    )}
                    {(el.tipo === 'quadro' || el.tipo === 'texto') && (
                      <>
                        <div style={{ width: '1px', height: '14px', backgroundColor: '#1e293b' }} />
                        <span className={styles.propItem}>P</span>
                        <span className={`${styles.propItem} ${styles.propItemActiveGreen}`}>M</span>
                        <span className={styles.propItem}>G</span>
                      </>
                    )}
                    <div style={{ width: '1px', height: '14px', backgroundColor: '#1e293b' }} />
                    <span className={styles.propItem} onClick={() => { setElementos(elementos.filter(item => item.id !== el.id)); setElementosSelecionadosIds([]); setElementoSelecionadoId(null); }}>🗑️ Excluir</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
 
        {/* PAINEL FLUTUANTE INFERIOR RESTAURADO - PROPRIEDADES DE SETAS */}
        {isSelected && elementosSelecionadosIds.length === 1 && (elementoSelecionado?.subTipo === 'elbow-arrow' || elementoSelecionado?.subTipo === 'arrow-right') && (
          <div className={styles.propertyToolbar} style={{ bottom: '24px', position: 'fixed', maxWidth: '90vw', flexWrap: 'wrap', gap: '12px', zIndex: 999 }} onMouseDown={(e) => e.stopPropagation()}>
            {elementoSelecionado.subTipo === 'elbow-arrow' && (
              <>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Direção:</span>
                <button className={`${styles.propItem} ${elementoSelecionado.elbowDirecao === 'RD' ? styles.propItemActiveGreen : ''}`} onClick={() => atualizarPropriedadeElemento(elementoSelecionadoId, { elbowDirecao: 'RD' })}>👇 RD</button>
                <button className={`${styles.propItem} ${elementoSelecionado.elbowDirecao === 'RU' ? styles.propItemActiveGreen : ''}`} onClick={() => atualizarPropriedadeElemento(elementoSelecionadoId, { elbowDirecao: 'RU' })}>☝️ RU</button>
                <button className={`${styles.propItem} ${elementoSelecionado.elbowDirecao === 'LD' ? styles.propItemActiveGreen : ''}`} onClick={() => atualizarPropriedadeElemento(elementoSelecionadoId, { elbowDirecao: 'LD' })}>👈 LD</button>
                <button className={`${styles.propItem} ${elementoSelecionado.elbowDirecao === 'LU' ? styles.propItemActiveGreen : ''}`} onClick={() => atualizarPropriedadeElemento(elementoSelecionadoId, { elbowDirecao: 'LU' })}>👉 LU</button>
                <div style={{ width: '1px', height: '14px', backgroundColor: '#1e293b' }} />
              </>
            )}
            <span style={{ fontSize: '11px', color: '#64748b' }}>Ponta:</span>
            <button className={`${styles.propItem} ${elementoSelecionado.elbowPonta === 'seta' ? styles.propItemActiveGreen : ''}`} onClick={() => atualizarPropriedadeElemento(elementoSelecionadoId, { elbowPonta: 'seta' })}>📐 Seta</button>
            <button className={`${styles.propItem} ${elementoSelecionado.elbowPonta === 'linha' ? styles.propItemActiveGreen : ''}`} onClick={() => atualizarPropriedadeElemento(elementoSelecionadoId, { elbowPonta: 'linha' })}>➖ Reta</button>
            <div style={{ width: '1px', height: '14px', backgroundColor: '#1e293b' }} />
            <span style={{ fontSize: '11px', color: '#64748b' }}>Espessura:</span>
            <button className={`${styles.propItem} ${elementoSelecionado.elbowEspessura === '2' ? styles.propItemActiveGreen : ''}`} onClick={() => atualizarPropriedadeElemento(elementoSelecionadoId, { elbowEspessura: '2' })}>Fina</button>
            <button className={`${styles.propItem} ${elementoSelecionado.elbowEspessura === '4' ? styles.propItemActiveGreen : ''}`} onClick={() => atualizarPropriedadeElemento(elementoSelecionadoId, { elbowEspessura: '4' })}>Média</button>
            <button className={`${styles.propItem} ${elementoSelecionado.elbowEspessura === '7' ? styles.propItemActiveGreen : ''}`} onClick={() => atualizarPropriedadeElemento(elementoSelecionadoId, { elbowEspessura: '7' })}>Grossa</button>
            <div style={{ width: '1px', height: '14px', backgroundColor: '#1e293b' }} />
            <span style={{ fontSize: '11px', color: '#64748b' }}>Estilo:</span>
            <button className={`${styles.propItem} ${elementoSelecionado.elbowEstilo === 'solido' ? styles.propItemActiveGreen : ''}`} onClick={() => atualizarPropriedadeElemento(elementoSelecionadoId, { elbowEstilo: 'solido' })}>Sólido</button>
            <button className={`${styles.propItem} ${elementoSelecionado.elbowEstilo === 'tracejado' ? styles.propItemActiveGreen : ''}`} onClick={() => atualizarPropriedadeElemento(elementoSelecionadoId, { elbowEstilo: 'tracejado' })}>Tracejado</button>
            <button className={`${styles.propItem} ${elementoSelecionado.elbowEstilo === 'pontilhado' ? styles.propItemActiveGreen : ''}`} onClick={() => atualizarPropriedadeElemento(elementoSelecionadoId, { elbowEstilo: 'pontilhado' })}>Pontos</button>
            <div style={{ width: '1px', height: '14px', backgroundColor: '#1e293b' }} />
            <span style={{ fontSize: '11px', color: '#64748b' }}>Cor:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              {PRESETS_ELEMENTOS.slice(0, 4).map(c => (
                <button key={c} onClick={() => atualizarPropriedadeElemento(elementoSelecionadoId, { cor: c })} style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: c, border: elementoSelecionado.cor === c ? '1.5px solid #fff' : 'none', cursor: 'pointer' }} />
              ))}
              <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', position: 'relative' }} title="Escolher cor RGBDA customizada">
                🌈
                <input type="color" value={elementoSelecionado.cor || '#3b82f6'} onChange={(e) => atualizarPropriedadeElemento(elementoSelecionadoId, { cor: e.target.value })} style={{ position: 'absolute', width: '16px', height: '16px', opacity: 0, cursor: 'pointer' }} />
              </label>
            </div>
            <div style={{ width: '1px', height: '14px', backgroundColor: '#1e293b' }} />
            <span className={styles.propItem} style={{ color: '#ef4444' }} onClick={() => { setElementos(elementos.filter(item => item.id !== elementoSelecionadoId)); setElementosSelecionadosIds([]); setElementoSelecionadoId(null); }}>🗑️</span>
          </div>
        )}
      </div>
  </div>
  );
}