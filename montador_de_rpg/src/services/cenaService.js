import api from '../utils/api';

export const cenaService = {
  criar: (dto) => api.post('/api/cenas', dto),
  buscarPorId: (id) => api.get(`/api/cenas/${id}`),
  listarPorSessao: (sessaoId) => api.get(`/api/cenas/sessao/${sessaoId}`),
  atualizar: (id, dto) => api.put(`/api/cenas/${id}`, dto),
  deletar: (id) => api.delete(`/api/cenas/${id}`),
};