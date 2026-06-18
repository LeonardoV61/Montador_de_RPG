import { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useBox, useCylinder, useConvexPolyhedron } from '@react-three/cannon';
import * as THREE from 'three';

// ─────────────────────────────────────────────────────────────────
// HELPERS & UV GENERATION
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

function applyPentagonUVs(geo) {
   const pos = geo.attributes.position;
   const uvs = new Float32Array((pos.count / 3) * 6);
   
   for (let i = 0; i < pos.count; i += 9) {
      const idx = (i / 3) * 6;
      // Triangle 1
      uvs[idx]     = 0.5;  uvs[idx + 1] = 0.5;
      uvs[idx + 2] = 0.1;  uvs[idx + 3] = 0.2;
      uvs[idx + 4] = 0.9;  uvs[idx + 5] = 0.2;
      // Triangle 2
      uvs[idx + 6] = 0.5;  uvs[idx + 7] = 0.5;
      uvs[idx + 8] = 0.9;  uvs[idx + 9] = 0.2;
      uvs[idx + 10]= 0.7;  uvs[idx + 11]= 0.9;
      // Triangle 3
      uvs[idx + 12]= 0.5;  uvs[idx + 13]= 0.5;
      uvs[idx + 14]= 0.7;  uvs[idx + 15]= 0.9;
      uvs[idx + 16]= 0.3;  uvs[idx + 17]= 0.9;
   }
   geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
   return geo;
}

// ─────────────────────────────────────────────────────────────────
// POLYHEDRON GEOMETRY BUILDERS
// ─────────────────────────────────────────────────────────────────

function buildD10Geometry() {
  const geometry = new THREE.BufferGeometry();

  const r = 1;
  const h = 0.3;
  const hTop = 1;

  const vertices = [];

  // topo e base
  vertices.push([0, hTop, 0]);   // 0
  vertices.push([0, -hTop, 0]);  // 1

  // anel superior (5)
  for (let i = 0; i < 5; i++) {
    const angle = (i * 2 * Math.PI) / 5;
    vertices.push([Math.cos(angle) * r, h, Math.sin(angle) * r]);
  }

  // anel inferior (offset)
  for (let i = 0; i < 5; i++) {
    const angle = ((i + 0.5) * 2 * Math.PI) / 5;
    vertices.push([Math.cos(angle) * r, -h, Math.sin(angle) * r]);
  }

  const faces = [];

  for (let i = 0; i < 5; i++) {
    const a = 2 + i;
    const b = 2 + ((i + 1) % 5);
    const c = 7 + i;
    const d = 7 + ((i + 1) % 5);

    // cada face real = 2 triângulos CORRETOS
    faces.push([a, c, b]);
    faces.push([b, c, d]);

    faces.push([0, a, b]); // topo
    faces.push([1, d, c]); // base (invertido)
  }

  const positions = [];
  faces.flat().forEach(i => {
    positions.push(...vertices[i]);
  });

  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(positions, 3)
  );

  geometry.computeVertexNormals();

  const geo = geometry.toNonIndexed();
  geo.clearGroups();

  const faceCount = geo.attributes.position.count / 3;

  // ✅ UV MELHORADO (ainda simples, mas correto por face)
  const uvs = [];

  for (let i = 0; i < faceCount; i++) {
    uvs.push(
      0.1, 0.1,
      0.9, 0.1,
      0.5, 0.9
    );
    geo.addGroup(i * 3, 3, i % 10);
  }

  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));

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
      applyTriangleUVs(geo);
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
// CANNON POLYHEDRON PARSER
// ─────────────────────────────────────────────────────────────────

function extrairDadosPolyhedron(geometry) {
   const geo = geometry.index ? geometry.toNonIndexed() : geometry.clone();
   const posAttr = geo.attributes.position;

   const PREC = 4;
   const snap = (v) => Number(v.toFixed(PREC));

   const vertices = [];
   const faces = [];
   const vertexMap = {};
   let vCounter = 0;

   const centroid = new THREE.Vector3();
   for (let i = 0; i < posAttr.count; i++) {
      centroid.x += posAttr.getX(i);
      centroid.y += posAttr.getY(i);
      centroid.z += posAttr.getZ(i);
   }
   centroid.divideScalar(posAttr.count);

   const _vA = new THREE.Vector3();
   const _vB = new THREE.Vector3();
   const _vC = new THREE.Vector3();
   const _edge1 = new THREE.Vector3();
   const _edge2 = new THREE.Vector3();
   const _normal = new THREE.Vector3();
   const _toFace = new THREE.Vector3();

   for (let i = 0; i < posAttr.count; i += 3) {
      _vA.fromBufferAttribute(posAttr, i);
      _vB.fromBufferAttribute(posAttr, i + 1);
      _vC.fromBufferAttribute(posAttr, i + 2);

      const getOrAdd = (v) => {
         const key = `${snap(v.x)}_${snap(v.y)}_${snap(v.z)}`;
         if (vertexMap[key] === undefined) {
            vertexMap[key] = vCounter;
            vertices.push([snap(v.x), snap(v.y), snap(v.z)]);
            vCounter++;
         }
         return vertexMap[key];
      };

      const ia = getOrAdd(_vA);
      const ib = getOrAdd(_vB);
      const ic = getOrAdd(_vC);

      if (ia === ib || ib === ic || ia === ic) continue;

      _edge1.subVectors(_vB, _vA);
      _edge2.subVectors(_vC, _vA);
      _normal.crossVectors(_edge1, _edge2);
      _toFace.addVectors(_vA, _vB).add(_vC).divideScalar(3).sub(centroid);

      if (_normal.dot(_toFace) >= 0) {
         faces.push([ia, ib, ic]);
      } else {
         faces.push([ia, ic, ib]);
      }
   }

   return { vertices, faces };
}

