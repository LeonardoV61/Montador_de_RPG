import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Hook compartilhado que encapsula o padrão de segurar com o mouse,
 * calcular a energia do arrasto em tempo real, e injetar essa força 
 * ao soltar para criar um efeito de arremesso realista e dosado.
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

   // Contador para garantir estabilização por múltiplos frames
   const framesParadoRef = useRef(0);

   // Guardam o histórico de posições do mouse no espaço 3D para calcular a velocidade do arremesso
   const posicaoAnteriorMouse = useRef(new THREE.Vector3());
   const velocidadeArrastoMouse = useRef(new THREE.Vector3());

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
         framesParadoRef.current = 0; // Reseta o contador ao lançar

         // Determina se o usuário estava arrastando ativamente ou só clicou e soltou
         const forcaArrasto = velocidadeArrastoMouse.current.length();
         
         let impulsoFinal = gerarImpulso();
         let torqueFinal = gerarTorque();

         if (forcaArrasto > 0.5) {
            const MAX_VELOCIDADE_ARREMESSO = 12; // Trava de segurança para não quebrar a mesa física
            const fatorEscala = 1.2;

            let xImpulso = velocidadeArrastoMouse.current.x * fatorEscala;
            let zImpulso = velocidadeArrastoMouse.current.z * fatorEscala;
            
            const magnitudeHorizontal = Math.sqrt(xImpulso ** 2 + zImpulso ** 2);
            if (magnitudeHorizontal > MAX_VELOCIDADE_ARREMESSO) {
               const proporcao = MAX_VELOCIDADE_ARREMESSO / magnitudeHorizontal;
               xImpulso *= proporcao;
               zImpulso *= proporcao;
            }

            const yImpulso = Math.min(2 + (magnitudeHorizontal * 0.4), 6);
            impulsoFinal = [xImpulso, yImpulso, zImpulso];

            torqueFinal = [
               zImpulso * 3 + (Math.random() * 10 - 5),
               Math.random() * 20 - 10,
               -xImpulso * 3 + (Math.random() * 10 - 5)
            ];
         }

         api.applyImpulse(impulsoFinal, [0, 0, 0]);
         api.angularVelocity.set(...torqueFinal);
      };
      window.addEventListener('pointerup', soltar);
      return () => window.removeEventListener('pointerup', soltar);
   }, [api, gerarImpulso, gerarTorque]);

   useFrame((state) => {
      const current = stateFlags.current;
      if (current.lancado) {
         const tempoDecorrido = performance.now() - current.tempoLancamento;

         if (!current.calculado && (tempoDecorrido > tempoEsperaMs)) {
            const v = velocityRef.current;
            const av = angularVelocityRef.current;
            const speed = Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2);
            const rotSpeed = Math.sqrt(av[0] ** 2 + av[1] ** 2 + av[2] ** 2);

            // Ajustado limiar para 0.05 (absorve micro-movimentos do motor de física)
            const estaParado = speed < 0.05 && rotSpeed < 0.05;
            
            // TRAVA DE SEGURANÇA: Se passar de 4 segundos, força a parada de qualquer forma
            const estourouTempoMaximo = tempoDecorrido > 4000;

            if (estaParado) {
               framesParadoRef.current += 1;
            } else {
               framesParadoRef.current = 0;
            }

            if (framesParadoRef.current >= 5 || estourouTempoMaximo) {
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
         const proximaX = (state.mouse.x * viewport.width) / 1.8;
         const proximaZ = -(state.mouse.y * viewport.height) / 1.8;

         velocidadeArrastoMouse.current.set(
            (proximaX - posicaoAnteriorMouse.current.x) * 60,
            0,
            (proximaZ - posicaoAnteriorMouse.current.z) * 60
         );

         api.position.set(proximaX, 2.2, proximaZ);
         posicaoAnteriorMouse.current.set(proximaX, 2.2, proximaZ);

         api.velocity.set(0, 0, 0);
         api.angularVelocity.set(0, 0, 0);
      } else {
         const t = state.clock.getElapsedTime();
         const flutuarX = position[0];
         const flutuarY = position[1] + Math.cos(t * 1.5) * 0.05;
         const flutuarZ = position[2];

         api.position.set(flutuarX, flutuarY, flutuarZ);
         
         posicaoAnteriorMouse.current.set(flutuarX, flutuarY, flutuarZ);
         velocidadeArrastoMouse.current.set(0, 0, 0);
         
         api.velocity.set(0, 0, 0);
         api.angularVelocity.set(0, 0, 0);
      }
   });

   return stateFlags;
}

export default useObjetoFisicoArrastavel;