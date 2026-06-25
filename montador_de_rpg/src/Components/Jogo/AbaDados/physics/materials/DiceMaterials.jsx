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
      // ========================================================================
      if (lados === 4) {
         ctx.font = 'bold 65px Georgia, serif';
         ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
         ctx.shadowBlur = 6;

         const mapaQuinasD4 = {
            1: { topo: "1", direita: "4", esquerda: "3" },
            2: { topo: "3", direita: "2", esquerda: "1" },
            3: { topo: "1", direita: "4", esquerda: "2" },
            4: { topo: "3", direita: "4", esquerda: "2" }
         };

         const quinasAtuais = mapaQuinasD4[i];

         ctx.save();
         // Centro exato de massa (Baricentro) do novo triângulo equilátero UV
         ctx.translate(257, 353); 
         ctx.rotate(Math.PI);

         // Distância pura e idêntica para centralizar os números nas 3 pontas
         const distQuina = 210; 

         // 1. NÚMERO APONTANDO PARA O VÉRTICE DO TOPO
         ctx.save();
         ctx.translate(0, distQuina);
         ctx.rotate(Math.PI); 
         ctx.fillText(quinasAtuais.topo, 0, 0);
         ctx.restore();

         // 2. NÚMERO APONTANDO PARA O VÉRTICE INFERIOR DIREITO (120 graus)
         ctx.save();
         ctx.rotate((120 * Math.PI) / 180);
         ctx.translate(0, distQuina);
         ctx.rotate(Math.PI);
         ctx.fillText(quinasAtuais.direita, 0, 0);
         ctx.restore();

         // 3. NÚMERO APONTANDO PARA O VÉRTICE INFERIOR ESQUERDO (-120 graus)
         ctx.save();
         ctx.rotate((-120 * Math.PI) / 180);
         ctx.translate(0, distQuina);
         ctx.rotate(Math.PI);
         ctx.fillText(quinasAtuais.esquerda, 0, 0);
         ctx.restore();

         ctx.restore();
      // ======================================================================
      // CORREÇÃO CRÍTICA D12: Um único número centralizado por face pentagonal
      // ======================================================================
      } else if (lados === 12) {
         ctx.font = 'bold 180px Georgia, serif';
         ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
         ctx.shadowBlur = 14;
         ctx.shadowOffsetX = 4;
         ctx.shadowOffsetY = 6;
         ctx.fillText(i.toString(), 256, 270);

         ctx.restore();
      } else if (lados === 10) {
         ctx.font = 'bold 190px Georgia, serif'; // Ajustado levemente o tamanho para caber perfeitamente
         ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
         ctx.shadowBlur = 12;
         ctx.shadowOffsetX = 4;
         ctx.shadowOffsetY = 6;
         
         // Descemos o número de 294 para 275 para centralizar perfeitamente no triângulo estável
         ctx.fillText(i.toString(), 256, 275);
         
         if (i === 6 || i === 9) {
            ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;
            ctx.fillStyle = '#c9a227';
            // Linha única reposicionada proporcionalmente logo abaixo do número (Y = 360)
            ctx.fillRect(186, 370, 140, 12);
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
      if ((lados === 12 || lados === 20 || lados === 8 || lados === 6) && (i === 6 || i === 9)) {
         ctx.fillStyle = '#c9a227';
         ctx.fillRect(186, 370, 140, 12);
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