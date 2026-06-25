import * as THREE from 'three';

export function applyTriangleUVs(geo) {
   const pos = geo.attributes.position;
   const uvs = new Float32Array((pos.count / 3) * 6);
   for (let i = 0; i < pos.count; i += 3) {
      const idx = (i / 3) * 6;
      uvs[idx]     = 0.05; uvs[idx + 1] = 0.05;
      uvs[idx + 2] = 0.95; uvs[idx + 3] = 0.05;
      uvs[idx + 4] = 0.50; uvs[idx + 5] = 0.95;
   }
   geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
   return geo;
}

export function applyD4UVs(geo) {
   const pos = geo.attributes.position;
   const uvs = new Float32Array(pos.count * 2);
   const PREC = 4;

   // 1. Identificar as 4 quinas únicas no espaço local do modelo
   const cornerMap = new Map();
   const uniqueCorners = [];
   
   for (let i = 0; i < pos.count; i++) {
      const x = Number(pos.getX(i).toFixed(PREC));
      const y = Number(pos.getY(i).toFixed(PREC));
      const z = Number(pos.getZ(i).toFixed(PREC));
      const key = `${x}_${y}_${z}`;
      
      if (!cornerMap.has(key)) {    
         const c = { id: uniqueCorners.length, x, y, z };
         cornerMap.set(key, c);
         uniqueCorners.push(c);
      }
   }

   // 2. Mapear cada uma das 4 faces para identificar qual vértice físico é o mais alto localmente
   for (let f = 0; f < 4; f++) {
      const faceVertices = [];
      
      for (let v = 0; v < 3; v++) {
         const idx = f * 3 + v;
         const x = Number(pos.getX(idx).toFixed(PREC));
         const y = Number(pos.getY(idx).toFixed(PREC));
         const z = Number(pos.getZ(idx).toFixed(PREC));
         const c = uniqueCorners.find(uc => uc.x === x && uc.y === y && uc.z === z);
         faceVertices.push({ idx, idFisico: c.id, yGlobal: c.y });
      }

      // Ordenamos os 3 vértices da face baseando-se na altura local do modelo para definir o topo da face no canvas
      // Isso impede que a textura rotacione incorretamente dentro do plano UV
      faceVertices.sort((a, b) => b.yGlobal - a.yGlobal);

      // Atribui as coordenadas equilateras fixas e sem estiramento
      const vTopo = faceVertices[0];
      const vEsq = faceVertices[1];
      const vDir = faceVertices[2];

      uvs[vTopo.idx * 2] = 0.50; 
      uvs[vTopo.idx * 2 + 1] = 0.83;

      uvs[vEsq.idx * 2] = 0.05; 
      uvs[vEsq.idx * 2 + 1] = 0.05;

      uvs[vDir.idx * 2] = 0.95; 
      uvs[vDir.idx * 2 + 1] = 0.05;
   }

   geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
   geo.attributes.uv.needsUpdate = true;
   return geo;
}

export function applyD10UVs(geo) {
   const pos = geo.attributes.position;
   const uvs = new Float32Array(pos.count * 2);

   const v0 = new THREE.Vector3();
   const v1 = new THREE.Vector3();
   const v2 = new THREE.Vector3();
   const normal = new THREE.Vector3();

   // O D10 agrupa de 6 em 6 vértices (2 triângulos por face-pipa)
   for (let i = 0; i < pos.count; i += 6) {
      // Coleta os vértices estruturais da pipa para mapeamento plano
      v0.fromBufferAttribute(pos, i + 0); // Vértice 'a' (Ponta do polo superior/inferior)
      v1.fromBufferAttribute(pos, i + 1); // Vértice 'b' (Quina equatorial esquerda)
      v2.fromBufferAttribute(pos, i + 2); // Vértice 'c' (Quina equatorial oposta/centro-base)

      // 1. Calcula a normal matemática real da face plana
      const edge1 = new THREE.Vector3().subVectors(v1, v0);
      const edge2 = new THREE.Vector3().subVectors(v2, v0);
      normal.crossVectors(edge1, edge2).normalize();

      // 2. Define o eixo vertical (V) usando a espinha dorsal da pipa para alinhar "em pé"
      const tangentV = new THREE.Vector3().subVectors(v0, v2).normalize();
      
      // O eixo horizontal (U) é construído perpendicular à normal e ao eixo vertical corrigido
      const tangentU = new THREE.Vector3().crossVectors(tangentV, normal).normalize();

      // 3. Projeta os 6 vértices neste plano 2D local estável
      const localUVs = [];
      let minU = Infinity, maxU = -Infinity;
      let minV = Infinity, maxV = -Infinity;

      for (let j = 0; j < 6; j++) {
         const vert = new THREE.Vector3().fromBufferAttribute(pos, i + j);
         const u = vert.dot(tangentU);
         const v = vert.dot(tangentV);

         minU = Math.min(minU, u); maxU = Math.max(maxU, u);
         minV = Math.min(minV, v); maxV = Math.max(maxV, v);
         localUVs.push(u, v);
      }

      const sizeX = maxU - minU || 1;
      const sizeY = maxV - minV || 1;
      const maxExtent = Math.max(sizeX, sizeY);

      // 4. Normaliza diretamente para a área central [0,1] preservando as proporções
      for (let j = 0; j < 6; j++) {
         const rawU = localUVs[j * 2];
         const rawV = localUVs[j * 2 + 1];

         // Escala alterada para 0.95 para diminuir o tamanho do número
         let normU = 0.5 + ((rawU - (minU + maxU) / 2) / maxExtent) * 0.95;
         let normV = 0.5 + ((rawV - (minV + maxV) / 2) / maxExtent) * 0.95;

         // Ajuste fino vertical alterado para -0.001 para puxar o número mais para baixo
         normV -= 0.001; 

         const uvIdx = (i + j) * 2;
         uvs[uvIdx] = normU;
         uvs[uvIdx + 1] = normV;
      }
   }

   geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
   geo.attributes.uv.needsUpdate = true;
   return geo;
}