// ─────────────────────────────────────────────────────────────────
// TEXTURES
// ─────────────────────────────────────────────────────────────────

const gerarArrayMateriaisDados = (lados) => {
   const materiais = [];
   for (let i = 1; i <= lados; i++) {
      const canvas = document.createElement('canvas');
      canvas.width = 512; canvas.height = 512;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#1a1310';
      ctx.fillRect(0, 0, 512, 512);

      const grad = ctx.createRadialGradient(256, 256, 50, 256, 256, 300);
      grad.addColorStop(0, '#241a15');
      grad.addColorStop(1, '#0b0807');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);

      ctx.strokeStyle = 'rgba(201, 162, 39, 0.8)';
      ctx.lineWidth = 14;

      if (lados === 4) {
         ctx.fillStyle = '#ffeed0';
         ctx.font = 'bold 50px "Times New Roman", serif';
         ctx.textAlign = 'center';
         const arrTriades = [["1","2","3"],["1","4","2"],["1","3","4"],["2","4","3"]];
         const [nTopo, nEsq, nDir] = arrTriades[(i - 1) % 4];
         ctx.fillText(nTopo, 256, 85);
         ctx.save(); ctx.translate(110,400); ctx.rotate(Math.PI/3); ctx.fillText(nEsq, 0, 0); ctx.restore();
         ctx.save(); ctx.translate(402,400); ctx.rotate(-Math.PI/3); ctx.fillText(nDir, 0, 0); ctx.restore();
         ctx.beginPath(); ctx.moveTo(256,20); ctx.lineTo(492,440); ctx.lineTo(20,440); ctx.closePath(); ctx.stroke();
      } else if (lados === 6) {
         ctx.beginPath(); ctx.rect(30,30,452,452); ctx.stroke();
         ctx.fillStyle = '#ffeed0';
         ctx.font = 'bold 190px "Times New Roman", Georgia, serif';
         ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
         ctx.fillText(i.toString(), 256, 265);
         if (i === 6) { ctx.fillStyle='#c9a227'; ctx.fillRect(176,390,160,16); }
      } else {
         ctx.beginPath(); ctx.moveTo(256,40); ctx.lineTo(470,420); ctx.lineTo(42,420); ctx.closePath(); ctx.stroke();
         ctx.fillStyle = '#ffeed0';
         ctx.font = 'bold 140px "Times New Roman", Georgia, serif';
         ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
         ctx.fillText(i.toString(), 256, 275);
         if (i === 6 || i === 9) { ctx.fillStyle='#c9a227'; ctx.fillRect(186,370,140,12); }
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.anisotropy = 4;

      materiais.push(new THREE.MeshStandardMaterial({
         map: tex, roughness: 0.15, metalness: 0.08, envMapIntensity: 1.2
      }));
   }
   return materiais;
};

// ─────────────────────────────────────────────────────────────────
// ORIENTATION LOGIC
// ─────────────────────────────────────────────────────────────────

function determinarFaceSuperior(mesh, lados) {
   if (!mesh) return 1;
   mesh.updateMatrixWorld(true);

   const worldUp = new THREE.Vector3(0, 1, 0);
   const q = new THREE.Quaternion().setFromRotationMatrix(mesh.matrixWorld);

   if (lados === 6) {
      const faceMap = [
         { local: new THREE.Vector3( 1, 0, 0), value: 2 },
         { local: new THREE.Vector3(-1, 0, 0), value: 5 },
         { local: new THREE.Vector3( 0, 1, 0), value: 3 },
         { local: new THREE.Vector3( 0,-1, 0), value: 4 },
         { local: new THREE.Vector3( 0, 0, 1), value: 1 },
         { local: new THREE.Vector3( 0, 0,-1), value: 6 },
      ];
      let maxDot = -Infinity;
      let best = 1;
      const worldNormal = new THREE.Vector3();
      faceMap.forEach(({ local, value }) => {
         worldNormal.copy(local).applyQuaternion(q);
         const dot = worldNormal.dot(worldUp);
         if (dot > maxDot) { maxDot = dot; best = value; }
      });
      return best;
   }

   const posAttr = mesh.geometry.attributes.position;
   if (!posAttr) return 1;

   const vA = new THREE.Vector3();
   const vB = new THREE.Vector3();
   const vC = new THREE.Vector3();
   const e1 = new THREE.Vector3();
   const e2 = new THREE.Vector3();
   const localNormal = new THREE.Vector3();
   const worldNormal = new THREE.Vector3();

   let maxDot = -Infinity;
   let faceVencedora = 1;

   for (let i = 0; i < posAttr.count; i += 3) {
      vA.fromBufferAttribute(posAttr, i);
      vB.fromBufferAttribute(posAttr, i + 1);
      vC.fromBufferAttribute(posAttr, i + 2);

      e1.subVectors(vB, vA);
      e2.subVectors(vC, vA);
      localNormal.crossVectors(e1, e2).normalize();
      worldNormal.copy(localNormal).applyQuaternion(q);

      const dot = worldNormal.dot(worldUp);
      if (dot > maxDot) {
         maxDot = dot;
         const group = mesh.geometry.groups.find(
            g => g.start <= i && (g.start + g.count) > i
         );
         if (group !== undefined) {
            faceVencedora = group.materialIndex + 1;
         }
      }
   }
   return faceVencedora;
}

// ─────────────────────────────────────────────────────────────────
// COMPONENTS
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
         api.position.set(position[0], position[1] + Math.sin(t * 2) * 0.05, position[2]);
         api.rotation.set(0, t * 0.4, 0);
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