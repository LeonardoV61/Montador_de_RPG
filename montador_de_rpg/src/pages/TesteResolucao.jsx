import { useState } from 'react';
import { resolucaoService } from '../services/resolucaoService';

function TesteResolucao() {
  const [resolucaoId, setResolucaoId] = useState('');
  const [contexto, setContexto] = useState('{"CLA": 12}');
  const [resultado, setResultado] = useState(null);
  const [roll, setRoll] = useState(null);

  const rolarD20 = () => Math.floor(Math.random() * 20) + 1;

  const executar = async () => {
    try {
      const ctx = JSON.parse(contexto);
      const rolled = rolarD20();
      setRoll(rolled);
      ctx.roll = rolled;

      const res = await resolucaoService.executar(resolucaoId, ctx);
      setResultado(res);
    } catch (e) {
      setResultado({ erro: e.message });
    }
  };

  return (
    <div>
      <h2>Teste de Resolução d20 ≤ Atributo</h2>
      <label>
        ID da Resolução:
        <input value={resolucaoId} onChange={(e) => setResolucaoId(e.target.value)} />
      </label>
      <br />
      <label>
        Contexto (JSON):
        <textarea value={contexto} onChange={(e) => setContexto(e.target.value)} rows={3} cols={40} />
      </label>
      <br />
      <button onClick={executar}>Rolar d20 e Executar</button>
      {roll && <p>Dado rolado: {roll}</p>}
      {resultado && (
        <pre>
          {resultado.erro
            ? `Erro: ${resultado.erro}`
            : `Sucesso: ${resultado.success}
Motivo: ${resultado.motivo}
Roll: ${resultado.roll} | Alvo: ${resultado.targetValue}`}
        </pre>
      )}
    </div>
  );
}

export default TesteResolucao;