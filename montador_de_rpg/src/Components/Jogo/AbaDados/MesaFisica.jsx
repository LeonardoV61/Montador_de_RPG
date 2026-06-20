import { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useBox, useCylinder, useConvexPolyhedron } from '@react-three/cannon';
import * as THREE from 'three';

// Importações dos Módulos Extraídos
import { SOLIDS_GEOMETRY } from './physics/geometry/SolidsGeometry.jsx';
import { extrairDadosPolyhedron } from './physics/collider/Polyhedron.jsx';
import { determinarFaceSuperior } from './physics/orientation/getTopFace.jsx';
import { useDiceMaterials } from './physics/materials/DiceMaterials.jsx';

export function ChaoMesa() {
   const { viewport } = useThree();
   const w = Math.max(viewport.width * 1.5, 20);
   const d = Math.max(viewport.height * 1.5, 15);

   const [chaoRef] = useBox(() => ({
      type: 'Static',
      args: [w, 0.1, d],
      position: [0, -0.05, 0],
      restitution: 0.1,
      friction: 0.6,
   }));

   return (
      <mesh ref={chaoRef} receiveShadow>
         <boxGeometry args={[w, 0.1, d]} />
         <shadowMaterial opacity={0.3} />
      </mesh>
   );
}

export function DadoFisicoPoliedro({ id, lados = 6, position = [0, 3, 0], onStopped }) {
   const meshRef = useRef(null);
   const velocityRef = useRef([0, 0, 0]);
   const angularVelocityRef = useRef([0, 0, 0]);
   const stateFlags = useRef({ segurando: false, lancado: false, calculado: false, tempoLancamento: 0 });
   const { viewport } = useThree();

   const arrayMateriais = useDiceMaterials(lados);
   const geometriaBase = useMemo(() => {
      const construtor = SOLIDS_GEOMETRY[lados];
      return construtor ? construtor() : new THREE.BoxGeometry(0.75, 0.75, 0.75);
   }, [lados]);
   const dadosCannon = usePolyhedronData(geometriaBase);

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

   useEffect(() => {
      const unsubV = api.velocity.subscribe(v => { velocityRef.current = v; });
      const unsubA = api.angularVelocity.subscribe(av => { angularVelocityRef.current = av; });
      return () => { unsubV(); unsubA(); };
   }, [api]);

   useEffect(() => {
      const soltarMesa = () => {
         if (!stateFlags.current.segurando || stateFlags.current.lancado) return;
         stateFlags.current.lancado = true;
         stateFlags.current.segurando = false;
         stateFlags.current.tempoLancamento = performance.now();

         api.applyImpulse(
            [Math.random() * 6 - 3, -5, Math.random() * 6 - 3],
            [0, 0, 0]
         );
         api.angularVelocity.set(
            Math.random() * 24 - 12,
            Math.random() * 24 - 12,
            Math.random() * 24 - 12
         );
      };
      window.addEventListener('pointerup', soltarMesa);
      return () => window.removeEventListener('pointerup', soltarMesa);
   }, [api]);

   useFrame((state) => {
      const current = stateFlags.current;
      if (current.lancado) {
         if (!current.calculado && (performance.now() - current.tempoLancamento > 1000)) {
            const v = velocityRef.current;
            const av = angularVelocityRef.current;
            const speed = Math.sqrt(v[0]**2 + v[1]**2 + v[2]**2);
            const rotSpeed = Math.sqrt(av[0]**2 + av[1]**2 + av[2]**2);

            if (speed < 0.01 && rotSpeed < 0.01) {
               current.calculado = true;
               api.velocity.set(0, 0, 0);
               api.angularVelocity.set(0, 0, 0);
               const resultado = determinarFaceSuperior(meshRef.current, lados);
               if (onStopped) onStopped(id, resultado, lados);
            }
         }
         return;
      }

      if (current.segurando) {
         api.position.set(
            (state.mouse.x * viewport.width) / 2,
            2.2,
            -(state.mouse.y * viewport.height) / 2
         );
         api.velocity.set(0, 0, 0);
      } else {
         const t = state.clock.getElapsedTime();
         api.velocity.set(0, 0, 0); // Adicione isso para neutralizar a gravidade temporária
         api.angularVelocity.set(0, 0, 0); // Adicione isso
         api.position.set(position[0], position[1] + Math.cos(t * 1.5) * 0.05, position[2]);
      }
   });

   return (
      <mesh
         ref={ref} castShadow receiveShadow
         material={arrayMateriais} geometry={geometriaBase}
         onPointerDown={(e) => {
            e.stopPropagation();
            if (!stateFlags.current.lancado) stateFlags.current.segurando = true;
         }}
      />
   );
}

