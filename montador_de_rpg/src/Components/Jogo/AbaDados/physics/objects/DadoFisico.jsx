import { useRef, useMemo } from 'react';
import { useBox, useConvexPolyhedron } from '@react-three/cannon';
import * as THREE from 'three';

import { SOLIDS_GEOMETRY } from '../geometry/SolidsGeometry.jsx';
import { usePolyhedronData } from '../collider/Polyhedron.jsx';
import { determinarFaceSuperior } from '../orientation/GetTopFace.jsx';
import { useDiceMaterials } from '../materials/DiceMaterials.jsx';
import { useObjetoFisicoArrastavel } from '../shared/useObjetoFisicoArrastavel.js';

function gerarImpulsoDado() {
   return [Math.random() * 6 - 3, -5, Math.random() * 6 - 3];
}

function gerarTorqueDado() {
   return [Math.random() * 24 - 12, Math.random() * 24 - 12, Math.random() * 24 - 12];
}

/**
 * Componente físico para dados poliédricos: d4, d6, d8, d10, d12, d20.
 * Para a moeda, ver MoedaFisica.jsx.
 */
export function DadoFisico({ id, lados = 6, position = [0, 3, 0], onStopped }) {
   const meshRef = useRef(null);

   const arrayMateriais = useDiceMaterials(lados);
   const geometriaBase = useMemo(() => {
      const construtor = SOLIDS_GEOMETRY[lados];
      return construtor ? construtor() : new THREE.BoxGeometry(0.75, 0.75, 0.75);
   }, [lados]);
   const dadosCannon = usePolyhedronData(lados !== 6 ? geometriaBase : null);

   const linearDamping = lados === 12 || lados === 10 ? 0.6 : 0.45;
   const angularDamping = lados === 12 || lados === 10 ? 0.9 : 0.70;

   const [ref, api] = lados === 6
      ? useBox(() => ({
            mass: 3.5, position, args: [0.75, 0.75, 0.75],
            linearDamping, angularDamping, allowSleep: true, sleepSpeedLimit: 0.1
         }), meshRef)
      : useConvexPolyhedron(() => ({
            mass: 4.2, position,
            args: [dadosCannon.vertices, dadosCannon.faces],
            linearDamping, angularDamping, allowSleep: true, sleepSpeedLimit: 0.1
         }), meshRef);

   const stateFlags = useObjetoFisicoArrastavel({
      api,
      meshRef,
      position,
      tempoEsperaMs: 1000,
      gerarImpulso: gerarImpulsoDado,
      gerarTorque: gerarTorqueDado,
      calcularResultado: (mesh) => determinarFaceSuperior(mesh, lados),
      onStopped: (resultado) => onStopped && onStopped(id, resultado, lados),
   });

   return (
      <mesh
         ref={ref}
         onPointerDown={(e) => {
         e.stopPropagation();
         if (!stateFlags.current.lancado) stateFlags.current.segurando = true;
         }}
      >
       {/* O objeto visual precisa estar isolado aqui dentro para herdar a matriz física sem conflitos */}
      <mesh 
         castShadow 
         receiveShadow 
         geometry={geometriaBase} 
         material={arrayMateriais} 
       />
      </mesh>
   );
}

export default DadoFisico;
