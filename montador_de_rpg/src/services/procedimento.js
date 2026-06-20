import api from '../utils/api';

export const procedimentoService = {
  iniciarComInstancia: (idProcedimento, idSessao, idInstancia) =>
    api.post(`/api/procedimentos/${idProcedimento}/iniciar-com-instancia?idSessao=${idSessao}&idInstancia=${idInstancia}`),
  
  iniciarSemInstancia: (idProcedimento, idSessao) =>
    api.post(`/api/procedimentos/${idProcedimento}/iniciar-sem-instancia?idSessao=${idSessao}`),

  iniciarComMultiplas: (idProcedimento, idSessao, ids) =>
    api.post(`/api/procedimentos/${idProcedimento}/iniciar-com-multiplas?idSessao=${idSessao}`, ids),

  getStatus: (idSessao) => api.get(`/api/procedimentos/${idSessao}/status`),

  responder: (idSessao, resposta) => api.post(`/api/procedimentos/${idSessao}/responder`, resposta),
};