export function applyD12UVs(geo) {
   const pos = geo.attributes.position;
   const count = pos.count;
   const uvs = new Float32Array(count * 2);

   const vA = new THREE.Vector3();
   const vB = new THREE.Vector3();
   const vC = new THREE.Vector3();
   const normal = new THREE.Vector3();
   const centroFace = new THREE.Vector3();
   const direcaoTopo = new THREE.Vector3();

   for (let i = 0; i < count; i += 9) {
      // 1. Calcula o centro real do pentágono
      centroFace.set(0, 0, 0);
      for (let j = 0; j < 9; j++) {
         const p = new THREE.Vector3().fromBufferAttribute(pos, i + j);
         centroFace.add(p);
      }
      centroFace.multiplyScalar(1 / 9);

      // 2. Calcula a normal matemática da face
      vA.fromBufferAttribute(pos, i);
      vB.fromBufferAttribute(pos, i + 1);
      vC.fromBufferAttribute(pos, i + 2);
      vB.sub(vA); vC.sub(vA);
      normal.crossVectors(vB, vC).normalize();

      // 3. ORIENTAÇÃO ESTÁVEL: Encontra a quina física mais distante para travar o "Topo"
      let maxDist = -1;
      let quinaTopo = new THREE.Vector3();
      for (let j = 0; j < 9; j++) {
         const p = new THREE.Vector3().fromBufferAttribute(pos, i + j);
         const dist = p.distanceToSquared(centroFace);
         if (dist > maxDist) {
            maxDist = dist;
            quinaTopo.copy(p);
         }
      }
      direcaoTopo.subVectors(quinaTopo, centroFace).normalize();

      const tangentV = direcaoTopo.clone(); 
      const tangentU = new THREE.Vector3().crossVectors(normal, tangentV).normalize();

      // 4. Projeta os 9 vértices e calcula os limites reais (Bounding Box)
      let minU = Infinity, maxU = -Infinity;
      let minV = Infinity, maxV = -Infinity;
      const localUVs = [];

      for (let j = 0; j < 9; j++) {
         const vert = new THREE.Vector3().fromBufferAttribute(pos, i + j);
         const relativo = new THREE.Vector3().subVectors(vert, centroFace);
         
         const u = relativo.dot(tangentU);
         const v = relativo.dot(tangentV);

         minU = Math.min(minU, u); maxU = Math.max(maxU, u);
         minV = Math.min(minV, v); maxV = Math.max(maxV, v);
         localUVs.push(u, v);
      }

      // 5. Normaliza a escala dinamicamente (com 10% de folga para proteger as quinas)
      const sizeX = maxU - minU;
      const sizeY = maxV - minV;
      const maxExtent = Math.max(sizeX, sizeY) * 1.1; 

      // 6. Aplica os UVs centralizados no espaço [0,1] com proporção perfeita
      for (let j = 0; j < 9; j++) {
         const u = localUVs[j * 2];
         const v = localUVs[j * 2 + 1];

         const normU = 0.5 + ((u - (minU + maxU) / 2) / maxExtent);
         const normV = 0.5 + ((v - (minV + maxV) / 2) / maxExtent);

         const uvIdx = (i + j) * 2;
         uvs[uvIdx] = normU;
         uvs[uvIdx + 1] = normV;
      }
   }

   geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
   geo.attributes.uv.needsUpdate = true;
   return geo;
}