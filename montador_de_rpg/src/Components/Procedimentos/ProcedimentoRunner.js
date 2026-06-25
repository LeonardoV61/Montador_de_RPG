import { useState } from 'react';
import { procedimentoService } from '../services/procedimentoService';

function ProcedimentoRunner({ idProcedimento, idSessao, idInstancia }) {
  const [contexto, setContexto] = useState(null);
  const [setErro] = useState(null);

  // Iniciar procedimento
  const iniciar = async () => {
    try {
      const ctx = await procedimentoService.iniciarComInstancia(idProcedimento, idSessao, idInstancia);
      setContexto(ctx);
    } catch (e) {
      setErro(e.message);
    }
  };

  // Enviar resposta do jogador
  const responder = async (resposta) => {
    try {
      const ctx = await procedimentoService.responder(idSessao, resposta);
      setContexto(ctx);
    } catch (e) {
      setErro(e.message);
    }
  };

  // Se ainda não iniciou, mostre botão
  if (!contexto) {
    return <button onClick={iniciar}>Iniciar Procedimento</button>;
  }

  // Se concluído
  if (contexto.status === 'CONCLUIDO') {
    return <div>Procedimento concluído!</div>;
  }

  // Se aguardando input, renderiza o formulário de resposta
  if (contexto.aguardandoInput) {
    const prompt = contexto.etapa?.prompt; // dados enviados pelo handler
    return (
      <div>
        <h3>{contexto.etapa.nome}</h3>
        <p>{prompt?.campo_pedido || 'Responda:'}</p>
        <InputForm prompt={prompt} onResponder={responder} />
      </div>
    );
  }

  // Caso esteja processando (EM_ANDAMENTO sem aguardar input) — raro, pois engine avança automático
  return <div>Processando etapa...</div>;
}