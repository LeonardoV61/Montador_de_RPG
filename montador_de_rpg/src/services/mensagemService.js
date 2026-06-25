import api from '../utils/api';

export const mensagemService = {
  criar: (dto) => api.post('/api/mensagens', dto),
  buscarPorId: (id) => api.get(`/api/mensagens/${id}`),
  listarPorSessao: (sessaoId) => api.get(`/api/mensagens/sessao/${sessaoId}`),
  deletar: (id) => api.delete(`/api/mensagens/${id}`),
};