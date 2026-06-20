import { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import {useCylinder} from '@react-three/cannon';


export function MoedaFisica({ id, position = [0, 3, 0], onStopped }) {
   const meshRef = useRef(null);
   const velocityRef = useRef([0, 0, 0]);
   const angularVelocityRef = useRef([0, 0, 0]);
   const stateFlags = useRef({ segurando: false, lancado: false, calculado: false, tempoLancamento: 0 });
   const { viewport } = useThree();

   const materiaisMoeda = useMemo(() => {
      const criarTexturaMoeda = (texto, corTexto, corFundo) => {
         const canvas = document.createElement('canvas');
         canvas.width = 512; canvas.height = 512;
         const ctx = canvas.getContext('2d');
         ctx.fillStyle = corFundo; ctx.fillRect(0, 0, 512, 512);
         ctx.fillStyle = corTexto;
         ctx.font = 'bold 75px "Cinzel", sans-serif';
         ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
         ctx.fillText(texto, 256, 256);
         ctx.strokeStyle = corTexto; ctx.lineWidth = 16;
         ctx.beginPath(); ctx.arc(256, 256, 210, 0, Math.PI * 2); ctx.stroke();
         return new THREE.CanvasTexture(canvas);
      };
      return [
         new THREE.MeshStandardMaterial({ color: '#b59228', roughness: 0.3, metalness: 0.8 }),
         new THREE.MeshStandardMaterial({ map: criarTexturaMoeda('CARA', '#ffeed0', '#8a6516'), roughness: 0.15, metalness: 0.85 }),
         new THREE.MeshStandardMaterial({ map: criarTexturaMoeda('COROA', '#1f1603', '#cfa332'), roughness: 0.15, metalness: 0.85 }),
      ];
   }, []);

   const [ref, api] = useCylinder(() => ({
      mass: 2.8, position, args: [0.55, 0.55, 0.08, 32], linearDamping: 0.45, angularDamping: 0.45,
   }), meshRef);

   useEffect(() => {
      const unsubV = api.velocity.subscribe(v => { velocityRef.current = v; });
      const unsubA = api.angularVelocity.subscribe(av => { angularVelocityRef.current = av; });
      return () => { unsubV(); unsubA(); };
   }, [api]);

   useEffect(() => {
      const soltarMoeda = () => {
         if (!stateFlags.current.segurando || stateFlags.current.lancado) return;
         stateFlags.current.lancado = true;
         stateFlags.current.segurando = false;
         stateFlags.current.tempoLancamento = performance.now();
         api.applyImpulse(
            [Math.random() * 4 - 2, -5, Math.random() * 4 - 2],
            [0, 0, 0]
         );
         api.angularVelocity.set(
            Math.random() * 40 - 20,
            Math.random() * 2,
            Math.random() * 40 - 20
         );
      };
      window.addEventListener('pointerup', soltarMoeda);
      return () => window.removeEventListener('pointerup', soltarMoeda);
   }, [api]);

   useFrame((state) => {
      const current = stateFlags.current;
      if (current.lancado) {
         if (!current.calculado && (performance.now() - current.tempoLancamento > 900)) {
            const v = velocityRef.current;
            const av = angularVelocityRef.current;
            const speed = Math.sqrt(v[0]**2 + v[1]**2 + v[2]**2);
            const rotSpeed = Math.sqrt(av[0]**2 + av[1]**2 + av[2]**2);

            if (speed < 0.01 && rotSpeed < 0.01) {
               current.calculado = true;
               api.velocity.set(0, 0, 0);
               api.angularVelocity.set(0, 0, 0);

               meshRef.current.updateMatrixWorld(true);
               const q = new THREE.Quaternion();
               meshRef.current.getWorldQuaternion(q);
               
               const localUp = new THREE.Vector3(0, 1, 0).applyQuaternion(q);
               const resultado = localUp.y > 0 ? 'Cara' : 'Coroa';
               if (onStopped) onStopped(id, resultado, 2);
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
         api.position.set(position[0], position[1] + Math.cos(t * 1.5) * 0.05, position[2]);
      }
   });

   return (
      <mesh
         ref={ref} castShadow receiveShadow material={materiaisMoeda}
         onPointerDown={(e) => {
            e.stopPropagation();
            if (!stateFlags.current.lancado) stateFlags.current.segurando = true;
         }}
      >
         <cylinderGeometry args={[0.55, 0.55, 0.08, 32]} />
      </mesh>
   );
}