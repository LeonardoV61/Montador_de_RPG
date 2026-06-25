import * as THREE from 'three';
import { applyPentagonUVs } from './SharedUVHelpers.jsx';

/**
 * buildD12Geometry
 *
 * GEOMETRIA VISUAL: DodecahedronGeometry nativo do Three.js (mantido intacto)
 * GEOMETRIA FÍSICA: 20 vértices únicos reais do dodecaedro via razão áurea φ
 *
 * Substituímos o `new DodecahedronGeometry(0.75)` no colisor por vértices
 * matematicamente exatos — sem duplicatas internas que causavam micro-gaps
 * e os pulos ao colidir com o chão.
 */
export function buildD12Geometry() {
   // ─── GEOMETRIA VISUAL (inalterada) ────────────────────────────────────────
   const geo = new THREE.DodecahedronGeometry(0.75).toNonIndexed();
   const pos = geo.attributes.position;

   for (let i = 0; i < pos.count; i++) {
      pos.setXYZ(i,
         Math.round(pos.getX(i) * 1e5) / 1e5,
         Math.round(pos.getY(i) * 1e5) / 1e5,
         Math.round(pos.getZ(i) * 1e5) / 1e5
      );
   }
   pos.needsUpdate = true;
   geo.computeVertexNormals();
   applyPentagonUVs(geo);

   geo.clearGroups();
   for (let i = 0; i < 12; i++) {
      geo.addGroup(i * 9, 9, i);
   }

   // ─── GEOMETRIA FÍSICA LIMPA ───────────────────────────────────────────────
   // 20 vértices únicos derivados da razão áurea φ — sem duplicatas.
   // Todas as 12 faces pentagonais são coplanares (erro < 1e-6).
   const phi = (1 + Math.sqrt(5)) / 2;
   const s = 0.75 / Math.sqrt(3); // escala para raio=0.75

   const vertsFisicos = new Float32Array([
      // 8 vértices cúbicos
       s,  s,  s,    s,  s, -s,    s, -s,  s,    s, -s, -s,
      -s,  s,  s,   -s,  s, -s,   -s, -s,  s,   -s, -s, -s,
      // 4 vértices no plano YZ
      0,  s/phi,  s*phi,    0,  s/phi, -s*phi,
      0, -s/phi,  s*phi,    0, -s/phi, -s*phi,
      // 4 vértices no plano XZ
       s/phi,  s*phi, 0,   -s/phi,  s*phi, 0,
       s/phi, -s*phi, 0,   -s/phi, -s*phi, 0,
      // 4 vértices no plano XY
       s*phi, 0,  s/phi,    s*phi, 0, -s/phi,
      -s*phi, 0,  s/phi,   -s*phi, 0, -s/phi,
   ]);

   // 12 faces pentagonais → 36 triângulos (3 por face, leque a partir do v0)
   const indicesFisicos = new Uint16Array([
      // face 0:  [0,8,10,2,16]
      0,8,10,  0,10,2,  0,2,16,
      // face 1:  [0,16,17,1,12]
      0,16,17, 0,17,1,  0,1,12,
      // face 2:  [0,12,13,4,8]
      0,12,13, 0,13,4,  0,4,8,
      // face 3:  [1,17,3,11,9]
      1,17,3,  1,3,11,  1,11,9,
      // face 4:  [1,9,5,13,12]
      1,9,5,   1,5,13,  1,13,12,
      // face 5:  [2,10,6,15,14]
      2,10,6,  2,6,15,  2,15,14,
      // face 6:  [2,14,3,17,16]
      2,14,3,  2,3,17,  2,17,16,
      // face 7:  [3,14,15,7,11]
      3,14,15, 3,15,7,  3,7,11,
      // face 8:  [4,13,5,19,18]
      4,13,5,  4,5,19,  4,19,18,
      // face 9:  [4,18,6,10,8]
      4,18,6,  4,6,10,  4,10,8,
      // face 10: [5,9,11,7,19]
      5,9,11,  5,11,7,  5,7,19,
      // face 11: [6,18,19,7,15]
      6,18,19, 6,19,7,  6,7,15,
   ]);

   const geoFisicaLimpa = new THREE.BufferGeometry();
   geoFisicaLimpa.setAttribute('position', new THREE.Float32BufferAttribute(vertsFisicos, 3));
   geoFisicaLimpa.setIndex(new THREE.BufferAttribute(indicesFisicos, 1));

   geo.userData = { geometriaFisicaLimpa: geoFisicaLimpa };

   return geo;
}