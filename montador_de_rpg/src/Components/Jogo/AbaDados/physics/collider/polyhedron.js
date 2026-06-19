import * as THREE from 'three';

export function extrairDadosPolyhedron(geometry) {
   const geo = geometry.index ? geometry.toNonIndexed() : geometry.clone();
   const posAttr = geo.attributes.position;

   const PREC = 4;
   const snap = (v) => Number(v.toFixed(PREC));

   const vertices = [];
   const faces = [];
   const vertexMap = {};
   let vCounter = 0;

   const centroid = new THREE.Vector3();
   for (let i = 0; i < posAttr.count; i++) {
      centroid.x += posAttr.getX(i);
      centroid.y += posAttr.getY(i);
      centroid.z += posAttr.getZ(i);
   }
   centroid.divideScalar(posAttr.count);

   const _vA = new THREE.Vector3();
   const _vB = new THREE.Vector3();
   const _vC = new THREE.Vector3();
   const _edge1 = new THREE.Vector3();
   const _edge2 = new THREE.Vector3();
   const _normal = new THREE.Vector3();
   const _toFace = new THREE.Vector3();

   for (let i = 0; i < posAttr.count; i += 3) {
      _vA.fromBufferAttribute(posAttr, i);
      _vB.fromBufferAttribute(posAttr, i + 1);
      _vC.fromBufferAttribute(posAttr, i + 2);

      const getOrAdd = (v) => {
         const key = `${snap(v.x)}_${snap(v.y)}_${snap(v.z)}`;
         if (vertexMap[key] === undefined) {
            vertexMap[key] = vCounter;
            vertices.push([snap(v.x), snap(v.y), snap(v.z)]);
            vCounter++;
         }
         return vertexMap[key];
      };

      const ia = getOrAdd(_vA);
      const ib = getOrAdd(_vB);
      const ic = getOrAdd(_vC);

      if (ia === ib || ib === ic || ia === ic) continue;

      _edge1.subVectors(_vB, _vA);
      _edge2.subVectors(_vC, _vA);
      _normal.crossVectors(_edge1, _edge2);
      _toFace.addVectors(_vA, _vB).add(_vC).divideScalar(3).sub(centroid);

      if (_normal.dot(_toFace) >= 0) {
         faces.push([ia, ib, ic]);
      } else {
         faces.push([ia, ic, ib]);
      }
   }

   return { vertices, faces };
}