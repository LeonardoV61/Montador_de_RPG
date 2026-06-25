import * as THREE from 'three';
import { applyD4UVs } from './SharedUVHelpers';

export function buildD4Geometry() {
   // Use .toNonIndexed() to isolate face data and guarantee true flatShading behavior
   const geo = new THREE.TetrahedronGeometry(0.85).toNonIndexed();
   
   applyD4UVs(geo); 
   
   geo.clearGroups();
   for (let i = 0; i < 4; i++) {
      geo.addGroup(i * 3, 3, i);
   }
   
   // Clean visual surface data vectors
   geo.computeVertexNormals();
   
   // SECURITY ACCURACY: Physics Engine handles smooth primitives natively
   geo.userData = {
      geometriaFisicaLimpa: new THREE.TetrahedronGeometry(0.85)
   };

   return geo;
}