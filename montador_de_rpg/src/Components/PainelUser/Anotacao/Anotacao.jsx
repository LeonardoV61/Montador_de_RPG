import React, { useState, useEffect } from 'react';
import { 
  Type, FileText, Group, Square, Layers, BookOpen, 
  MousePointer, Hand, Lasso, PenTool, Eraser, Grid, Download, Link2
} from 'lucide-react';
import styles from './styles.Anotacao.module.css';

export default function AnotacaoCanvas() {
  const [elementos, setElementos] = useState([
    { id: 1, tipo: 'quadro', x: 380, y: 140, largura: 360, altura: 200, titulo: 'Quadro de Planejamento' },
    { id: 2, tipo: 'post-it', x: 440, y: 400, largura: 180, altura: 120, conteudo: 'Post-it de exemplo.', cor: '#fffbbf' },
    { id: 3, tipo: 'forma', subTipo: 'rounded-full', x: 840, y: 140, largura: 120, altura: 120 }
  ]);
  
  const [ferramentaAtiva, setFerramentaAtiva] = useState('select'); 
  const [elementoSelecionadoId, setElementoSelecionadoId] = useState(null);
  const [editandoTextoId, setEditandoTextoId] = useState(null); 
  const [menuAberto, setMenuAberto] = useState(null); // 'formas', 'postit', 'midia', 'recursos', 'grid' ou 'exportar'
  const [tipoGrid, setTipoGrid] = useState('dots'); // 'dots', 'dots-light', 'dots-small', 'none'
  const [exportConfig, setExportConfig] = useState({ area: 'inteiro', fundo: 'escuro', resolucao: '2x' });

  // Estados da Caneta (Desenho Livre)
  const [linhas, setLinhas] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);

  // Estados de Arrastar Elemento
  const [arrastandoId, setArrastandoId] = useState(null);
  const [offsetElemento, setOffsetElemento] = useState({ x: 0, y: 0 });

  // Estados do Motor de Redimensionamento (8 Direções)
  const [handleRedimensionamento, setHandleRedimensionamento] = useState(null); 
  const [dimensoesIniciais, setDimensoesIniciais] = useState(null);

  // Movimento da Câmera (Pan)
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  // Listener para Deletar Elementos Selecionados
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!elementoSelecionadoId) return;
      const tagAtiva = document.activeElement ? document.activeElement.tagName : '';
      const estaDigitando = tagAtiva === 'TEXTAREA' || tagAtiva === 'INPUT';

      if (!estaDigitando && (e.key === 'Delete' || e.key === 'Backspace')) {
        setElementos(prev => prev.filter(el => el.id !== elementoSelecionadoId));
        setElementoSelecionadoId(null);
        setEditandoTextoId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [elementoSelecionadoId]);

  const adicionarElemento = (tipo, configuracao = {}) => {
    // Redimensionamento proporcional das formas quadradas vs elipse
    let larguraPadrao = configuracao.largura || 160;
    let alturaPadrao = configuracao.altura || 120;

    if (tipo === 'forma') {
      if (configuracao.forma === 'ellipse') {
        larguraPadrao = 160;
        alturaPadrao = 100;
      } else {
        larguraPadrao = 120;
        alturaPadrao = 120;
      }
    }

    const novoElemento = {
      id: Date.now(),
      tipo,
      subTipo: configuracao.forma || null,
      x: 520 - pan.x, 
      y: 220 - pan.y,
      largura: larguraPadrao,
      altura: alturaPadrao,
      conteudo: configuracao.conteudo || '',
      titulo: configuracao.titulo || 'Novo Quadro',
      cor: configuracao.cor || '#fffbbf',
      url: configuracao.url || null
    };
    setElementos([...elementos, novoElemento]);
    setElementoSelecionadoId(novoElemento.id);
    setMenuAberto(null); 
  };

  const handleCanvasMouseDown = (e) => {
    const targetId = e.target.id;
    
    // Tratamento específico do desenho da caneta
    if (ferramentaAtiva === 'pen') {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left - pan.x;
      const y = e.clientY - rect.top - pan.y;
      setIsDrawing(true);
      setLinhas([...linhas, { id: Date.now(), pontos: [{ x, y }], cor: '#3b82f6' }]);
      return;
    }

    if (targetId === 'canvas-container' || targetId === 'canvas-board' || targetId === 'canvas-grid' || ferramentaAtiva === 'hand') {
      setElementoSelecionadoId(null);
      setEditandoTextoId(null);
      setMenuAberto(null);

      setIsPanning(true);
      setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleResizeMouseDown = (e, elId, handleType) => {
    e.stopPropagation();
    e.preventDefault();
    
    const el = elementos.find(item => item.id === elId);
    if (!el) return;

    setHandleRedimensionamento(handleType);
    setDimensoesIniciais({
      x: el.x,
      y: el.y,
      largura: el.largura,
      altura: el.altura,
      mouseX: e.clientX,
      mouseY: e.clientY
    });
  };

  const handleElementMouseDown = (e, id) => {
    if (ferramentaAtiva === 'hand' || ferramentaAtiva === 'pen') return; 
    e.stopPropagation(); 

    if (ferramentaAtiva === 'eraser') {
      setElementos(elementos.filter(el => el.id !== id));
      if (elementoSelecionadoId === id) setElementoSelecionadoId(null);
      return;
    }

    setElementoSelecionadoId(id);
    if (editandoTextoId === id) return;

    if (ferramentaAtiva === 'select') {
      setArrastandoId(id);
      const el = elementos.find(item => item.id === id);
      setOffsetElemento({ x: e.clientX - el.x, y: e.clientY - el.y });
    }
  };

  const handleElementDoubleClick = (e, id) => {
    e.stopPropagation();
    if (ferramentaAtiva === 'hand' || ferramentaAtiva === 'eraser' || ferramentaAtiva === 'pen') return;
    
    setElementoSelecionadoId(id);
    setEditandoTextoId(id);
  };

  const handleCanvasMouseMove = (e) => {
    if (isDrawing && ferramentaAtiva === 'pen') {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left - pan.x;
      const y = e.clientY - rect.top - pan.y;
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

    if (isPanning) {
      setPan({ x: e.clientX - startPan.x, y: e.clientY - startPan.y });
    } 
    else if (handleRedimensionamento && dimensoesIniciais) {
      const dx = e.clientX - dimensoesIniciais.mouseX;
      const dy = e.clientY - dimensoesIniciais.mouseY;

      setElementos(elementos.map(el => {
        if (el.id === elementoSelecionadoId) {
          let novaLargura = dimensoesIniciais.largura;
          let novaAltura = dimensoesIniciais.altura;
          let novoX = dimensoesIniciais.x;
          let novoY = dimensoesIniciais.y;
          const minTamanho = 40;

          if (handleRedimensionamento.includes('R')) {
            novaLargura = Math.max(minTamanho, dimensoesIniciais.largura + dx);
          }
          if (handleRedimensionamento.includes('L')) {
            const larguraPossivel = dimensoesIniciais.largura - dx;
            if (larguraPossivel >= minTamanho) {
              novaLargura = larguraPossivel;
              novoX = dimensoesIniciais.x + dx;
            }
          }

          if (handleRedimensionamento.includes('B')) {
            novaAltura = Math.max(minTamanho, dimensoesIniciais.altura + dy);
          }
          if (handleRedimensionamento.includes('T')) {
            const alturaPossivel = dimensoesIniciais.altura - dy;
            if (alturaPossivel >= minTamanho) {
              novaAltura = alturaPossivel;
              novoY = dimensoesIniciais.y + dy;
            }
          }

          return { ...el, x: novoX, y: novoY, largura: novaLargura, altura: novaAltura };
        }
        return el;
      }));
    } 
    else if (arrastandoId !== null && ferramentaAtiva === 'select') {
      setElementos(elementos.map(el => {
        if (el.id === arrastandoId) {
          return { ...el, x: e.clientX - offsetElemento.x, y: e.clientY - offsetElemento.y };
        }
        return el;
      }));
    }
  };

  const handleCanvasMouseUp = () => {
    setArrastandoId(null);
    setIsPanning(false);
    setIsDrawing(false);
    setHandleRedimensionamento(null);
    setDimensoesIniciais(null);
  };

  const obterClasseCursor = () => {
    if (ferramentaAtiva === 'hand') return isPanning ? styles.cursorPanning : styles.cursorHand;
    if (ferramentaAtiva === 'eraser') return styles.cursorEraser;
    if (ferramentaAtiva === 'pen') return styles.cursorPen;
    return styles.cursorSelect;
  };

  const obterClasseGrid = () => {
    if (tipoGrid === 'dots-light') return styles.canvasGridLight;
    if (tipoGrid === 'dots-small') return styles.canvasGridSmall;
    if (tipoGrid === 'none') return '';
    return styles.canvasDotGrid;
  };

  return (
    <div 
      id="canvas-container"
      className={`${styles.canvasContainer} ${obterClasseCursor()}`}
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleCanvasMouseMove}
      onMouseUp={handleCanvasMouseUp}
    >
      
      {/* SIDEBAR LATERAL */}
      <div className={styles.toolbarSidebar} onMouseDown={(e) => e.stopPropagation()}>
        {/* 1° Botão: Texto */}
        <button onClick={() => adicionarElemento('texto', { conteudo: 'Caixa de texto livre...' })} className={styles.sidebarButton}>
          <Type size={18} />
        </button>

        {/* 2° Botão: Post-it */}
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
                <button onClick={() => adicionarElemento('post-it', { cor: '#fffbbf', conteudo: 'Nota amarela...' })} className={styles.colorCircleButton} style={{ backgroundColor: '#fffbbf' }} />
                <button onClick={() => adicionarElemento('post-it', { cor: '#ffcbe3', conteudo: 'Nota rosa...' })} className={styles.colorCircleButton} style={{ backgroundColor: '#ffcbe3' }} />
                <button onClick={() => adicionarElemento('post-it', { cor: '#cbf7d2', conteudo: 'Nota verde...' })} className={styles.colorCircleButton} style={{ backgroundColor: '#cbf7d2' }} />
                <button onClick={() => adicionarElemento('post-it', { cor: '#cbe3f7', conteudo: 'Nota azul...' })} className={styles.colorCircleButton} style={{ backgroundColor: '#cbe3f7' }} />
              </div>
            </div>
          )}
        </div>

        {/* 3° Botão: Group */}
        <button 
          onClick={() => adicionarElemento('quadro', { titulo: 'Quadro de Planejamento', largura: 360, altura: 200 })} 
          className={styles.sidebarButton}
        >
          <Group size={18} />
        </button>

        {/* 4° Botão: Formas Básicas */}
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
                <button onClick={() => adicionarElemento('forma', { forma: 'rect' })} className={styles.shapeGridButton}>
                  <div className={styles.menuShapeIcon} />
                </button>
                <button onClick={() => adicionarElemento('forma', { forma: 'rounded-full' })} className={styles.shapeGridButton}>
                  <div className={styles.menuShapeIcon} style={{ borderRadius: '50%' }} />
                </button>
                <button onClick={() => adicionarElemento('forma', { forma: 'ellipse' })} className={styles.shapeGridButton}>
                  <div className={styles.menuShapeIcon} style={{ borderRadius: '50%', width: '22px', height: '12px' }} />
                </button>
                <button onClick={() => adicionarElemento('forma', { forma: 'diamond' })} className={styles.shapeGridButton}>
                  <div className={`${styles.menuShapeIcon} ${styles.shapeDiamond}`} />
                </button>
                <button onClick={() => adicionarElemento('forma', { forma: 'triangle' })} className={styles.shapeGridButton}>
                  <div className={`${styles.menuShapeIcon} ${styles.shapeTriangle}`} />
                </button>
                <button onClick={() => adicionarElemento('forma', { forma: 'star' })} className={styles.shapeGridButton}>
                  <div className={`${styles.menuShapeIcon} ${styles.shapeStar}`} style={{ border: 'none', background: '#3b82f6', clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }} />
                </button>
                <button onClick={() => adicionarElemento('forma', { forma: 'hexagon' })} className={styles.shapeGridButton}>
                  <div className={`${styles.menuShapeIcon} ${styles.shapeHexagon}`} />
                </button>
                <button onClick={() => adicionarElemento('forma', { forma: 'pentagon' })} className={styles.shapeGridButton}>
                  <div className={`${styles.menuShapeIcon} ${styles.shapePentagon}`} />
                </button>
              </div>
              {/* Arrumar essa parte na implementação de linhas e setas no quadro*/}
              <h4 className={styles.menuSectionHeader}>Setas & Balões</h4>
              <div className={styles.shapeGrid}>
                <button className={styles.shapeGridButton}>➔</button>
                <button className={styles.shapeGridButton}>🡨</button>
                <button className={styles.shapeGridButton}>🡩</button>
                <button className={styles.shapeGridButton}>🡫</button>
              </div>

              <h4 className={styles.menuSectionHeader}>Linhas</h4>
              <div className={styles.shapeGridButton} style={{ justifyContent: 'flex-start', padding: '0 12px', gap: '12px', height: '44px', width: '100%' }}>
                <div style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '4px 8px', borderRadius: '6px', fontWeight: 'bold' }}>⤝</div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '11px', fontWeight: '600', color: '#fff' }}>Elbow Arrow</div>
                  <div style={{ fontSize: '9px', color: '#64748b' }}>Conector com dobras</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 5° Botão: Painel de Mídias Completo */}
        <div className={styles.sidebarButtonContainer}>
          <button 
            onClick={() => setMenuAberto(menuAberto === 'midia' ? null : 'midia')} 
            className={`${styles.sidebarButton} ${menuAberto === 'midia' ? styles.sidebarButtonActive : ''}`}
          >
            <Layers size={18} />
          </button>

          {menuAberto === 'midia' && (
            <div className={styles.shapesPopover} style={{ width: '220px', padding: '12px' }}>
              <h4 className={styles.menuSectionHeader} style={{ marginBottom: '8px' }}>Mídia</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <button onClick={() => adicionarElemento('embed', { largura: 360, altura: 240 })} className={styles.shapeGridButton} style={{ width: '100%', justifyContent: 'flex-start', padding: '8px', gap: '8px' }}>
                  <Link2 size={16} style={{ color: '#3b82f6' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                    <strong style={{ fontSize: '11px', fontWeight: '500' }}>Site / Embed</strong>
                    <span style={{ fontSize: '9px', color: '#475569' }}>Elemento Maior</span>
                  </div>
                </button>

                <button onClick={() => adicionarElemento('bookmark', { largura: 220, altura: 75 })} className={styles.shapeGridButton} style={{ width: '100%', justifyContent: 'flex-start', padding: '8px', gap: '8px' }}>
                  <FileText size={16} style={{ color: '#10b981' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                    <strong style={{ fontSize: '11px', fontWeight: '500' }}>Bookmark</strong>
                    <span style={{ fontSize: '9px', color: '#475569' }}>Elemento Menor</span>
                  </div>
                </button>

                <button onClick={() => document.getElementById('upload-imagem-canvas').click()} className={styles.shapeGridButton} style={{ width: '100%', justifyContent: 'flex-start', padding: '8px', gap: '8px' }}>
                  <Download size={16} style={{ color: '#a855f7' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                    <strong style={{ fontSize: '11px', fontWeight: '500' }}>Upload de Imagem</strong>
                    <span style={{ fontSize: '9px', color: '#475569' }}>Do seu Computador</span>
                  </div>
                </button>
                <input 
                  type="file" id="upload-imagem-canvas" accept="image/*" style={{ display: 'none' }} 
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => adicionarElemento('imagem', { url: ev.target.result, largura: 300, altura: 200 });
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* 6° Botão: BookOpen */}
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
                <button className={styles.shapeGridButton} style={{ padding: '6px 10px', fontSize: '11px', width: '100%' }}>🔗 Importar Páginas</button>
              </div>
            </div>
          )}
        </div>

        <div className={styles.sidebarDivider} />

        {/* Controles de Ferramentas | Só Falta o lasso funcionar para ficar completo | fazer o menu de caneta que vai ter a imagem no prompt*/}
        <button onClick={() => setFerramentaAtiva('select')} className={`${styles.sidebarButton} ${ferramentaAtiva === 'select' ? styles.toolActiveGreen : ''}`}><MousePointer size={18} /></button>
        <button onClick={() => { setFerramentaAtiva('hand'); setElementoSelecionadoId(null); setEditandoTextoId(null); }} className={`${styles.sidebarButton} ${ferramentaAtiva === 'hand' ? styles.toolActiveGreen : ''}`}><Hand size={18} /></button>
        <button onClick={() => setFerramentaAtiva('lasso')} className={`${styles.sidebarButton} ${ferramentaAtiva === 'lasso' ? styles.toolActiveGreen : ''}`}><Lasso size={18} /></button>
        <button onClick={() => setFerramentaAtiva('pen')} className={`${styles.sidebarButton} ${ferramentaAtiva === 'pen' ? styles.toolActiveGreen : ''}`}><PenTool size={18} /></button>
        <button onClick={() => { setFerramentaAtiva('eraser'); setElementoSelecionadoId(null); }} className={`${styles.sidebarButton} ${ferramentaAtiva === 'eraser' ? styles.toolActiveRed : ''}`}><Eraser size={18} /></button>

        <div className={styles.sidebarDivider} />

        {/* Penúltimo Botão: Painel de Exportação */}
        <button 
          onClick={() => setMenuAberto(menuAberto === 'exportar' ? null : 'exportar')} 
          className={`${styles.sidebarButton} ${menuAberto === 'exportar' ? styles.sidebarButtonActive : ''}`}
        >
          <Download size={18} />
        </button>

        {/* Último Botão: Grid */}
        <div className={styles.sidebarButtonContainer}>
          <button 
            onClick={() => setMenuAberto(menuAberto === 'grid' ? null : 'grid')} 
            className={styles.sidebarButton} 
            style={{ color: tipoGrid !== 'none' ? '#10b981' : '#475569' }}
          >
            <Grid size={18} />
          </button>
          {menuAberto === 'grid' && (
            <div className={styles.shapesPopover} style={{ width: '150px' }}>
              <h4 className={styles.menuSectionHeader}>Variações do Fundo</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <button onClick={() => setTipoGrid('dots')} className={`${styles.shapeGridButton} ${tipoGrid === 'dots' ? styles.sidebarButtonActive : ''}`} style={{ fontSize: '11px', padding: '6px', width: '100%', height: 'auto' }}>Pontos Padrão</button>
                <button onClick={() => setTipoGrid('dots-light')} className={`${styles.shapeGridButton} ${tipoGrid === 'dots-light' ? styles.sidebarButtonActive : ''}`} style={{ fontSize: '11px', padding: '6px', width: '100%', height: 'auto' }}>Pontos Claros</button>
                <button onClick={() => setTipoGrid('dots-small')} className={`${styles.shapeGridButton} ${tipoGrid === 'dots-small' ? styles.sidebarButtonActive : ''}`} style={{ fontSize: '11px', padding: '6px', width: '100%', height: 'auto' }}>Pontos Menores</button>
                <button onClick={() => setTipoGrid('none')} className={`${styles.shapeGridButton} ${tipoGrid === 'none' ? styles.sidebarButtonActive : ''}`} style={{ fontSize: '11px', padding: '6px', width: '100%', height: 'auto' }}>Sem Grid</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* EXPORT MODAL COMPONENT (Estilizado Corretamente) | ficou muito Bom mas falta colocar uma tela semi transparente preta em cima do quadro antes desse menu*/}
      {menuAberto === 'exportar' && (
        <div className={styles.modalExportar} onMouseDown={(e) => e.stopPropagation()}>
          <div className={styles.modalHeader}>
            <h3 className={styles.modalTitle}>Exportar quadro</h3>
            <button className={styles.sidebarButton} style={{ width: '24px', height: '24px' }} onClick={() => setMenuAberto(null)}>×</button>
          </div>
          
          <div className={styles.modalSection}>
            <div className={styles.modalSectionTitle}>Área</div>
            <div className={styles.modalOptionGroup}>
              <button 
                className={`${styles.modalOptionButton} ${exportConfig.area === 'visivel' ? styles.modalOptionButtonActive : ''}`}
                onClick={() => setExportConfig({...exportConfig, area: 'visivel'})}
              >
                Área visível
              </button>
              <button 
                className={`${styles.modalOptionButton} ${exportConfig.area === 'inteiro' ? styles.modalOptionButtonActive : ''}`}
                onClick={() => setExportConfig({...exportConfig, area: 'inteiro'})}
              >
                Canvas inteiro
              </button>
            </div>
          </div>

          <div className={styles.modalSection}>
            <div className={styles.modalSectionTitle}>Fundo</div>
            <div className={styles.modalOptionGroup}>
              <button 
                className={`${styles.modalOptionButton} ${exportConfig.fundo === 'escuro' ? styles.modalOptionButtonActive : ''}`}
                onClick={() => setExportConfig({...exportConfig, fundo: 'escuro'})}
              >
                Escuro
              </button>
              <button 
                className={`${styles.modalOptionButton} ${exportConfig.fundo === 'branco' ? styles.modalOptionButtonActive : ''}`}
                onClick={() => setExportConfig({...exportConfig, fundo: 'branco'})}
              >
                Branco
              </button>
              <button 
                className={`${styles.modalOptionButton} ${exportConfig.fundo === 'transparente' ? styles.modalOptionButtonActive : ''}`}
                onClick={() => setExportConfig({...exportConfig, fundo: 'transparente'})}
              >
                Transp.
              </button>
            </div>
          </div>

          <div className={styles.modalSection}>
            <div className={styles.modalSectionTitle}>Resolução (PNG)</div>
            <div className={styles.modalOptionGroup}>
              <button 
                className={`${styles.modalOptionButton} ${exportConfig.resolucao === '1x' ? styles.modalOptionButtonActive : ''}`}
                onClick={() => setExportConfig({...exportConfig, resolucao: '1x'})}
              >
                1×
              </button>
              <button 
                className={`${styles.modalOptionButton} ${exportConfig.resolucao === '2x' ? styles.modalOptionButtonActive : ''}`}
                onClick={() => setExportConfig({...exportConfig, resolucao: '2x'})}
              >
                2×
              </button>
              <button 
                className={`${styles.modalOptionButton} ${exportConfig.resolucao === '4x' ? styles.modalOptionButtonActive : ''}`}
                onClick={() => setExportConfig({...exportConfig, resolucao: '4x'})}
              >
                4×
              </button>
            </div>
          </div>

          <button className={styles.btnPrimaryExport}>
            <Layers size={14} /> Exportar PNG {exportConfig.resolucao}
          </button>
          <button className={styles.btnSecondaryExport}>
            <FileText size={14} /> Exportar SVG
          </button>
        </div>
      )}

      {/* TABULEIRO EXPANDIDO */}
      <div 
        id="canvas-board"
        className={styles.canvasBoard} 
        style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }}
      >
        {tipoGrid !== 'none' && <div id="canvas-grid" className={obterClasseGrid()} />}

        {/* CAMADA VETORIAL DE DESENHO DA CANETA */}
        <svg 
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            pointerEvents: ferramentaAtiva === 'eraser' ? 'auto' : 'none',
            zIndex: 35 
          }}
        >
          {linhas.map((linha) => (
            <path
              key={linha.id}
              d={linha.pontos.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')}
              fill="none"
              stroke={linha.cor}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ pointerEvents: ferramentaAtiva === 'eraser' ? 'auto' : 'none', cursor: ferramentaAtiva === 'eraser' ? 'cell' : 'default' }}
              onMouseDown={(e) => {
                if (ferramentaAtiva === 'eraser') {
                  e.stopPropagation();
                  setLinhas(prev => prev.filter(l => l.id !== linha.id));
                }
              }}
            />
          ))}
        </svg>

        {/* RENDERIZAÇÃO DOS ELEMENTOS DO CANVAS */}
        {elementos.map((el) => {
          const isSelected = elementoSelecionadoId === el.id;
          const isEditingText = editandoTextoId === el.id;
          const zIndexDinamico = el.tipo === 'quadro' ? (isSelected ? 15 : 10) : (isSelected ? 90 : 20);

          return (
            <div
              key={el.id}
              onMouseDown={(e) => handleElementMouseDown(e, el.id)}
              onDoubleClick={(e) => handleElementDoubleClick(e, el.id)}
              style={{ 
                top: el.y, 
                left: el.x, 
                width: el.largura, 
                height: el.altura,
                zIndex: zIndexDinamico,
                pointerEvents: ferramentaAtiva === 'hand' ? 'none' : 'auto' 
              }}
              className={`${styles.canvasElement} ${isSelected ? styles.elementSelected : ''}`}
            >
              
              {isSelected && (
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
                    className={styles.textoAreaInput}
                    value={el.conteudo}
                    onChange={(e) => setElementos(elementos.map(item => item.id === el.id ? { ...item, conteudo: e.target.value } : item))}
                    readOnly={!isEditingText}
                    style={{ pointerEvents: isEditingText ? 'auto' : 'none' }}
                    onBlur={() => setEditandoTextoId(null)}
                    placeholder="Digite o texto aqui..."
                  />
                </div>
              )}

              {el.tipo === 'post-it' && (
                <div className={styles.postItCard} style={{ backgroundColor: el.cor }}>
                  <textarea
                    value={el.conteudo}
                    onChange={(e) => setElementos(elementos.map(item => item.id === el.id ? { ...item, conteudo: e.target.value } : item))}
                    className={styles.postItTextarea}
                    readOnly={!isEditingText}
                    style={{ pointerEvents: isEditingText ? 'auto' : 'none' }}
                    onBlur={() => setEditandoTextoId(null)}
                  />
                </div>
              )}

              {el.tipo === 'quadro' && (
                <div className={styles.quadroCard}>
                  <div className={styles.quadroTitle} onMouseDown={(e) => e.stopPropagation()}>
                    {isEditingText ? (
                      <input 
                        type="text"
                        className={styles.quadroTitleInput}
                        value={el.titulo}
                        onChange={(e) => setElementos(elementos.map(item => item.id === el.id ? { ...item, titulo: e.target.value } : item))}
                        onBlur={() => setEditandoTextoId(null)}
                        onKeyDown={(e) => { if (e.key === 'Enter') setEditandoTextoId(null); }}
                        autoFocus
                      />
                    ) : (
                      <span onDoubleClick={(e) => { e.stopPropagation(); setEditandoTextoId(el.id); }}>
                        {el.titulo}
                      </span>
                    )}
                  </div>
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
                  <span style={{ fontSize: '11px', color: '#e4e4e7' }}>Bookmark Menor</span>
                </div>
              )}

              {el.tipo === 'imagem' && el.url && (
                <div style={{ width: '100%', height: '100%', overflow: 'hidden', borderRadius: '8px' }}>
                  <img src={el.url} alt="Canvas Upload" style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }} />
                </div>
              )}

              {el.tipo === 'forma' && (
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ display: 'block' }}>
                  {(el.subTipo === 'rect' || !el.subTipo) && (
                    <rect x="4" y="4" width="92" height="92" rx="4" fill="rgba(30, 41, 59, 0.25)" stroke="#3b82f6" strokeWidth="2.5" />
                  )}
                  {(el.subTipo === 'rounded-full' || el.subTipo === 'circulo') && (
                    <circle cx="50" cy="50" r="45" fill="rgba(30, 41, 59, 0.25)" stroke="#3b82f6" strokeWidth="2.5" />
                  )}
                  {el.subTipo === 'ellipse' && (
                    <ellipse cx="50" cy="50" rx="46" ry="30" fill="rgba(30, 41, 59, 0.25)" stroke="#3b82f6" strokeWidth="2.5" />
                  )}
                  {el.subTipo === 'diamond' && (
                    <polygon points="50,5 95,50 50,95 5,50" fill="rgba(30, 41, 59, 0.25)" stroke="#3b82f6" strokeWidth="2.5" strokeLinejoin="round" />
                  )}
                  {el.subTipo === 'triangle' && (
                    <polygon points="50,8 8,92 92,92" fill="rgba(30, 41, 59, 0.25)" stroke="#3b82f6" strokeWidth="2.5" strokeLinejoin="round" />
                  )}
                  {el.subTipo === 'star' && (
                    <polygon points="50,5 63,35 95,38 70,60 78,92 50,75 22,92 30,60 5,38 37,35" fill="rgba(30, 41, 59, 0.25)" stroke="#3b82f6" strokeWidth="2.5" strokeLinejoin="round" />
                  )}
                  {el.subTipo === 'hexagon' && (
                    <polygon points="50,5 90,25 90,75 50,95 10,75 10,25" fill="rgba(30, 41, 59, 0.25)" stroke="#3b82f6" strokeWidth="2.5" strokeLinejoin="round" />
                  )}
                  {el.subTipo === 'pentagon' && (
                    <polygon points="50,5 95,38 78,92 22,92 5,38" fill="rgba(30, 41, 59, 0.25)" stroke="#3b82f6" strokeWidth="2.5" strokeLinejoin="round" />
                  )}
                </svg>
              )}

              {isEditingText && (el.tipo === 'post-it' || el.tipo === 'texto') && (
                <div className={styles.propertyToolbar} onMouseDown={(e) => e.stopPropagation()}>
                  <span className={styles.propItem}>P</span>
                  <span className={`${styles.propItem} ${styles.propItemActiveGreen}`}>M</span>
                  <span className={styles.propItem}>G</span>
                  <div style={{ width: '1px', height: '14px', backgroundColor: '#1e293b' }} />
                  <span className={`${styles.propItem} ${styles.propItemActiveGreen}`}>Aa</span>
                  <div style={{ width: '1px', height: '14px', backgroundColor: '#1e293b' }} />
                  <span className={styles.propItem} onClick={() => {
                    setElementos(elementos.filter(item => item.id !== el.id));
                    setElementoSelecionadoId(null);
                    setEditandoTextoId(null);
                  }}>🗑️</span>
                </div>
              )}

            </div>
          );
        })}
      </div>
    </div>
  );
}