import * as THREE from 'three';

export function buildCoinGeometry() {
   return new THREE.CylinderGeometry(0.55, 0.55, 0.08, 32);
}