import { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useBox, useCylinder } from '@react-three/cannon';
import * as THREE from 'three';

// ─── Texturas procedurais ─────────────────────────────────────────────────────

function criarTexturaFace(numero, lados) {
   const canvas = document.createElement('canvas');
   canvas.width = 256; canvas.height = 256;
   const ctx = canvas.getContext('2d');
   ctx.fillStyle = '#1a1410';
   ctx.fillRect(0, 0, 256, 256);
   ctx.strokeStyle = '#c9a227';
   ctx.lineWidth = 8;
   ctx.strokeRect(12, 12, 232, 232);
   ctx.fillStyle = '#ffdf7a';
   ctx.font = `bold ${numero >= 10 ? 100 : 120}px serif`;
   ctx.textAlign = 'center';
   ctx.textBaseline = 'middle';
   ctx.fillText(String(numero), 128, 128);
   ctx.fillStyle = '#8a6e2e';
   ctx.font = '32px serif';
   ctx.fillText(`d${lados}`, 128, 220);
   return new THREE.CanvasTexture(canvas);
}

function criarTexturaCara() {
   const canvas = document.createElement('canvas');
   canvas.width = 256; canvas.height = 256;
   const ctx = canvas.getContext('2d');
   ctx.fillStyle = '#b8960c';
   ctx.fillRect(0, 0, 256, 256);
   ctx.beginPath();
   ctx.arc(128, 128, 110, 0, Math.PI * 2);
   ctx.fillStyle = '#d4af37'; ctx.fill();
   ctx.strokeStyle = '#8a6e1a'; ctx.lineWidth = 6; ctx.stroke();
   ctx.fillStyle = '#3a2800';
   ctx.font = 'bold 52px serif';
   ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
   ctx.fillText('CARA', 128, 128);
   return new THREE.CanvasTexture(canvas);
}

function criarTexturaCoroa() {
   const canvas = document.createElement('canvas');
   canvas.width = 256; canvas.height = 256;
   const ctx = canvas.getContext('2d');
   ctx.fillStyle = '#b8960c';
   ctx.fillRect(0, 0, 256, 256);
   ctx.beginPath();
   ctx.arc(128, 128, 110, 0, Math.PI * 2);
   ctx.fillStyle = '#c9a227'; ctx.fill();
   ctx.strokeStyle = '#8a6e1a'; ctx.lineWidth = 6; ctx.stroke();
   ctx.fillStyle = '#3a2800';
   ctx.font = 'bold 80px serif';
   ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
   ctx.fillText('♛', 128, 128);
   return new THREE.CanvasTexture(canvas);
}

function criarTexturaBorda() {
   const c = document.createElement('canvas');
   c.width = 64; c.height = 64;
   const ctx = c.getContext('2d');
   for (let i = 0; i < 64; i += 4) {
      ctx.fillStyle = i % 8 === 0 ? '#c9a227' : '#8a6010';
      ctx.fillRect(0, i, 64, 4);
   }
   return new THREE.CanvasTexture(c);
}

// ─── Geometrias memoizadas ────────────────────────────────────────────────────

function usarGeometriaDado(lados) {
   return useMemo(() => {
      switch (lados) {
         case 4:  return new THREE.TetrahedronGeometry(0.65);
         case 6:  return new THREE.BoxGeometry(0.75, 0.75, 0.75);
         case 8:  return new THREE.OctahedronGeometry(0.65);
         case 10: return new THREE.IcosahedronGeometry(0.58, 0);
         case 12: return new THREE.DodecahedronGeometry(0.65);
         case 20: return new THREE.IcosahedronGeometry(0.65);
         default: return new THREE.IcosahedronGeometry(0.65);
      }
   }, [lados]);
}

