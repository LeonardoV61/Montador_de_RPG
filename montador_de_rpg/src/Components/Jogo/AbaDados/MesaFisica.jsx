import { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useBox, useCylinder, useConvexPolyhedron } from '@react-three/cannon';
import * as THREE from 'three';

// Importações dos Módulos Extraídos
import { buildD10Geometry } from './physics/geometry/d10.js';
import { extrairDadosPolyhedron } from './physics/collider/polyhedron.js';
import { determinarFaceSuperior } from './physics/orientation/getTopFace.js';
import { gerarArrayMateriaisDados } from './physics/materials/diceMaterials.js';

// ─────────────────────────────────────────────────────────────────
// HELPERS, UV GENERATION & LOCAL GEOMETRIES
// ─────────────────────────────────────────────────────────────────

function applyTriangleUVs(geo) {
   const pos = geo.attributes.position;
   const uvs = new Float32Array((pos.count / 3) * 6);
   for (let i = 0; i < pos.count; i += 3) {
      const idx = (i / 3) * 6;
      uvs[idx]     = 0.05; uvs[idx + 1] = 0.05;
      uvs[idx + 2] = 0.95; uvs[idx + 3] = 0.05;
      uvs[idx + 4] = 0.50; uvs[idx + 5] = 0.95;
   }
   geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
   return geo;
}

// ✨ NOVA FUNÇÃO: Mapeamento Inteligente e Perfeito para d4 baseado em Topologia
function applyD4UVs(geo) {
   const pos = geo.attributes.position;
   const uvs = new Float32Array(pos.count * 2);

   const uniqueCorners = [];
   const PREC = 4;
   for (let i = 0; i < pos.count; i++) {
      const x = Number(pos.getX(i).toFixed(PREC));
      const y = Number(pos.getY(i).toFixed(PREC));
      const z = Number(pos.getZ(i).toFixed(PREC));
      
      if (!uniqueCorners.some(c => c.x === x && c.y === y && c.z === z)) {
         uniqueCorners.push({ x, y, z, id: uniqueCorners.length, faces: [] });
      }
   }

   for (let f = 0; f < 4; f++) {
      for (let v = 0; v < 3; v++) {
         const idx = f * 3 + v;
         const x = Number(pos.getX(idx).toFixed(PREC));
         const y = Number(pos.getY(idx).toFixed(PREC));
         const z = Number(pos.getZ(idx).toFixed(PREC));
         const corner = uniqueCorners.find(c => c.x === x && c.y === y && c.z === z);
         if (corner && !corner.faces.includes(f)) {
            corner.faces.push(f);
         }
      }
   }

   const cornerToNumber = {};
   uniqueCorners.forEach(c => {
      const f = c.faces;
      if (f.includes(0) && f.includes(1) && f.includes(2)) cornerToNumber[c.id] = "1";
      else if (f.includes(0) && f.includes(1) && f.includes(3)) cornerToNumber[c.id] = "2";
      else if (f.includes(0) && f.includes(2) && f.includes(3)) cornerToNumber[c.id] = "3";
      else if (f.includes(1) && f.includes(2) && f.includes(3)) cornerToNumber[c.id] = "4";
   });

   const arrTriades = [["1","2","3"], ["1","4","2"], ["1","3","4"], ["2","4","3"]];

   for (let f = 0; f < 4; f++) {
      const [nTopo, nEsq, nDir] = arrTriades[f];
      
      for (let v = 0; v < 3; v++) {
         const idx = f * 3 + v;
         const x = Number(pos.getX(idx).toFixed(PREC));
         const y = Number(pos.getY(idx).toFixed(PREC));
         const z = Number(pos.getZ(idx).toFixed(PREC));
         const corner = uniqueCorners.find(c => c.x === x && c.y === y && c.z === z);
         const numDoCanto = cornerToNumber[corner.id];

         const uIdx = idx * 2;
         if (numDoCanto === nTopo) {
            uvs[uIdx] = 0.50; uvs[uIdx + 1] = 0.95; // Topo central do triângulo
         } else if (numDoCanto === nEsq) {
            uvs[uIdx] = 0.05; uvs[uIdx + 1] = 0.05; // Base Esquerda do triângulo
         } else if (numDoCanto === nDir) {
            uvs[uIdx] = 0.95; uvs[uIdx + 1] = 0.05; // Base Direita do triângulo
         }
      }
   }

   geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
   return geo;
}

