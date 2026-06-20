import * as THREE from 'three';
import { applyPentagonUVs } from './SharedUVHelpers.jsx';

export function buildD12Geometry() {
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
   return geo;
}