// ─── Hook: ouve pointerup no window para capturar soltura fora do mesh ────────
// FIX PRINCIPAL: onPointerUp do R3F só dispara se o mouse estiver sobre o mesh.
// Se o usuário mover o mouse mesmo 1px durante o clique, o evento se perde.
// Solução: registrar o listener diretamente no window e chamar o callback
// apenas se o componente estiver no estado "segurando".
function usarPointerUpGlobal(callback) {
   const cbRef = useRef(callback);
   cbRef.current = callback;

   useEffect(() => {
      const handler = (e) => cbRef.current(e);
      window.addEventListener('pointerup', handler);
      return () => window.removeEventListener('pointerup', handler);
   }, []);
}

// ─── Chão invisível ───────────────────────────────────────────────────────────

export function ChaoMesa() {
   const [ref] = useBox(() => ({
      type: 'Static', args: [40, 0.1, 40], position: [0, -0.05, 0],
   }));
   return (
      <mesh ref={ref} receiveShadow>
         <boxGeometry args={[40, 0.1, 40]} />
         <shadowMaterial opacity={0.5} />
      </mesh>
   );
}

// ─── Dado poliedro físico ─────────────────────────────────────────────────────

export function DadoFisicoPoliedro({ lados, position, onStopped }) {
   const { viewport } = useThree();

   const segurando  = useRef(false);
   const lancado    = useRef(false);
   const calculado  = useRef(false);
   const mouseVelocidade = useRef({ x: 0, z: 0 });
   const ultimoMouse     = useRef({ x: 0, y: 0, tempo: Date.now() });

   const [hovered, setHovered]       = useState(false);
   const [pegando, setPegando]       = useState(false);   // apenas para cursor
   const [foiLancado, setFoiLancado] = useState(false);   // dispara useEffect

   const geometria = usarGeometriaDado(lados);
   const textura   = useMemo(() => criarTexturaFace(lados, lados), [lados]);

   const [ref, api] = useBox(() => ({
      mass: 1.5,
      position,
      args: [0.75, 0.75, 0.75],
      linearDamping: 0.5,
      angularDamping: 0.5,
   }), useRef(null));

   // Cursor
   useEffect(() => {
      document.body.style.cursor = hovered ? (pegando ? 'grabbing' : 'grab') : 'default';
      return () => { document.body.style.cursor = 'default'; };
   }, [hovered, pegando]);

   // Detecção de parada — dispara uma vez quando foiLancado vira true
   useEffect(() => {
      if (!foiLancado || calculado.current) return;

      // Buffer de 400ms para o Cannon registrar o impulso inicial
      const timeout = setTimeout(() => {
         const unsubVel = api.velocity.subscribe((v) => {
            if (calculado.current) { unsubVel(); return; }
            const velMag = Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2);
            if (velMag >= 0.05) return;

            const unsubAng = api.angularVelocity.subscribe((a) => {
               if (calculado.current) { unsubAng(); return; }
               const angMag = Math.sqrt(a[0] ** 2 + a[1] ** 2 + a[2] ** 2);
               if (angMag >= 0.05) return;

               calculado.current = true;
               unsubVel();
               unsubAng();
               const valor = Math.floor(Math.random() * lados) + 1;
               if (onStopped) onStopped(valor);
            });
         });
         return () => unsubVel();
      }, 400);

      return () => clearTimeout(timeout);
   }, [foiLancado]);

   // FIX: ouve soltura no window — captura mesmo se o mouse saiu do mesh
   usarPointerUpGlobal(() => {
      if (!segurando.current || lancado.current) return;

      const forçaX = Math.min(Math.max(mouseVelocidade.current.x * 2.5, -10), 10);
      const forçaZ = Math.min(Math.max(-mouseVelocidade.current.z * 2.5, -10), 10);

      // Para de anular a gravidade no useFrame — Cannon assume o controle
      lancado.current   = true;
      segurando.current = false;
      setPegando(false);

      api.applyImpulse([forçaX, -3, forçaZ], [0, 0, 0]);
      api.angularVelocity.set(
         Math.random() * 18 - 9,
         Math.random() * 24,
         Math.random() * 18 - 9
      );

      setFoiLancado(true);
   });

   useFrame((state) => {
      const agora = Date.now();
      const dt = (agora - ultimoMouse.current.tempo) / 1000;
      if (dt > 0) {
         mouseVelocidade.current.x = (state.mouse.x - ultimoMouse.current.x) / dt;
         mouseVelocidade.current.z = (state.mouse.y - ultimoMouse.current.y) / dt;
      }
      ultimoMouse.current = { x: state.mouse.x, y: state.mouse.y, tempo: agora };

      // Lançado: Cannon controla tudo, não interferir
      if (lancado.current) return;

      const t = state.clock.getElapsedTime();

      if (segurando.current) {
         const mX = (state.mouse.x * viewport.width) / 2;
         const mZ = -(state.mouse.y * viewport.height) / 2;
         api.position.set(mX, 2.2, mZ);
         api.velocity.set(0, 0, 0);
         api.angularVelocity.set(0, 0, 0);
         api.rotation.set(t * 5, t * 3.5, t * 2);
      } else {
         // Idle: anula gravidade manualmente a cada frame
         api.position.set(position[0], position[1] + Math.sin(t * 2) * 0.06, position[2]);
         api.velocity.set(0, 0, 0);
         api.angularVelocity.set(0, 0, 0);
         api.rotation.set(0, t * 0.4, 0);
      }
   });

   return (
      <mesh
         ref={ref} castShadow receiveShadow
         onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
         onPointerOut={(e)  => { e.stopPropagation(); setHovered(false); }}
         onPointerDown={(e) => {
            e.stopPropagation();
            if (lancado.current) return;
            segurando.current = true;
            setPegando(true);
         }}
         // onPointerUp removido — substituído pelo listener global no window
      >
         <primitive object={geometria} attach="geometry" />
         <meshStandardMaterial map={textura} color="#2a221b" roughness={0.25} metalness={0.15} />
         <lineSegments>
            <edgesGeometry args={[geometria]} />
            <lineBasicMaterial color="#c9a227" linewidth={1} />
         </lineSegments>
      </mesh>
   );
}

