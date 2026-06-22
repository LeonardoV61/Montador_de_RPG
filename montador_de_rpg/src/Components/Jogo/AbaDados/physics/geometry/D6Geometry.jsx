import * as THREE from 'three';

export function buildD6Geometry() {
   const geo = new THREE.BoxGeometry(0.75, 0.75, 0.75).toNonIndexed();
   geo.clearGroups();
   // Um cubo non-indexed tem 6 faces, cada uma feita de 2 triângulos (6 vértices)
   for (let i = 0; i < 6; i++) {
      geo.addGroup(i * 6, 6, i);
   }
}