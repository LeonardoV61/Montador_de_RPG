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

         // Determina se o usuário estava arrastando ativamente ou só clicou e soltou
         const forcaArrasto = velocidadeArrastoMouse.current.length();
         
         let impulsoFinal = gerarImpulso();
         let torqueFinal = gerarTorque();

         if (forcaArrasto > 0.5) {
            // TRANSFERÊNCIA DE ENERGIA REALÍSTICA:
            // Injeta a velocidade do arrasto do mouse diretamente nos eixos X e Z, 
            // e adiciona um impulso vertical (Y) proporcional para o dado subir um pouco ao ser jogado.
            const MAX_VELOCIDADE_ARREMESSO = 12; // Trava de segurança para não quebrar a mesa física
            const fatorEscala = 1.2;

            let xImpulso = velocidadeArrastoMouse.current.x * fatorEscala;
            let zImpulso = velocidadeArrastoMouse.current.z * fatorEscala;
            
            // Limitador (Clamp) para manter o arremesso dentro de limites aceitáveis
            const magnitudeHorizontal = Math.sqrt(xImpulso ** 2 + zImpulso ** 2);
            if (magnitudeHorizontal > MAX_VELOCIDADE_ARREMESSO) {
               const proporcao = MAX_VELOCIDADE_ARREMESSO / magnitudeHorizontal;
               xImpulso *= proporcao;
               zImpulso *= proporcao;
            }

            // O impulso Y faz o objeto ganhar altura dependendo da velocidade com que foi arremessado
            const yImpulso = Math.min(2 + (magnitudeHorizontal * 0.4), 6);

            impulsoFinal = [xImpulso, yImpulso, zImpulso];

            // Torna o giro (torque) dependente da direção e força do arremesso do usuário
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
         // Calcula a posição pretendida no mundo virtual 3D
         const proximaX = (state.mouse.x * viewport.width) / 1.8;
         const proximaZ = -(state.mouse.y * viewport.height) / 1.8;

         // Descobre o vetor de velocidade baseado no deslocamento deste frame em relação ao anterior
         velocidadeArrastoMouse.current.set(
            (proximaX - posicaoAnteriorMouse.current.x) * 60, // Normalizado para ~60fps
            0,
            (proximaZ - posicaoAnteriorMouse.current.z) * 60
         );

         // Atualiza a posição estática e o histórico
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
         
         // Zera as forças residuais e sincroniza o histórico de posição pré-clique
         posicaoAnteriorMouse.current.set(flutuarX, flutuarY, flutuarZ);
         velocidadeArrastoMouse.current.set(0, 0, 0);
         
         api.velocity.set(0, 0, 0);
         api.angularVelocity.set(0, 0, 0);
      }
   });

   return stateFlags;
}

export default useObjetoFisicoArrastavel;