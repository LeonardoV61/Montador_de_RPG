import api from '../utils/api';

export const sistemaService = {
  criar: (dto) => api.post('/api/sistemas', dto),
  buscarPorId: (id) => api.get(`/api/sistemas/${id}`),
  listarTodos: () => api.get('/api/sistemas'),
  atualizar: (id, dto) => api.patch(`/api/sistemas/${id}`, dto),
  marcarComoOficial: (id) => api.patch(`/api/sistemas/${id}/oficial`),
  deletar: (id) => api.delete(`/api/sistemas/${id}`),
};