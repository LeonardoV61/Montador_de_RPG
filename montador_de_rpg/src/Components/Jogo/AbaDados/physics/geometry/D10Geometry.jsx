import * as THREE from 'three';

/**
 * buildD10Geometry
 * 
 * Vértices extraídos do .obj original do Blender e centralizados na origem
 * subtraindo o centróide (Z = 0.893046). Isso corrige o centro de massa
 * deslocado que causava rolagem irregular no Cannon.
 * 
 * Triangulação fiel ao .obj (20 triângulos) mapeada para as 10 faces-pipa,
 * cada uma com seu grupo de material próprio.
 */
export function buildD10Geometry() {
   const geometry = new THREE.BufferGeometry();

   // 12 vértices originais do Blender, centralizados na origem (centróide subtraído)
   const baseVertices = [
      new THREE.Vector3( 0.951057,  0.309017,  0.039609),  // 0
      new THREE.Vector3(-0.000001,  0.000001, -0.876129),  // 1  ← polo inferior
      new THREE.Vector3( 0.601241,  0.799068, -0.039609),  // 2
      new THREE.Vector3(-0.951056,  0.309017,  0.039609),  // 3
      new THREE.Vector3(-0.574165,  0.818740, -0.039609),  // 4
      new THREE.Vector3( 0.587786, -0.809017,  0.039609),  // 5
      new THREE.Vector3( 0.945752, -0.324889, -0.039609),  // 6
      new THREE.Vector3( 0.000000,  0.000000,  0.876129),  // 7  ← polo superior
      new THREE.Vector3( 0.000000,  1.000000,  0.039609),  // 8
      new THREE.Vector3(-0.016734, -0.999860, -0.039609),  // 9
      new THREE.Vector3(-0.956095, -0.293058, -0.039609),  // 10
      new THREE.Vector3(-0.587785, -0.809017,  0.039609),  // 11
   ];

   /**
    * 10 faces-pipa, cada uma com 2 triângulos extraídos diretamente do .obj.
    * Ordem: [tri1_a, tri1_b, tri1_c, tri2_a, tri2_b, tri2_c]
    * Mapeamento: pipa 0→tris[3,13], 1→[4,14], 2→[7,17], 3→[5,15], 4→[6,16]
    *             pipa 5→tris[0,10], 6→[8,18], 7→[1,11], 8→[9,19], 9→[2,12]
    */
   const kites = [
      // Faces do polo superior (vértice 7)
      [[7, 2, 8], [7, 0, 2]],   // face 0
      [[4, 7, 8], [4, 3, 7]],   // face 1
      [[10, 7, 3],[10, 11, 7]], // face 2
      [[7, 9, 5], [7, 11, 9]], // face 3
      [[7, 6, 0], [7, 5, 6]],  // face 4
      // Faces do polo inferior (vértice 1)
      [[0, 1, 2], [0, 6, 1]],  // face 5
      [[1, 8, 2], [1, 4, 8]],  // face 6
      [[1, 3, 4], [1, 10, 3]], // face 7
      [[1, 11, 10],[1, 9, 11]],// face 8
      [[5, 1, 6], [5, 9, 1]],  // face 9
   ];

   const positions = [];
   const normals   = [];
   const uvs       = [];

   geometry.clearGroups();

   const _e1 = new THREE.Vector3();
   const _e2 = new THREE.Vector3();

   kites.forEach(([t1, t2], faceIndex) => {
      const startVertex = faceIndex * 6; // 2 triângulos × 3 vértices = 6 por face

      // Calcula normal de cada triângulo separadamente (faces não são perfeitamente planas)
      const calcNormal = ([ia, ib, ic]) => {
         const a = baseVertices[ia], b = baseVertices[ib], c = baseVertices[ic];
         _e1.subVectors(b, a);
         _e2.subVectors(c, a);
         return new THREE.Vector3().crossVectors(_e1, _e2).normalize();
      };

      const n1 = calcNormal(t1);
      const n2 = calcNormal(t2);

      // Triângulo 1
      for (const vi of t1) {
         const v = baseVertices[vi];
         positions.push(v.x, v.y, v.z);
         normals.push(n1.x, n1.y, n1.z);
      }

      // Triângulo 2
      for (const vi of t2) {
         const v = baseVertices[vi];
         positions.push(v.x, v.y, v.z);
         normals.push(n2.x, n2.y, n2.z);
      }

      // UV simétrico por face (pipa)
      uvs.push(0.5, 0.95,  0.05, 0.35,  0.5, 0.05);  // tri 1
      uvs.push(0.5, 0.05,  0.95, 0.35,  0.5, 0.95);  // tri 2

      geometry.addGroup(startVertex, 6, faceIndex);
   });

   geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
   geometry.setAttribute('normal',   new THREE.Float32BufferAttribute(normals, 3));
   geometry.setAttribute('uv',       new THREE.Float32BufferAttribute(uvs, 2));

   // Geometria física limpa para o Cannon: 12 vértices únicos + 20 triângulos indexados
   const geoFisicaLimpa = new THREE.BufferGeometry();
   const arrayVerticesPuros = [];
   baseVertices.forEach(v => arrayVerticesPuros.push(v.x, v.y, v.z));

   const indicesFisicos = [];
   kites.forEach(([t1, t2]) => {
      indicesFisicos.push(...t1, ...t2);
   });

   geoFisicaLimpa.setAttribute('position', new THREE.Float32BufferAttribute(arrayVerticesPuros, 3));
   geoFisicaLimpa.setIndex(indicesFisicos);

   geometry.userData = { geometriaFisicaLimpa: geoFisicaLimpa };

   return geometry;
}