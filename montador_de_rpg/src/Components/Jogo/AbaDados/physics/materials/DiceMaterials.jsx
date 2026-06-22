import { useMemo, useEffect } from 'react';
import * as THREE from 'three';

/**
 * Função utilitária pura para geração procedural de texturas e materiais de dados.
 * Mantida isolada para evitar recriação de funções matemáticas e loops na memória.
 * * @param {number} lados - Quantidade de lados do dado (ex: 4, 6, 8, 10, 12, 20)
 * @returns {THREE.MeshStandardMaterial[]} Array de materiais com texturas embutidas
 */
function criarMateriaisDados(lados) {
   const materiais = [];
   
   for (let i = 1; i <= lados; i++) {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');

      // Fundo Base Escuro do Dado
      ctx.fillStyle = '#1a1310';
      ctx.fillRect(0, 0, 512, 512);

      // Gradiente Radial interno para efeito de profundidade volumétrica nas faces
      const grad = ctx.createRadialGradient(256, 256, 50, 256, 256, 300);
      grad.addColorStop(0, '#241a15');
      grad.addColorStop(1, '#0b0807');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);

      // Configuração de estilo das bordas das faces
      ctx.strokeStyle = 'rgba(201, 162, 39, 0.8)';
      ctx.lineWidth = 14;

      // Renderização customizada com base na topologia geométrica de cada poliedro
      if (lados === 4) {
         ctx.fillStyle = '#ffeed0';
         ctx.font = 'bold 50px "Times New Roman", serif';
         ctx.textAlign = 'center';
         ctx.textBaseline = 'middle';

         const arrTriades = [["1", "2", "3"], ["1", "4", "2"], ["1", "3", "4"], ["2", "4", "3"]];
         const [nTopo, nEsq, nDir] = arrTriades[(i - 1) % 4];

         // 1. Número do Topo (alinhado verticalmente)
         ctx.fillText(nTopo, 256, 95);

         // 2. Número Inferior Esquerdo (rotacionado na base esquerda)
         ctx.save();
         ctx.translate(135, 375);
         ctx.rotate(-Math.PI / 3);
         ctx.fillText(nEsq, 0, 0);
         ctx.restore();

         // 3. Número Inferior Direito (rotacionado na base direita)
         ctx.save();
         ctx.translate(377, 375);
         ctx.rotate(Math.PI / 3);
         ctx.fillText(nDir, 0, 0);
         ctx.restore();

         // Borda amarela triangular de contenção do d4
         ctx.beginPath();
         ctx.moveTo(256, 20);
         ctx.lineTo(492, 440);
         ctx.lineTo(20, 440);
         ctx.closePath();
         ctx.stroke();
         
      } else if (lados === 6) {
         // Borda quadrada clássica do d6
         ctx.beginPath();
         ctx.rect(30, 30, 452, 452);
         ctx.stroke();
         
         ctx.fillStyle = '#ffeed0';
         ctx.font = 'bold 190px "Times New Roman", Georgia, serif';
         ctx.textAlign = 'center';
         ctx.textBaseline = 'middle';
         ctx.fillText(i.toString(), 256, 265);
         
         // Linha indicadora inferior para o número 6
         if (i === 6) {
            ctx.fillStyle = '#c9a227';
            ctx.fillRect(176, 390, 160, 16);
         }
         
      } else {
         // Demais poliedros (d8, d10, d12, d20) usam máscaras triangulares ou pentagonais padrão
         ctx.beginPath();
         ctx.moveTo(256, 40);
         ctx.lineTo(470, 420);
         ctx.lineTo(42, 420);
         ctx.closePath();
         ctx.stroke();
         
         ctx.fillStyle = '#ffeed0';
         ctx.font = 'bold 140px "Times New Roman", Georgia, serif';
         ctx.textAlign = 'center';
         ctx.textBaseline = 'middle';
         ctx.fillText(i.toString(), 256, 275);
         
         // Linha indicadora inferior para diferenciar números ambíguos (6 e 9)
         if (i === 6 || i === 9) {
            ctx.fillStyle = '#c9a227';
            ctx.fillRect(186, 370, 140, 12);
         }
      }

      // Criação da textura do Three.js a partir do Canvas gerado
      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.anisotropy = 4; // Melhora a nitidez dos números sob ângulos agudos de câmera

      materiais.push(
         new THREE.MeshStandardMaterial({
            map: tex,
            roughness: 0.15,
            metalness: 0.08,
            envMapIntensity: 1.2,
         })
      );
   }
   
   return materiais;
}

/**
 * Custom Hook React: useDiceMaterials
 * Cria, cacheia e gerencia o ciclo de vida de alocação de texturas WebGL.
 * Evita leaks de memória limpando os materiais antigos ao desmontar.
 * * @param {number} lados - Quantidade de lados do dado
 * @returns {THREE.MeshStandardMaterial[]} Array estável de materiais prontos para o Fiber
 */
export function useDiceMaterials(lados) {
   const materiaisDados = useMemo(() => criarMateriaisDados(lados), [lados]);

   // Otimização de Limpeza de Memória (Garbage Collection do WebGL)
   useEffect(() => {
      return () => {
         materiaisDados.forEach((material) => {
         if (material.map) material.map.dispose();
            material.dispose();
         });
      };
   }, [materiaisDados]);
}

