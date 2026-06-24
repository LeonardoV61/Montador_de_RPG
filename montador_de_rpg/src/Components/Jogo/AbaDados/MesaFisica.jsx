import { useBox } from '@react-three/cannon';
import { useThree } from '@react-three/fiber';

/**
 * MesaFisica.jsx
 * Responsabilidade única: cenário físico estático onde os dados/moedas rolam.
 * Inclui o chão e as paredes invisíveis que impedem os objetos de saírem da mesa.
 * A física dos objetos que rolam (dado/moeda) vive em physics/objects/DadoFisico.jsx.
 */

const ALTURA_PAREDE = 8;         // FIX: era 4 — dados com impulso alto pulavam por cima
const ESPESSURA_PAREDE = 0.5;
const Y_CHAO = -0.05;            // FIX: centralizado para eliminar micro-gap nos cantos

export function ChaoMesa() {
   const { viewport } = useThree();
   const w = Math.max(viewport.width * 1.5, 20);
   const d = Math.max(viewport.height * 1.5, 15);

   const [chaoRef] = useBox(() => ({
      type: 'Static',
      args: [w, 0.1, d],
      position: [0, Y_CHAO, 0],
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

/**
 * Parede invisível única (sem mesh visível, só colisor).
 * Usada pelas 4 bordas da mesa para impedir que dados/moedas saiam da área de jogo.
 */
function ParedeInvisivel({ args, position }) {
   const [ref] = useBox(() => ({
      type: 'Static',
      args,
      position,
      restitution: 0.4,
      friction: 0.2,
   }));

   return <mesh ref={ref} visible={false} />;
}

/**
 * As 4 paredes invisíveis que cercam a mesa, dimensionadas conforme o viewport.
 * FIX: key={`${w}-${d}`} força remontagem dos colisores quando o viewport muda,
 * evitando desalinhamento entre colisor antigo e dimensões novas.
 */
export function ParedesMesa() {
   const { viewport } = useThree();
   const w = Math.max(viewport.width * 1.5, 20);
   const d = Math.max(viewport.height * 1.5, 15);

   // FIX: base da parede alinhada com o topo do chão (Y_CHAO + 0.05 = 0)
   // elimina micro-gap nos cantos que deixava dados escaparem
   const baseY = Y_CHAO + 0.05; // = 0 exato — topo do chão
   const centroY = baseY + ALTURA_PAREDE / 2;

   return (
      <group key={`paredes-${w}-${d}`}>
         {/* Parede Norte */}
         <ParedeInvisivel
            args={[w, ALTURA_PAREDE, ESPESSURA_PAREDE]}
            position={[0, centroY, -(d / 2 + ESPESSURA_PAREDE / 2)]}
         />
         {/* Parede Sul */}
         <ParedeInvisivel
            args={[w, ALTURA_PAREDE, ESPESSURA_PAREDE]}
            position={[0, centroY, (d / 2 + ESPESSURA_PAREDE / 2)]}
         />
         {/* Parede Leste */}
         <ParedeInvisivel
            args={[ESPESSURA_PAREDE, ALTURA_PAREDE, d]}
            position={[(w / 2 + ESPESSURA_PAREDE / 2), centroY, 0]}
         />
         {/* Parede Oeste */}
         <ParedeInvisivel
            args={[ESPESSURA_PAREDE, ALTURA_PAREDE, d]}
            position={[-(w / 2 + ESPESSURA_PAREDE / 2), centroY, 0]}
         />
      </group>
   );
}