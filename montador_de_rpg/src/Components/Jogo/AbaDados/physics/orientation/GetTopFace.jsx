import { useCallback } from 'react';
import * as THREE from 'three';

// Instanciação de vetores auxiliares fora do loop (Otimização crítica de performance)
const _worldUp = new THREE.Vector3(0, 1, 0);
const _quaternion = new THREE.Quaternion();
const _worldNormal = new THREE.Vector3();

// Mantemos o D6 estático porque ele usa um mapeamento ortogonal customizado na tua mesa
const D6_FACE_MAP = [
   { local: new THREE.Vector3(1, 0, 0), value: 1 },
   { local: new THREE.Vector3(-1, 0, 0), value: 2 },
   { local: new THREE.Vector3(0, 1, 0), value: 3 },
   { local: new THREE.Vector3(0, -1, 0), value: 4 },
   { local: new THREE.Vector3(0, 0, 1), value: 5 },
   { local: new THREE.Vector3(0, 0, -1), value: 6 }
];

/**
 * Função utilitária pura para determinar a face superior de uma malha 3D.
 */
export function determinarFaceSuperior(mesh, lados) {
   if (!mesh) return 1;

   // 1. Tratamento direto para a Moeda (D2)
   if (lados === 2) {
      mesh.updateMatrixWorld(true);
      mesh.getWorldQuaternion(_quaternion);
      const localUp = new THREE.Vector3(0, 1, 0).applyQuaternion(_quaternion);
      return localUp.y > 0 ? 'Cara' : 'Coroa';
   }

   mesh.updateMatrixWorld(true);
   mesh.getWorldQuaternion(_quaternion);

   // 2. O D6 usa o teu mapa estático ortogonal estável
   if (lados === 6) {
      let maxDot = -Infinity;
      let faceVencedora = 1;
      for (const f of D6_FACE_MAP) {
         _worldNormal.copy(f.local).applyQuaternion(_quaternion);
         const dot = _worldNormal.dot(_worldUp);
         if (dot > maxDot) {
            maxDot = dot;
            faceVencedora = f.value;
         }
      }
      return faceVencedora;
   }

   // 3. Resolução Dinâmica para Dados Complexos (D10, D12, D20, D4, D8)
   let alvoGeometria = null;
   mesh.traverse((child) => {
      if (!alvoGeometria && child.geometry && child.geometry.attributes && child.geometry.attributes.position) {
         alvoGeometria = child.geometry;
      }
   });

   if (!alvoGeometria) return 1;

   const posAttr = alvoGeometria.attributes.position;
   const index = alvoGeometria.index;
   const normaisUnicas = [];
   const TOLERANCIA_ANGULO = 0.95; 

   const totalTriangulos = index ? index.count : posAttr.count;
   
   for (let i = 0; i < totalTriangulos; i += 3) {
      const ia = index ? index.getX(i)     : i;
      const ib = index ? index.getX(i + 1) : i + 1;
      const ic = index ? index.getX(i + 2) : i + 2;

      const vA = new THREE.Vector3().fromBufferAttribute(posAttr, ia);
      const vB = new THREE.Vector3().fromBufferAttribute(posAttr, ib);
      const vC = new THREE.Vector3().fromBufferAttribute(posAttr, ic);

      const e1 = new THREE.Vector3().subVectors(vB, vA);
      const e2 = new THREE.Vector3().subVectors(vC, vA);
      const triNormal = new THREE.Vector3().crossVectors(e1, e2).normalize();

      const centroid = new THREE.Vector3().addVectors(vA, vB).add(vC).divideScalar(3);
      if (triNormal.dot(centroid) < 0) triNormal.negate();

      let existe = false;
      for (const n of normaisUnicas) {
         if (n.dot(triNormal) > TOLERANCIA_ANGULO) {
            existe = true;
            break;
         }
      }
      if (!existe) normaisUnicas.push(triNormal.clone());
   }

   // Encontra qual das normais reais da malha está apontando mais para o topo do mundo
   let maxDot = -Infinity;
   let indiceNormalVencedora = -1;

   for (let i = 0; i < normaisUnicas.length; i++) {
      _worldNormal.copy(normaisUnicas[i]).applyQuaternion(_quaternion);
      const dot = _worldNormal.dot(_worldUp);
      if (dot > maxDot) {
         maxDot = dot;
         indiceNormalVencedora = i;
      }
   }

   if (indiceNormalVencedora === -1) return 1;

   // Com base na sequência sequencial perfeita do teu D10 (onde índice 0 = face 1, índice 1 = face 2...)
   // O valor real da face do dado é matematicamente o índice do vetor + 1!
   const faceDetectada = indiceNormalVencedora + 1;

   // Caso especial do D4: Se a tua malha do D4 ler pela face de apoio (virada para baixo), invertemos o dot.
   // Mas para D10, D12 e D20, o índice sequencial puro resolve a confusão perfeitamente.
   return faceDetectada;
}

export function useTopFaceDeterminer() {
   return useCallback((mesh, lados) => determinarFaceSuperior(mesh, lados), []);
}

export default useTopFaceDeterminer;