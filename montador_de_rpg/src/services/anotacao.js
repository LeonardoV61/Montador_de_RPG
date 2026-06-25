import api from '../utils/api';

export const anotacaoService = {
  criar: (dto) => api.post('/api/anotacoes', dto),
  buscarPorId: (id) => api.get(`/api/anotacoes/${id}`),
  listarPorSessao: (sessaoId) => api.get(`/api/anotacoes/sessao/${sessaoId}`),
  atualizar: (id, dto) => api.put(`/api/anotacoes/${id}`, dto),
  deletar: (id) => api.delete(`/api/anotacoes/${id}`),
};