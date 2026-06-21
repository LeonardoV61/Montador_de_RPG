import api from '../utils/api';

export const procedimentoService = {
  // ---------- CRUD ----------
  criar: (dto) => api.post('/api/procedimentos', dto),
  
  buscarPorId: (id) => api.get(`/api/procedimentos/${id}`),
  
  listar: (sistemaId) => {
    const params = sistemaId != null ? { sistemaId } : {};
    return api.get('/api/procedimentos', { params });
  },
  
  atualizar: (id, dto) => api.put(`/api/procedimentos/${id}`, dto),
  
  deletar: (id) => api.delete(`/api/procedimentos/${id}`),

  // ---------- Etapas ----------
  adicionarEtapa: (procedimentoId, dto) =>
    api.post(`/api/procedimentos/${procedimentoId}/etapas`, dto),
    
  atualizarEtapa: (procedimentoId, etapaId, dto) =>
    api.put(`/api/procedimentos/${procedimentoId}/etapas/${etapaId}`, dto),
    
  deletarEtapa: (procedimentoId, etapaId) =>
    api.delete(`/api/procedimentos/${procedimentoId}/etapas/${etapaId}`),

  // ---------- Iniciar procedimentos ----------
  iniciarComInstancia: (id, idSessao, idInstancia) =>
    api.post(`/api/procedimentos/${id}/iniciar-com-instancia`, null, {
      params: { idSessao, idInstancia },
    }),
    
  iniciarSemInstancia: (id, idSessao) =>
    api.post(`/api/procedimentos/${id}/iniciar-sem-instancia`, null, {
      params: { idSessao },
    }),
    
  iniciarComMultiplas: (id, idSessao, ids) =>
    api.post(`/api/procedimentos/${id}/iniciar-com-multiplas`, ids, {
      params: { idSessao },
    }),
};