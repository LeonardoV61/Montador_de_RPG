import * as THREE from 'three';
import { applyD4UVs } from './SharedUVHelpers';

export function buildD4Geometry() {
   const geo = new THREE.TetrahedronGeometry(0.85);
   applyD4UVs(geo); 
   geo.clearGroups();
   for (let i = 0; i < 4; i++) geo.addGroup(i * 3, 3, i);
   return geo;
}