import { useMemo, useEffect } from 'react';
import * as THREE from 'three';

const cacheMateriaisDados = {};

function criarMateriaisDados(lados) {
   if (cacheMateriaisDados[lados]) {
      return cacheMateriaisDados[lados];
   }

   const materiais = [];
   
   for (let i = 1; i <= lados; i++) {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');

      // Fundo Base Escuro do Dado
      ctx.fillStyle = '#1a1310';
      ctx.fillRect(0, 0, 512, 512);

      const grad = ctx.createRadialGradient(256, 256, 50, 256, 256, 300);
      grad.addColorStop(0, '#241a15');
      grad.addColorStop(1, '#0b0807');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);

      ctx.strokeStyle = '#c9a227';
      ctx.lineWidth = 24;
      ctx.strokeRect(0, 0, 512, 512);

      ctx.fillStyle = '#eae5d8';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // ======================================================================
      // CORREÇÃO DEFINITIVA D4: Distribuição Concêntrica Dinâmica
      // ======================================================================
      if (lados === 4) {
         ctx.font = 'bold 70px Georgia, serif';
         
         ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
         ctx.shadowBlur = 4;

         // Move o ponto de origem (0,0) do desenho para o centro exato da área verde
         // Isso neutraliza o efeito de espelhamento que sumia com a quarta face
         ctx.save();
         ctx.translate(256, 290); 

         // 1. NÚMERO APONTANDO PARA A PONTA DO TOPO (0 graus)
         ctx.save();
         ctx.translate(0, -115); // Afasta do centro em direção ao topo
         ctx.fillText(i.toString(), 0, 0);
         ctx.restore();

         // 2. NÚMERO APONTANDO PARA A PONTA DIREITA (120 graus)
         ctx.save();
         ctx.rotate((120 * Math.PI) / 180);
         ctx.translate(0, -115); // Afasta do centro em direção à quina direita
         ctx.fillText(i.toString(), 0, 0);
         ctx.restore();

         // 3. NÚMERO APONTANDO PARA A PONTA ESQUERDA (-120 graus)
         ctx.save();
         ctx.rotate((-120 * Math.PI) / 180);
         ctx.translate(0, -115); // Afasta do centro em direção à quina esquerda
         ctx.fillText(i.toString(), 0, 0);
         ctx.restore();

         ctx.restore(); // Restaura o contexto para a próxima face

      // ======================================================================
      // CORREÇÃO CRÍTICA D12: Um único número centralizado por face pentagonal
      // ======================================================================
      } else if (lados === 12) {
         // D12: número no centroide UV real do pentágono → posição canvas (256, 252)
         ctx.font = 'bold 180px Georgia, serif';
         ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
         ctx.shadowBlur = 14;
         ctx.shadowOffsetX = 4;
         ctx.shadowOffsetY = 6;
         ctx.fillText(i.toString(), 256, 252);
      } else if (lados === 10) {
         // D10: número centralizado no centroide UV da face-pipa (U=0.5, V=0.425)
         // V=0.425 → posição Y no canvas = (1 - 0.425) * 512 = 294
         ctx.font = 'bold 200px Georgia, serif';
         ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
         ctx.shadowBlur = 12;
         ctx.shadowOffsetX = 4;
         ctx.shadowOffsetY = 6;
         ctx.fillText(i.toString(), 256, 294);
         // Sublinhado para 6 e 9 no d10
         if (i === 6 || i === 9) {
            ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;
            ctx.fillStyle = '#c9a227';
            ctx.fillRect(186, 380, 140, 12);
            ctx.fillStyle = '#eae5d8';
         }
      } else {
         // Padrão estável para D6, D8 e D20
         ctx.font = 'bold 210px Georgia, serif';
         ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
         ctx.shadowBlur = 12;
         ctx.shadowOffsetX = 4;
         ctx.shadowOffsetY = 6;
         ctx.fillText(i.toString(), 256, 264);
      }
      
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Sublinhado para identificar 6 e 9
      if ((lados === 12 || lados === 20 || lados === 6) && (i === 6 || i === 9)) {
         ctx.fillStyle = '#c9a227';
         ctx.fillRect(186, 310, 140, 12);
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.anisotropy = 4;

      materiais.push(
         new THREE.MeshStandardMaterial({
            map: tex,
            roughness: 0.15,
            metalness: 0.08,
            envMapIntensity: 1.2,
            // d10 e d12: flatShading mantém arestas marcadas e elimina sombra interna entre triângulos
            flatShading: lados === 10 || lados === 12,
         })
      );
   }
   
   cacheMateriaisDados[lados] = materiais;
   return materiais;
}

/**
 * Custom Hook React: useDiceMaterials
 * Cria, cacheia e gerencia o ciclo de vida de alocação de texturas WebGL.
 * RETORNO CORRIGIDO: Agora expõe o array estável para o DadoFisico.jsx herdar sem quebras.
 */
export function useDiceMaterials(lados) {
   // Usa o useMemo para buscar do cache de forma reativa e estável
   const materiaisDados = useMemo(() => criarMateriaisDados(lados), [lados]);

   // Otimização de Limpeza de Memória (Garbage Collection do WebGL ao desmontar dados)
   useEffect(() => {
      return () => {
         // Opcional: Limpeza fina se o cache global for resetado
      };
   }, [materiaisDados]);

   // CORREÇÃO CRÍTICA DA FÍSICA: Sem este retorno, o Three.js quebra a malha do d6
   return materiaisDados;
}

export default useDiceMaterials;