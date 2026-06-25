import * as THREE from 'three';

/**
 * buildD10Geometry — Trapezoedro Pentagonal matematicamente perfeito
 *
 * GEOMETRIA VISUAL: P=0.7, R=0.75, H=0.073901 (coplanaridade < 1e-6)
 * GEOMETRIA FÍSICA: mesmos polos e raio, mas H_FIS=0.22 (3x maior)
 *
 * O H maior no colisor físico "bichela" a aresta equatorial para o Cannon,
 * eliminando os quiques causados pela aresta quase-paralela ao chão.
 * O visual não muda — só o colisor invisível do Cannon é diferente.
 */
export function buildD10Geometry() {
   const geometry = new THREE.BufferGeometry();

   const P = 0.7, R = 0.75, H = 0.073901, H_FIS = 0.07;
   const A = 2 * Math.PI / 5;
   const O = Math.PI / 5;

   // 12 vértices VISUAIS — geometria exata do trapezoedro
   const baseVertices = [
      new THREE.Vector3(0,                  P,  0                 ),  // 0 polo top
      new THREE.Vector3(0,                 -P,  0                 ),  // 1 polo bot
      new THREE.Vector3(R,                  H,  0                 ),  // 2 sup 0°
      new THREE.Vector3(R*Math.cos(A),      H,  R*Math.sin(A)     ),  // 3 sup 72°
      new THREE.Vector3(R*Math.cos(2*A),    H,  R*Math.sin(2*A)   ),  // 4 sup 144°
      new THREE.Vector3(R*Math.cos(3*A),    H,  R*Math.sin(3*A)   ),  // 5 sup 216°
      new THREE.Vector3(R*Math.cos(4*A),    H,  R*Math.sin(4*A)   ),  // 6 sup 288°
      new THREE.Vector3(R*Math.cos(O),     -H,  R*Math.sin(O)     ),  // 7  inf 36°
      new THREE.Vector3(R*Math.cos(O+A),   -H,  R*Math.sin(O+A)   ),  // 8  inf 108°
      new THREE.Vector3(R*Math.cos(O+2*A), -H,  R*Math.sin(O+2*A) ),  // 9  inf 180°
      new THREE.Vector3(R*Math.cos(O+3*A), -H,  R*Math.sin(O+3*A) ),  // 10 inf 252°
      new THREE.Vector3(R*Math.cos(O+4*A), -H,  R*Math.sin(O+4*A) ),  // 11 inf 324°
   ];

   // 10 faces-pipa — winding order correto (normais para fora)
   const kites = [
      [0,  3,  7,  2],  // face 0  (top)
      [1,  7,  3,  8],  // face 1  (bot)
      [0,  4,  8,  3],  // face 2  (top)
      [1,  8,  4,  9],  // face 3  (bot)
      [0,  5,  9,  4],  // face 4  (top)
      [1,  9,  5, 10],  // face 5  (bot)
      [0,  6, 10,  5],  // face 6  (top)
      [1, 10,  6, 11],  // face 7  (bot)
      [0,  2, 11,  6],  // face 8  (top)
      [1, 11,  2,  7],  // face 9  (bot)
   ];

   const positions = [];
   const normals   = [];
   const uvs       = [];

   geometry.clearGroups();

   const _e1 = new THREE.Vector3();
   const _e2 = new THREE.Vector3();

   kites.forEach(([i0, i1, i2, i3], faceIndex) => {
      const a = baseVertices[i0];
      const b = baseVertices[i1];
      const c = baseVertices[i2];
      const d = baseVertices[i3];

      // Normal flat por face — flatShading:true no material cuida do resto
      _e1.subVectors(b, a);
      _e2.subVectors(c, a);
      const n = new THREE.Vector3().crossVectors(_e1, _e2).normalize();

      // Triângulo 1: a, b, c
      positions.push(a.x, a.y, a.z,  b.x, b.y, b.z,  c.x, c.y, c.z);
      normals.push(n.x, n.y, n.z,  n.x, n.y, n.z,  n.x, n.y, n.z);
      uvs.push(0.5, 0.95,  0.05, 0.35,  0.5, 0.05);

      // Triângulo 2: a, c, d
      positions.push(a.x, a.y, a.z,  c.x, c.y, c.z,  d.x, d.y, d.z);
      normals.push(n.x, n.y, n.z,  n.x, n.y, n.z,  n.x, n.y, n.z);
      uvs.push(0.5, 0.95,  0.5, 0.05,  0.95, 0.35);

      geometry.addGroup(faceIndex * 6, 6, faceIndex);
   });

   geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
   geometry.setAttribute('normal',   new THREE.Float32BufferAttribute(normals, 3));
   geometry.setAttribute('uv',       new THREE.Float32BufferAttribute(uvs, 2));

   // ─── COLISOR FÍSICO ────────────────────────────────────────────────────────
   // Mesmos polos e raio do visual, mas coroas com H_FIS=0.22 em vez de 0.073901.
   // Isso dá ao Cannon 3x mais espaço para resolver colisões na aresta equatorial,
   // eliminando os quiques quando o dado apoia nessa aresta.
   const geoFisicaLimpa = new THREE.BufferGeometry();

   const vertsFisicos = [
      0, P, 0,                                                    // 0 polo top
      0, -P, 0,                                                   // 1 polo bot
      R,                H_FIS, 0,                                 // 2
      R*Math.cos(A),    H_FIS, R*Math.sin(A),                    // 3
      R*Math.cos(2*A),  H_FIS, R*Math.sin(2*A),                  // 4
      R*Math.cos(3*A),  H_FIS, R*Math.sin(3*A),                  // 5
      R*Math.cos(4*A),  H_FIS, R*Math.sin(4*A),                  // 6
      R*Math.cos(O),   -H_FIS, R*Math.sin(O),                    // 7
      R*Math.cos(O+A), -H_FIS, R*Math.sin(O+A),                  // 8
      R*Math.cos(O+2*A),-H_FIS, R*Math.sin(O+2*A),              // 9
      R*Math.cos(O+3*A),-H_FIS, R*Math.sin(O+3*A),              // 10
      R*Math.cos(O+4*A),-H_FIS, R*Math.sin(O+4*A),              // 11
   ];

   const indicesFisicos = [];
   kites.forEach(([i0, i1, i2, i3]) => {
      indicesFisicos.push(i0, i1, i2);
      indicesFisicos.push(i0, i2, i3);
   });

   geoFisicaLimpa.setAttribute('position', new THREE.Float32BufferAttribute(vertsFisicos, 3));
   geoFisicaLimpa.setIndex(indicesFisicos);

   geometry.userData = { geometriaFisicaLimpa: geoFisicaLimpa };

   return geometry;
}