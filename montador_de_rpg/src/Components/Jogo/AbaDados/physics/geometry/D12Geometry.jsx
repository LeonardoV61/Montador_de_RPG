import * as THREE from 'three';
import { applyPentagonUVs } from './SharedUVHelpers.jsx';

export function buildD12Geometry() {
   // Mantemos a criação nativa do Dodecaedro
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
   
   // SEGURANÇA FÍSICA: Armazenamos uma referência da geometria original INDEXADA (com vértices limpos) 
   // dentro do próprio objeto para que o nosso extrator de colisor do Cannon use a malha perfeita.
   geo.userData = {
      geometriaFisicaLimpa: new THREE.DodecahedronGeometry(0.75)
   };

   return geo;
}