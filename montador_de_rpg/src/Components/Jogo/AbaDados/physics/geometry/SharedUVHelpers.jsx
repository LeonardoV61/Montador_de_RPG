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

   const uniqueCorners = [];
   const PREC = 4;
   for (let i = 0; i < pos.count; i++) {
      const x = Number(pos.getX(i).toFixed(PREC));
      const y = Number(pos.getY(i).toFixed(PREC));
      const z = Number(pos.getZ(i).toFixed(PREC));
      
      if (!uniqueCorners.some(c => c.x === x && c.y === y && c.z === z)) {
         uniqueCorners.push({ x, y, z, id: uniqueCorners.length, faces: [] });
      }
   }

   for (let f = 0; f < 4; f++) {
      for (let v = 0; v < 3; v++) {
         const idx = f * 3 + v;
         const x = Number(pos.getX(idx).toFixed(PREC));
         const y = Number(pos.getY(idx).toFixed(PREC));
         const z = Number(pos.getZ(idx).toFixed(PREC));
         const corner = uniqueCorners.find(c => c.x === x && c.y === y && c.z === z);
         if (corner && !corner.faces.includes(f)) {
            corner.faces.push(f);
         }
      }
   }

   const cornerToNumber = {};
   uniqueCorners.forEach(c => {
      const f = c.faces;
      if (f.includes(0) && f.includes(1) && f.includes(2)) cornerToNumber[c.id] = "1";
      else if (f.includes(0) && f.includes(1) && f.includes(3)) cornerToNumber[c.id] = "2";
      else if (f.includes(0) && f.includes(2) && f.includes(3)) cornerToNumber[c.id] = "3";
      else if (f.includes(1) && f.includes(2) && f.includes(3)) cornerToNumber[c.id] = "4";
   });

   const arrTriades = [["1","2","3"], ["1","4","2"], ["1","3","4"], ["2","4","3"]];

   for (let f = 0; f < 4; f++) {
      const [nTopo, nEsq, nDir] = arrTriades[f];
      
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
   const uvs = new Float32Array((pos.count / 3) * 6);
   
   for (let i = 0; i < pos.count; i += 9) {
      const idx = (i / 3) * 6;
      uvs[idx]     = 0.5;  uvs[idx + 1] = 0.5;
      uvs[idx + 2] = 0.1;  uvs[idx + 3] = 0.2;
      uvs[idx + 4] = 0.9;  uvs[idx + 5] = 0.2;
      uvs[idx + 6] = 0.5;  uvs[idx + 7] = 0.5;
      uvs[idx + 8] = 0.9;  uvs[idx + 9] = 0.2;
      uvs[idx + 10]= 0.7;  uvs[idx + 11]= 0.9;
      uvs[idx + 12]= 0.5;  uvs[idx + 13]= 0.5;
      uvs[idx + 14]= 0.7;  uvs[idx + 15]= 0.9;
      uvs[idx + 16]= 0.3;  uvs[idx + 17]= 0.9;
   }
   geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
   return geo;
}

