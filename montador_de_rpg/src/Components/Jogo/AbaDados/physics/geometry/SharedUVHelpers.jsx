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

   const cornerMap = new Map();
   const uniqueCorners = [];
   const PREC = 4;
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

   const cornersByFace = [];
   for (let f = 0; f < 4; f++) {
      const faceCorners = [];
      for (let v = 0; v < 3; v++) {
         const idx = f * 3 + v;
         const x = Number(pos.getX(idx).toFixed(PREC));
         const y = Number(pos.getY(idx).toFixed(PREC));
         const z = Number(pos.getZ(idx).toFixed(PREC));
         const c = uniqueCorners.find(uniqueC => uniqueC.x === x && uniqueC.y === y && uniqueC.z === z);
         faceCorners.push(c.id);
      }
      cornersByFace.push(faceCorners);
   }

   const faceOppositeCorner = [3, 0, 1, 2];

   for (let f = 0; f < 4; f++) {
      const opp = faceOppositeCorner[f];
      let nTopo = -1, nEsq = -1, nDir = -1;

      if (opp === 0) { nTopo = 2; nEsq = 1; nDir = 3; }
      else if (opp === 1) { nTopo = 2; nEsq = 3; nDir = 0; }
      else if (opp === 2) { nTopo = 3; nEsq = 1; nDir = 0; }
      else if (opp === 3) { nTopo = 2; nEsq = 0; nDir = 1; }

      const cornerToNumber = {};
      const fC = cornersByFace[f];
      cornerToNumber[fC[0]] = fC[0];
      cornerToNumber[fC[1]] = fC[1];
      cornerToNumber[fC[2]] = fC[2];

      for (let v = 0; v < 3; v++) {
         const idx = f * 3 + v;
         const x = Number(pos.getX(idx).toFixed(PREC));
         const y = Number(pos.getY(idx).toFixed(PREC));
         const z = Number(pos.getZ(idx).toFixed(PREC));
         const corner = uniqueCorners.find(c => c.x === x && c.y === y && c.z === z);
         const numDoCanto = cornerToNumber[corner.id];

         const uIdx = idx * 2;
         if (numDoCanto === nTopo) {
            uvs[uIdx] = 0.50; uvs[uIdx + 1] = 0.95;
         } else if (numDoCanto === nEsq) {
            uvs[uIdx] = 0.05; uvs[uIdx + 1] = 0.05;
         } else if (numDoCanto === nDir) {
            uvs[uIdx] = 0.95; uvs[uIdx + 1] = 0.05;
         }
      }
   }

   geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
   return geo;
}

export function applyPentagonUVs(geo) {
   const pos = geo.attributes.position;
   // SAFETY ADJUSTMENT: Protegemos o alocador garantindo leitura isolada das coordenadas
   const uvs = new Float32Array((pos.count / 3) * 6);
   
   for (let i = 0; i < pos.count; i += 9) {
      const idx = (i / 9) * 6;
      uvs[idx]     = 0.05; uvs[idx + 1] = 0.05;
      uvs[idx + 2] = 0.95; uvs[idx + 3] = 0.05;
      uvs[idx + 4] = 0.50; uvs[idx + 5] = 0.95;
   }
   geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
   return geo;
}