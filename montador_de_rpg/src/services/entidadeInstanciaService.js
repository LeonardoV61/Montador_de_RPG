import api from '../utils/api';

export const entidadeInstanciaService = {
  criar: (dto) => api.post('/api/entidades-instancia', dto),
  buscarPorId: (id) => api.get(`/api/entidades-instancia/${id}`),
  listarPorCampanha: (campanhaId) => api.get(`/api/entidades-instancia/campanha/${campanhaId}`),
  atualizar: (id, dto) => api.patch(`/api/entidades-instancia/${id}`, dto),
  deletar: (id) => api.delete(`/api/entidades-instancia/${id}`),
};