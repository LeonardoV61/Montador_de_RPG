import { useCallback } from 'react';
import * as THREE from 'three';

// Instanciação de vetores auxiliares fora do loop (Otimização crítica de Garbage Collection)
const _worldUp = new THREE.Vector3(0, 1, 0);
const _quaternion = new THREE.Quaternion();
const _worldNormal = new THREE.Vector3();
const _vA = new THREE.Vector3();
const _vB = new THREE.Vector3();
const _vC = new THREE.Vector3();
const _e1 = new THREE.Vector3();
const _e2 = new THREE.Vector3();
const _groupNormal = new THREE.Vector3();

// Dicionário estático para o D6 mapeado de forma limpa e imutável
const D6_FACE_MAP = [
   { local: new THREE.Vector3(1, 0, 0), value: 2 },
   { local: new THREE.Vector3(-1, 0, 0), value: 5 },
   { local: new THREE.Vector3(0, 1, 0), value: 3 },
   { local: new THREE.Vector3(0, -1, 0), value: 4 },
   { local: new THREE.Vector3(0, 0, 1), value: 1 },
   { local: new THREE.Vector3(0, 0, -1), value: 6 },
];

/**
 * Função utilitária pura para determinar a face superior de uma malha 3D.
 * Mantida separada para permitir chamadas imperativas fora de escopos reativos do React.
 */
export function determinarFaceSuperior(mesh, lados) {
   if (!mesh) return 1;

   // Garante que as transformações físicas do Cannon estejam computadas no Three.js
   mesh.updateMatrixWorld(true);
   mesh.getWorldQuaternion(_quaternion);

   // O d6 não precisa varrer triângulos, usa o mapa de vetores diretos por performance
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

   const geo = mesh.geometry;
   if (!geo) return 1;

   const posAttr = geo.attributes.position;
   if (!posAttr) return 1;

   const groups = geo.groups;
   if (!groups || groups.length === 0) return 1;

   // FIX CRÍTICO: Itera por GRUPOS (faces lógicas) em vez de vértices individuais.
   // Cada grupo representa uma face do dado com seu próprio materialIndex.
   // A normal do grupo é calculada como média das normais de todos os seus triângulos,
   // o que é robusto tanto para geometrias indexadas quanto não-indexadas.
   let maxDot = -Infinity;
   let faceVencedora = 1;

   // Índices reais de vértice — lê da index buffer se existir, ou direto da posição
   const index = geo.index;

   for (const group of groups) {
      _groupNormal.set(0, 0, 0);
      let triCount = 0;

      const end = group.start + group.count;

      for (let i = group.start; i < end; i += 3) {
         // Se a geometria for indexada, busca os índices reais; senão usa i diretamente
         const ia = index ? index.getX(i)     : i;
         const ib = index ? index.getX(i + 1) : i + 1;
         const ic = index ? index.getX(i + 2) : i + 2;

         _vA.fromBufferAttribute(posAttr, ia);
         _vB.fromBufferAttribute(posAttr, ib);
         _vC.fromBufferAttribute(posAttr, ic);

         _e1.subVectors(_vB, _vA);
         _e2.subVectors(_vC, _vA);

         // Acumula a normal deste triângulo na normal do grupo
         _groupNormal.addScaledVector(
            new THREE.Vector3().crossVectors(_e1, _e2).normalize(),
            1
         );
         triCount++;
      }

      if (triCount === 0) continue;

      // Normal média do grupo → espaço de mundo
      _groupNormal.divideScalar(triCount).normalize();
      _worldNormal.copy(_groupNormal).applyQuaternion(_quaternion);

      const dot = _worldNormal.dot(_worldUp);
      if (dot > maxDot) {
         maxDot = dot;
         // materialIndex é base-0; valor da face é base-1
         faceVencedora = group.materialIndex + 1;
      }
   }

   return faceVencedora;
}

/**
 * Custom Hook React: useTopFaceDeterminer
 * Abstrai a lógica tridimensional e expõe uma função memoizada estável
 */
export function useTopFaceDeterminer() {
   return useCallback((mesh, lados) => determinarFaceSuperior(mesh, lados), []);
}

export default useTopFaceDeterminer;