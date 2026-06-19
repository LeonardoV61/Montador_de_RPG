import * as THREE from 'three';

export const gerarArrayMateriaisDados = (lados) => {
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
         ctx.textBaseline = 'middle'; // Fornece maior precisão no alinhamento centralizado

         const arrTriades = [["1","2","3"], ["1","4","2"], ["1","3","4"], ["2","4","3"]];
         const [nTopo, nEsq, nDir] = arrTriades[(i - 1) % 4];

         // 1. Número do Topo (Mantém-se virado para cima, base apontada para baixo)
         ctx.fillText(nTopo, 256, 95);

         // 2. Número Inferior Esquerdo (Rotacionado para alinhar a base com a aresta esquerda)
         ctx.save();
         ctx.translate(135, 375); 
         ctx.rotate(-Math.PI / 3); // Ângulo invertido para corrigir o sentido do texto
         ctx.fillText(nEsq, 0, 0);
         ctx.restore();

         // 3. Número Inferior Direito (Rotacionado para alinhar a base com a aresta direita)
         ctx.save();
         ctx.translate(377, 375);
         ctx.rotate(Math.PI / 3);  // Ângulo invertido para corrigir o sentido do texto
         ctx.fillText(nDir, 0, 0);
         ctx.restore();

         // Desenha a borda amarela triangular de contenção externa
         ctx.beginPath();
         ctx.moveTo(256, 20);
         ctx.lineTo(492, 440);
         ctx.lineTo(20, 440);
         ctx.closePath();
         ctx.stroke();
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