import * as THREE from 'three';

import { buildCoinGeometry } from './CoinGeometry.jsx';
import { buildD4Geometry } from './D4Geometry.jsx';
import { buildD6Geometry } from './D6Geometry.jsx';
import { buildD8Geometry } from './D8Geometry.jsx';
import { buildD10Geometry } from './D10Geometry.jsx';
import { buildD12Geometry } from './D12Geometry.jsx';
import { buildD20Geometry } from './D20Geometry.jsx';

export const SOLIDS_GEOMETRY = {
   2: buildCoinGeometry,
   4: buildD4Geometry,
   6: buildD6Geometry,
   8: buildD8Geometry,
   10: buildD10Geometry,
   12: buildD12Geometry,
   20: buildD20Geometry,
};