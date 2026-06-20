import api from '../utils/api';

export const entidadeSistemaService = {
  criar: (dto) => api.post('/api/entidades-sistema', dto),
  buscarPorId: (id) => api.get(`/api/entidades-sistema/${id}`),
  listarPorSistema: (sistemaId) => api.get(`/api/entidades-sistema/sistema/${sistemaId}`),
  atualizar: (id, dto) => api.patch(`/api/entidades-sistema/${id}`, dto),
  deletar: (id) => api.delete(`/api/entidades-sistema/${id}`),
};