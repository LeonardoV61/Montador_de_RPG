import { useMemo } from 'react';
import * as THREE from 'three';

/**
 * Utilitário puro de extração geométrica.
 * Isola o algoritmo matemático fora do ciclo do componente/hook para evitar recriações em memória.
 */
function extrairDadosPolyhedron(geometry) {
   if (!geometry) return { vertices: [], faces: [] };

   // FIX DE CONCURRÊNCIA FÍSICA: Se a geometria carregar uma malha física limpa indexada 
   // no seu userData (criada por nós no D10 e D12), usamos essa malha direta e imutável para o Cannon.
   const targetGeo = geometry.userData?.geometriaFisicaLimpa || geometry;

   // Clona ou converte para não-indexado de forma limpa a partir do alvo correto
   const geo = targetGeo.index ? targetGeo.toNonIndexed() : targetGeo.clone();
   const posAttr = geo.attributes.position;

   const PREC = 4;
   const snap = (v) => Number(v.toFixed(PREC));

   const vertices = [];
   const faces = [];
   const vertexMap = {};
   let vCounter = 0;

   // Calcula o centroide da malha tridimensional
   const centroid = new THREE.Vector3();
   for (let i = 0; i < posAttr.count; i++) {
      centroid.x += posAttr.getX(i);
      centroid.y += posAttr.getY(i);
      centroid.z += posAttr.getZ(i);
   }
   centroid.divideScalar(posAttr.count);

   // Instanciação de vetores auxiliares reutilizáveis dentro do loop (otimização de GC)
   const _vA = new THREE.Vector3();
   const _vB = new THREE.Vector3();
   const _vC = new THREE.Vector3();
   const _edge1 = new THREE.Vector3();
   const _edge2 = new THREE.Vector3();
   const _normal = new THREE.Vector3();
   const _toFace = new THREE.Vector3();

   const getOrAdd = (v) => {
      const key = `${snap(v.x)}_${snap(v.y)}_${snap(v.z)}`;
      if (vertexMap[key] === undefined) {
         vertexMap[key] = vCounter;
         vertices.push([snap(v.x), snap(v.y), snap(v.z)]);
         vCounter++;
      }
      return vertexMap[key];
   };

   for (let i = 0; i < posAttr.count; i += 3) {
      _vA.fromBufferAttribute(posAttr, i);
      _vB.fromBufferAttribute(posAttr, i + 1);
      _vC.fromBufferAttribute(posAttr, i + 2);

      const ia = getOrAdd(_vA);
      const ib = getOrAdd(_vB);
      const ic = getOrAdd(_vC);

      // Descarta triângulos degenerados (sem área útil)
      if (ia === ib || ib === ic || ia === ic) continue;

      _edge1.subVectors(_vB, _vA);
      _edge2.subVectors(_vC, _vA);
      _normal.crossVectors(_edge1, _edge2);
      _toFace.addVectors(_vA, _vB).add(_vC).divideScalar(3).sub(centroid);

      // Garante que o enrolamento dos vértices (Winding Order) aponte corretamente para fora do sólido convexo
      if (_normal.dot(_toFace) >= 0) {
         faces.push([ia, ib, ic]);
      } else {
         faces.push([ia, ic, ib]);
      }
   }

   // Libera buffers clonados da memória do Three.js de forma explícita
   geo.dispose();

   return { vertices, faces };
}

/**
 * Custom Hook React (usePolyhedronData)
 * Ideal para reter dados pesados de colisores complexos no @react-three/cannon.
 * @param {THREE.BufferGeometry} geometry - Instância da geometria do dado
 * @returns {Object} { vertices, faces } formatados para o useConvexPolyhedron
 */
export function usePolyhedronData(geometry) {
   return useMemo(() => extrairDadosPolyhedron(geometry), [geometry]);
}

export default usePolyhedronData;