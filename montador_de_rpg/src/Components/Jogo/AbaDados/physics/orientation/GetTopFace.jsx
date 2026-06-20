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
 * * @param {THREE.Mesh} mesh - Instância tridimensional do dado
 * @param {number} lados - Quantidade de lados do poliedro (ex: 6, 10, 20)
 * @returns {number} O número da face que está voltada para cima
 */
export function determinarFaceSuperior(mesh, lados) {
   if (!mesh || !mesh.geometry) return 1;
   
   // Sincroniza as matrizes de transformações globais do objeto no frame atual
   mesh.updateMatrixWorld(true);
   _quaternion.setFromRotationMatrix(mesh.matrixWorld);

   // Caso otimizado específico para Cubos (D6)
   if (lados === 6) {
      let maxDot = -Infinity;
      let bestFace = 1;

      D6_FACE_MAP.forEach(({ local, value }) => {
         _worldNormal.copy(local).applyQuaternion(_quaternion);
         const dot = _worldNormal.dot(_worldUp);
         if (dot > maxDot) {
            maxDot = dot;
            bestFace = value;
         }
      });
      return bestFace;
   }

   // Caso genérico e matemático para demais Poliedros Convexos (D4, D8, D10, D12, D20)
   const posAttr = mesh.geometry.attributes.position;
   if (!posAttr) return 1;

   let maxDot = -Infinity;
   let faceVencedora = 1;

   // Percorre os triângulos da geometria indexada/não-indexada
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
         const groups = mesh.geometry.groups || [];
         const group = groups.find(
            g => g.start <= i && (g.start + g.count) > i
         );
         
         if (group !== undefined) {
            faceVencedora = group.materialIndex + 1;
         }
      }
   }
   
   return faceVencedora;
}

/**
 * Custom Hook React: useTopFaceDeterminer
 * Abstrai a lógica tridimensional e expõe uma função memoizada estável
 * ideal para ser consumida em loops de física como useFrame ou callbacks de parada.
 * * @returns {Function} Função wrapper para detecção de face estável
 */
export function useTopFaceDeterminer() {
   const obterFaceVencedora = useCallback((mesh, lados) => {
      return determinarFaceSuperior(mesh, lados);
   }, []);

   return obterFaceVencedora;
}

export default useTopFaceDeterminer;