function applyPentagonUVs(geo) {
   const pos = geo.attributes.position;
   const uvs = new Float32Array((pos.count / 3) * 6);
   
   for (let i = 0; i < pos.count; i += 9) {
      const idx = (i / 3) * 6;
      uvs[idx]     = 0.5;  uvs[idx + 1] = 0.5;
      uvs[idx + 2] = 0.1;  uvs[idx + 3] = 0.2;
      uvs[idx + 4] = 0.9;  uvs[idx + 5] = 0.2;
      uvs[idx + 6] = 0.5;  uvs[idx + 7] = 0.5;
      uvs[idx + 8] = 0.9;  uvs[idx + 9] = 0.2;
      uvs[idx + 10]= 0.7;  uvs[idx + 11]= 0.9;
      uvs[idx + 12]= 0.5;  uvs[idx + 13]= 0.5;
      uvs[idx + 14]= 0.7;  uvs[idx + 15]= 0.9;
      uvs[idx + 16]= 0.3;  uvs[idx + 17]= 0.9;
   }
   geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
   return geo;
}

function buildD12Geometry() {
   const geo = new THREE.DodecahedronGeometry(0.75).toNonIndexed();
   const pos = geo.attributes.position;
   
   // Snap vertices to fix floating-point noise causing Cannon jitter
   for (let i = 0; i < pos.count; i++) {
      pos.setXYZ(i,
         Math.round(pos.getX(i) * 1e5) / 1e5,
         Math.round(pos.getY(i) * 1e5) / 1e5,
         Math.round(pos.getZ(i) * 1e5) / 1e5
      );
   }
   pos.needsUpdate = true;
   geo.computeVertexNormals();
   applyPentagonUVs(geo);

   geo.clearGroups();
   for (let i = 0; i < 12; i++) {
      geo.addGroup(i * 9, 9, i);
   }
   return geo;
}

const SOLIDS_GEOMETRY = {
   4: () => {
      const geo = new THREE.TetrahedronGeometry(0.85).toNonIndexed();
      applyD4UVs(geo); // 🌟 Trocado aqui para usar a função corrigida do d4
      geo.clearGroups();
      for (let i = 0; i < 4; i++) geo.addGroup(i * 3, 3, i);
      return geo;
   },
   6: () => new THREE.BoxGeometry(0.75, 0.75, 0.75),
   8: () => {
      const geo = new THREE.OctahedronGeometry(0.8).toNonIndexed();
      applyTriangleUVs(geo);
      geo.clearGroups();
      for (let i = 0; i < 8; i++) geo.addGroup(i * 3, 3, i);
      return geo;
   },
   10: buildD10Geometry,
   12: buildD12Geometry,
   20: () => {
      const geo = new THREE.IcosahedronGeometry(0.8).toNonIndexed();
      applyTriangleUVs(geo);
      geo.clearGroups();
      for (let i = 0; i < 20; i++) geo.addGroup(i * 3, 3, i);
      return geo;
   },
};

// ─────────────────────────────────────────────────────────────────
// COMPONENTS (MesaFisica, DadoFisicoPoliedro, MoedaFisica seguem abaixo sem alterações internas)
// ─────────────────────────────────────────────────────────────────

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

   const arrayMateriais = useMemo(() => gerarArrayMateriaisDados(lados), [lados]);
   const geometriaBase = useMemo(() => SOLIDS_GEOMETRY[lados](), [lados]);
   const dadosCannon = useMemo(() => extrairDadosPolyhedron(geometriaBase), [geometriaBase]);

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