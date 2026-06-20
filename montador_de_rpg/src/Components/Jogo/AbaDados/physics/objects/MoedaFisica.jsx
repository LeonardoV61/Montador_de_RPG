import { useRef } from 'react';
import { useCylinder } from '@react-three/cannon';
import * as THREE from 'three';

import { buildCoinGeometry } from '../geometry/CoinGeometry.jsx';
import { useCoinMaterials } from '../materials/CoinMaterials.jsx';
import { useObjetoFisicoArrastavel } from '../shared/useObjetoFisicoArrastavel.jsx';

function calcularResultadoMoeda(mesh) {
   mesh.updateMatrixWorld(true);
   const q = new THREE.Quaternion();
   mesh.getWorldQuaternion(q);
   const localUp = new THREE.Vector3(0, 1, 0).applyQuaternion(q);
   return localUp.y > 0 ? 'Cara' : 'Coroa';
}

function gerarImpulsoMoeda() {
   return [Math.random() * 4 - 2, -5, Math.random() * 4 - 2];
}

function gerarTorqueMoeda() {
   return [Math.random() * 40 - 20, Math.random() * 2, Math.random() * 40 - 20];
}

/**
 * Componente físico para a moeda (Cara/Coroa).
 * Para dados poliédricos, ver DadoFisico.jsx.
 */
export function MoedaFisica({ id, position = [0, 3, 0], onStopped }) {
   const meshRef = useRef(null);
   const materiaisMoeda = useCoinMaterials();
   const geometriaMoeda = buildCoinGeometry();

   const [ref, api] = useCylinder(() => ({
      mass: 2.8, position, args: [0.55, 0.55, 0.08, 32],
      linearDamping: 0.45, angularDamping: 0.45,
   }), meshRef);

   const stateFlags = useObjetoFisicoArrastavel({
      api,
      meshRef,
      position,
      tempoEsperaMs: 900,
      gerarImpulso: gerarImpulsoMoeda,
      gerarTorque: gerarTorqueMoeda,
      calcularResultado: calcularResultadoMoeda,
      onStopped: (resultado) => onStopped && onStopped(id, resultado, 2),
   });

   return (
      <mesh
         ref={ref} castShadow receiveShadow
         material={materiaisMoeda} geometry={geometriaMoeda}
         onPointerDown={(e) => {
            e.stopPropagation();
            if (!stateFlags.current.lancado) stateFlags.current.segurando = true;
         }}
      />
   );
}

export default MoedaFisica;
