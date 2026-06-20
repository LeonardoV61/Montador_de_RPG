import * as THREE from 'three';
import { applyTriangleUVs } from './SharedUVHelpers.jsx';

export function buildD20Geometry() {
      const geo = new THREE.IcosahedronGeometry(0.8).toNonIndexed();
      applyTriangleUVs(geo);
      geo.clearGroups();
      for (let i = 0; i < 20; i++) geo.addGroup(i * 3, 3, i);
      return geo;
}