import * as THREE from 'three';

// Calcula a normal de face única para manter a superfície 100% plana
function computeFaceNormal(a, b, c) {
  const ab = new THREE.Vector3().subVectors(b, a);
  const ac = new THREE.Vector3().subVectors(c, a);
  return new THREE.Vector3().crossVectors(ab, ac).normalize();
}

export function buildD10Geometry() {
  const geometry = new THREE.BufferGeometry();

  // 12 Vértices originais e exatos do Blender
  const baseVertices = [
    new THREE.Vector3(0.951056,  0.309017,  0.932655),  // 0
    new THREE.Vector3(-0.000001, 0.000001,  0.016917),  // 1
    new THREE.Vector3(0.601241,  0.799068,  0.853437),  // 2
    new THREE.Vector3(-0.951057, 0.309017,  0.932655),  // 3
    new THREE.Vector3(-0.574165, 0.818740,  0.853437),  // 4
    new THREE.Vector3(0.587785,  -0.809017, 0.932655),  // 5
    new THREE.Vector3(0.945752,  -0.324888, 0.853436),  // 6
    new THREE.Vector3(-0.000000, -0.000000, 1.769175),  // 7
    new THREE.Vector3(0.000000,  1.000000,  0.932655),  // 8
    new THREE.Vector3(-0.016735, -0.999859, 0.853436),  // 9
    new THREE.Vector3(-0.956095, -0.293058, 0.853437),  // 10
    new THREE.Vector3(-0.587786, -0.809017, 0.932655)   // 11
  ];

  // Definição das 10 faces quadrangulares (pipas)
  const facesDef = [
    [7, 0, 2, 8],   // Face 0
    [7, 8, 4, 3],   // Face 1
    [7, 3, 10, 11], // Face 2
    [7, 11, 9, 5],  // Face 3
    [7, 5, 6, 0],   // Face 4
    [1, 2, 0, 6],   // Face 5
    [1, 4, 8, 2],   // Face 6
    [1, 10, 3, 4],  // Face 7
    [1, 9, 11, 10], // Face 8
    [1, 6, 5, 9]    // Face 9
  ];

  const positions = [];
  const normals = [];
  const uvs = [];

  // Limpa qualquer configuração anterior de grupos
  geometry.clearGroups();

  facesDef.forEach((face, index) => {
    const [i0, i1, i2, i3] = face;
    const v0 = baseVertices[i0];
    const v1 = baseVertices[i1];
    const v2 = baseVertices[i2];
    const v3 = baseVertices[i3];

    // Calcula a normal plana absoluta da pipa
    const faceNormal = computeFaceNormal(v0, v1, v2);

    // TRIÂNGULO 1: (v0, v1, v2)
    positions.push(v0.x, v0.y, v0.z);
    positions.push(v1.x, v1.y, v1.z);
    positions.push(v2.x, v2.y, v2.z);

    // TRIÂNGULO 2: (v2, v3, v0)
    positions.push(v2.x, v2.y, v2.z);
    positions.push(v3.x, v3.y, v3.z);
    positions.push(v0.x, v0.y, v0.z);

    // Adiciona a mesma normal para os 6 vértices da face (Garante faces planas cristalinas)
    for (let k = 0; k < 6; k++) {
      normals.push(faceNormal.x, faceNormal.y, faceNormal.z);
    }

    // Mapeamento UV simétrico projetado para cada metade da pipa no Canvas
    uvs.push(0.5, 0.95);  uvs.push(0.05, 0.35); uvs.push(0.5, 0.05);
    uvs.push(0.5, 0.05);  uvs.push(0.95, 0.35); uvs.push(0.5, 0.95);

    // Registra o grupo de material vinculando este intervalo de 6 vértices ao índice da face (0 a 9)
    geometry.addGroup(index * 6, 6, index);
  });

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));

  return geometry;
}