import { useMemo } from 'react';
import * as THREE from 'three';

/**
 * Função utilitária pura para geração da textura de uma face da moeda.
 */
function criarTexturaMoeda(texto, corTexto, corFundo) {
   const canvas = document.createElement('canvas');
   canvas.width = 512;
   canvas.height = 512;
   const ctx = canvas.getContext('2d');
   ctx.fillStyle = corFundo;
   ctx.fillRect(0, 0, 512, 512);
   ctx.fillStyle = corTexto;
   ctx.font = 'bold 75px "Cinzel", sans-serif';
   ctx.textAlign = 'center';
   ctx.textBaseline = 'middle';
   ctx.fillText(texto, 256, 256);
   ctx.strokeStyle = corTexto;
   ctx.lineWidth = 16;
   ctx.beginPath();
   ctx.arc(256, 256, 210, 0, Math.PI * 2);
   ctx.stroke();
   return new THREE.CanvasTexture(canvas);
}

/**
 * Função utilitária pura: monta o array de materiais da moeda (lateral, cara, coroa).
 */
export function criarMateriaisMoeda() {
   return [
      new THREE.MeshStandardMaterial({ color: '#b59228', roughness: 0.3, metalness: 0.8 }),
      new THREE.MeshStandardMaterial({
         map: criarTexturaMoeda('CARA', '#ffeed0', '#8a6516'),
         roughness: 0.15,
         metalness: 0.85,
      }),
      new THREE.MeshStandardMaterial({
         map: criarTexturaMoeda('COROA', '#1f1603', '#cfa332'),
         roughness: 0.15,
         metalness: 0.85,
      }),
   ];
}

/**
 * Custom Hook React: useCoinMaterials
 * Cria, cacheia e gerencia o ciclo de vida das texturas/materiais da moeda.
 */
export function useCoinMaterials() {
   const materiaisMoeda = useMemo(() => criarMateriaisMoeda(), []);

   useMemo(() => {
      return () => {
         materiaisMoeda.forEach((material) => {
            if (material.map) material.map.dispose();
            material.dispose();
         });
      };
   }, [materiaisMoeda]);

   return materiaisMoeda;
}

export default useCoinMaterials;
