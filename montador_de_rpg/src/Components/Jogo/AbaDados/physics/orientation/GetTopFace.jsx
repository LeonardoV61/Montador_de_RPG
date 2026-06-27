import { useCallback } from 'react';
import * as THREE from 'three';

// Instanciação de vetores auxiliares fora do loop (Otimização de performance)
const _worldUp = new THREE.Vector3(0, 1, 0);
const _quaternion = new THREE.Quaternion();
const _worldNormal = new THREE.Vector3();

// SEU MAPA ORIGINAL DO D4 RECUPERADO
const D4_FACE_MAP = [
   { local: new THREE.Vector3(1, 1, 1).normalize(), value: 1 },
   { local: new THREE.Vector3(-1, -1, 1).normalize(), value: 4 },
   { local: new THREE.Vector3(-1, 1, -1).normalize(), value: 3 },
   { local: new THREE.Vector3(1, -1, -1).normalize(), value: 2 }
];

// MAPA ESTÁTICO DO D6
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

   // 1. Tratamento para a Moeda (D2)
   if (lados === 2) {
      mesh.updateMatrixWorld(true);
      mesh.getWorldQuaternion(_quaternion);
      const localUp = new THREE.Vector3(0, 1, 0).applyQuaternion(_quaternion);
      return localUp.y > 0 ? 'Cara' : 'Coroa';
   }

   mesh.updateMatrixWorld(true);
   mesh.getWorldQuaternion(_quaternion);

   // 2. RETORNO DO SEU MAPA ORIGINAL PARA O D4
   if (lados === 4) {
      let maxDot = -Infinity;
      let faceVencedora = 1;
      for (const f of D4_FACE_MAP) {
         _worldNormal.copy(f.local).applyQuaternion(_quaternion);
         const dot = _worldNormal.dot(_worldUp);
         if (dot > maxDot) {
            maxDot = dot;
            faceVencedora = f.value;
         }
      }
      return faceVencedora;
   }

   // 3. MAPA DO D6
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

   // 4. Resolução Dinâmica Robusta para Dados Complexos (D10, D12, D20, D8)
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

   return indiceNormalVencedora + 1;
}

export function useTopFaceDeterminer() {
   return useCallback((mesh, lados) => determinarFaceSuperior(mesh, lados), []);
}

export default useTopFaceDeterminer;