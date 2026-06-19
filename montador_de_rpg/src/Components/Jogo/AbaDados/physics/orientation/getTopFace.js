import * as THREE from 'three';

export function determinarFaceSuperior(mesh, lados) {
   if (!mesh) return 1;
   mesh.updateMatrixWorld(true);

   const worldUp = new THREE.Vector3(0, 1, 0);
   const q = new THREE.Quaternion().setFromRotationMatrix(mesh.matrixWorld);

   if (lados === 6) {
      const faceMap = [
         { local: new THREE.Vector3( 1, 0, 0), value: 2 },
         { local: new THREE.Vector3(-1, 0, 0), value: 5 },
         { local: new THREE.Vector3( 0, 1, 0), value: 3 },
         { local: new THREE.Vector3( 0,-1, 0), value: 4 },
         { local: new THREE.Vector3( 0, 0, 1), value: 1 },
         { local: new THREE.Vector3( 0, 0,-1), value: 6 },
      ];
      let maxDot = -Infinity;
      let best = 1;
      const worldNormal = new THREE.Vector3();
      faceMap.forEach(({ local, value }) => {
         worldNormal.copy(local).applyQuaternion(q);
         const dot = worldNormal.dot(worldUp);
         if (dot > maxDot) { maxDot = dot; best = value; }
      });
      return best;
   }

   const posAttr = mesh.geometry.attributes.position;
   if (!posAttr) return 1;

   const vA = new THREE.Vector3();
   const vB = new THREE.Vector3();
   const vC = new THREE.Vector3();
   const e1 = new THREE.Vector3();
   const e2 = new THREE.Vector3();
   const localNormal = new THREE.Vector3();
   const worldNormal = new THREE.Vector3();

   let maxDot = -Infinity;
   let faceVencedora = 1;

   for (let i = 0; i < posAttr.count; i += 3) {
      vA.fromBufferAttribute(posAttr, i);
      vB.fromBufferAttribute(posAttr, i + 1);
      vC.fromBufferAttribute(posAttr, i + 2);

      e1.subVectors(vB, vA);
      e2.subVectors(vC, vA);
      localNormal.crossVectors(e1, e2).normalize();
      worldNormal.copy(localNormal).applyQuaternion(q);

      const dot = worldNormal.dot(worldUp);
      if (dot > maxDot) {
         maxDot = dot;
         const group = mesh.geometry.groups.find(
            g => g.start <= i && (g.start + g.count) > i
         );
         if (group !== undefined) {
            faceVencedora = group.materialIndex + 1;
         }
      }
   }
   return faceVencedora;
}