import api from '../utils/api';

export const entidadeInstanciaService = {
  // — Instância —
  criar: (dto) => api.post('/api/entidades-instancia', dto),
  buscarPorId: (id) => api.get(`/api/entidades-instancia/${id}`),
  listarPorCampanha: (campanhaId) => api.get(`/api/entidades-instancia/campanha/${campanhaId}`),
  atualizar: (id, dto) => api.patch(`/api/entidades-instancia/${id}`, dto),
  deletar: (id) => api.delete(`/api/entidades-instancia/${id}`),

  // — Relações —
  listarRelacoes: (idPai) => api.get(`/api/entidades-instancia/${idPai}/relacoes`),
  adicionarRelacao: (dto) => api.post('/api/entidades-instancia/relacoes', dto),
  removerRelacao: (idPai, idFilha) => api.delete(`/api/entidades-instancia/${idPai}/relacoes/${idFilha}`),

  // — Concessão de classe —
  concederClasse: (id, entidadeSistemaId) =>
    api.post(`/api/entidades-instancia/${id}/conceder-classe`, null, {
      params: { entidadeSistemaId },
    }),
};