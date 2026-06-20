import * as THREE from 'three';
import { applyTriangleUVs } from './SharedUVHelpers.jsx';

export function buildD8Geometry() {
    const geo = new THREE.OctahedronGeometry(0.8).toNonIndexed();
    applyTriangleUVs(geo);
    geo.clearGroups();
    for (let i = 0; i < 8; i++) geo.addGroup(i * 3, 3, i);
    return geo;
}