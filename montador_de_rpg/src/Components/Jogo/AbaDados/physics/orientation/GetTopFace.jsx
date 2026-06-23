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
const _localNormal = new THREE.Vector3();

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

   // FIX DE CONCURRÊNCIA VETORIAL: Garante que as transformações físicas do Cannon 
   // estejam completamente computadas no espaço do Three.js antes de ler o quatérnio
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

   let maxDot = -Infinity;
   let faceVencedora = 1;

   // Percorre os triângulos da geometria indexada/não-indexada visual
   for (let i = 0; i < posAttr.count; i += 3) {
      _vA.fromBufferAttribute(posAttr, i);
      _vB.fromBufferAttribute(posAttr, i + 1);
      _vC.fromBufferAttribute(posAttr, i + 2);

      _e1.subVectors(_vB, _vA);
      _e2.subVectors(_vC, _vA);
      _localNormal.crossVectors(_e1, _e2).normalize();
      _worldNormal.copy(_localNormal).applyQuaternion(_quaternion);

      const dot = _worldNormal.dot(_worldUp);
      if (dot > maxDot) {
         maxDot = dot;
         
         // Encontra a qual grupo de material o triângulo processado pertence
         const groups = geo.groups || [];
         const group = groups.find(
            g => g.start <= i && (g.start + g.count) > i
         );
         
         if (group !== undefined) {
            // Usa o mapeamento exato do índice de material atribuído na criação da geometria
            faceVencedora = group.materialIndex + 1;
         }
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