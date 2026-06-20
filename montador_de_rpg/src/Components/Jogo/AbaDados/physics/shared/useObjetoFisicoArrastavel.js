import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

/**
 * Hook compartilhado que encapsula o padrão repetido entre
 * DadoFisicoPoliedro (MesaFisica.jsx) e MoedaFisica (CoinGeometry.jsx):
 * segurar com o mouse, soltar com impulso/torque, e detectar quando o
 * objeto parou para então calcular o resultado.
 *
 * @param {Object} params
 * @param {Object} params.api - API de física (useBox/useCylinder/useConvexPolyhedron)
 * @param {Object} params.meshRef - ref do mesh físico
 * @param {Array} params.position - posição inicial [x, y, z]
 * @param {number} params.tempoEsperaMs - tempo de espera após lançar antes de calcular parada
 * @param {Function} params.gerarImpulso - () => [x, y, z]
 * @param {Function} params.gerarTorque - () => [x, y, z]
 * @param {Function} params.calcularResultado - (mesh) => any
 * @param {Function} params.onStopped - (resultado) => void
 */
export function useObjetoFisicoArrastavel({
   api,
   meshRef,
   position,
   tempoEsperaMs = 1000,
   gerarImpulso,
   gerarTorque,
   calcularResultado,
   onStopped,
}) {
   const velocityRef = useRef([0, 0, 0]);
   const angularVelocityRef = useRef([0, 0, 0]);
   const stateFlags = useRef({ segurando: false, lancado: false, calculado: false, tempoLancamento: 0 });
   const { viewport } = useThree();

   useEffect(() => {
      const unsubV = api.velocity.subscribe(v => { velocityRef.current = v; });
      const unsubA = api.angularVelocity.subscribe(av => { angularVelocityRef.current = av; });
      return () => { unsubV(); unsubA(); };
   }, [api]);

   useEffect(() => {
      const soltar = () => {
         if (!stateFlags.current.segurando || stateFlags.current.lancado) return;
         stateFlags.current.lancado = true;
         stateFlags.current.segurando = false;
         stateFlags.current.tempoLancamento = performance.now();

         api.applyImpulse(gerarImpulso(), [0, 0, 0]);
         api.angularVelocity.set(...gerarTorque());
      };
      window.addEventListener('pointerup', soltar);
      return () => window.removeEventListener('pointerup', soltar);
   }, [api]);

   useFrame((state) => {
      const current = stateFlags.current;
      if (current.lancado) {
         if (!current.calculado && (performance.now() - current.tempoLancamento > tempoEsperaMs)) {
            const v = velocityRef.current;
            const av = angularVelocityRef.current;
            const speed = Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2);
            const rotSpeed = Math.sqrt(av[0] ** 2 + av[1] ** 2 + av[2] ** 2);

            if (speed < 0.01 && rotSpeed < 0.01) {
               current.calculado = true;
               api.velocity.set(0, 0, 0);
               api.angularVelocity.set(0, 0, 0);
               const resultado = calcularResultado(meshRef.current);
               if (onStopped) onStopped(resultado);
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

   return stateFlags;
}

export default useObjetoFisicoArrastavel;