// ─── Moeda física ─────────────────────────────────────────────────────────────

export function MoedaFisica({ position, onStopped }) {
   const { viewport } = useThree();

   const segurando  = useRef(false);
   const lancado    = useRef(false);
   const calculado  = useRef(false);
   const mouseVelocidade = useRef({ x: 0, z: 0 });
   const ultimoMouse     = useRef({ x: 0, y: 0, tempo: Date.now() });

   const [hovered, setHovered]       = useState(false);
   const [pegando, setPegando]       = useState(false);
   const [foiLancado, setFoiLancado] = useState(false);

   const texturaCara  = useMemo(() => criarTexturaCara(), []);
   const texturaCoroa = useMemo(() => criarTexturaCoroa(), []);
   const texturaBorda = useMemo(() => criarTexturaBorda(), []);

   const [ref, api] = useCylinder(() => ({
      mass: 1.0,
      position,
      // FIX moeda: args do useCylinder são [radiusTopo, raioBase, altura, segmentos]
      // O cylinderGeometry no JSX deve ter os mesmos valores
      args: [0.5, 0.5, 0.1, 32],
      linearDamping: 0.4,
      angularDamping: 0.4,
   }), useRef(null));

   useEffect(() => {
      document.body.style.cursor = hovered ? (pegando ? 'grabbing' : 'grab') : 'default';
      return () => { document.body.style.cursor = 'default'; };
   }, [hovered, pegando]);

   useEffect(() => {
      if (!foiLancado || calculado.current) return;

      const timeout = setTimeout(() => {
         const unsubVel = api.velocity.subscribe((v) => {
            if (calculado.current) { unsubVel(); return; }
            const velMag = Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2);
            if (velMag >= 0.05) return;

            const unsubAng = api.angularVelocity.subscribe((a) => {
               if (calculado.current) { unsubAng(); return; }
               const angMag = Math.sqrt(a[0] ** 2 + a[1] ** 2 + a[2] ** 2);
               if (angMag >= 0.05) return;

               calculado.current = true;
               unsubVel();
               unsubAng();
               const resultado = Math.random() > 0.5 ? 'Cara' : 'Coroa';
               if (onStopped) onStopped(resultado);
            });
         });
         return () => unsubVel();
      }, 400);

      return () => clearTimeout(timeout);
   }, [foiLancado]);

   // FIX: mesmo padrão — listener global no window para capturar soltura
   usarPointerUpGlobal(() => {
      if (!segurando.current || lancado.current) return;

      const forçaX = Math.min(Math.max(mouseVelocidade.current.x * 2.0, -8), 8);
      const forçaZ = Math.min(Math.max(-mouseVelocidade.current.z * 2.0, -8), 8);

      lancado.current   = true;
      segurando.current = false;
      setPegando(false);

      // FIX moeda: impulso com componente Y negativo forte para ela cair e rolar
      // Velocidade angular maior em X e Z para flip realista (cara/coroa)
      api.applyImpulse([forçaX, -2, forçaZ], [0, 0, 0]);
      api.angularVelocity.set(
         Math.random() * 35 - 5,   // flip no eixo X (rotação de cara/coroa)
         Math.random() * 5,         // leve giro lateral
         Math.random() * 35 - 5    // flip no eixo Z
      );

      setFoiLancado(true);
   });

   useFrame((state) => {
      const agora = Date.now();
      const dt = (agora - ultimoMouse.current.tempo) / 1000;
      if (dt > 0) {
         mouseVelocidade.current.x = (state.mouse.x - ultimoMouse.current.x) / dt;
         mouseVelocidade.current.z = (state.mouse.y - ultimoMouse.current.y) / dt;
      }
      ultimoMouse.current = { x: state.mouse.x, y: state.mouse.y, tempo: agora };

      // Lançada: Cannon controla — não interferir
      if (lancado.current) return;

      const t = state.clock.getElapsedTime();

      if (segurando.current) {
         const mX = (state.mouse.x * viewport.width) / 2;
         const mZ = -(state.mouse.y * viewport.height) / 2;
         api.position.set(mX, 2.2, mZ);
         api.velocity.set(0, 0, 0);
         api.angularVelocity.set(0, 0, 0);
         // FIX: rotação de preview da moeda — gira apenas no eixo Y (de topo)
         // para não confundir com o flip de cara/coroa
         api.rotation.set(Math.PI / 2, t * 6, 0);
      } else {
         // Idle: anula gravidade manualmente
         api.position.set(position[0], position[1] + Math.cos(t * 1.8) * 0.05, position[2]);
         api.velocity.set(0, 0, 0);
         api.angularVelocity.set(0, 0, 0);
         api.rotation.set(Math.PI / 2.5, t * 0.5, 0);
      }
   });

   return (
      <mesh
         ref={ref} castShadow receiveShadow
         onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
         onPointerOut={(e)  => { e.stopPropagation(); setHovered(false); }}
         onPointerDown={(e) => {
            e.stopPropagation();
            if (lancado.current) return;
            segurando.current = true;
            setPegando(true);
         }}
         // onPointerUp removido — substituído pelo listener global no window
      >
         <cylinderGeometry args={[0.5, 0.5, 0.1, 32]} />
         {/* Three.js CylinderGeometry grupos: 0=lateral, 1=topo(cara), 2=base(coroa) */}
         <meshStandardMaterial attach="material-0" map={texturaBorda}  metalness={0.85} roughness={0.15} />
         <meshStandardMaterial attach="material-1" map={texturaCara}   metalness={0.6}  roughness={0.3}  />
         <meshStandardMaterial attach="material-2" map={texturaCoroa}  metalness={0.6}  roughness={0.3}  />
      </mesh>
   );
}