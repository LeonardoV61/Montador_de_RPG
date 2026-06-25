import api from '../utils/api';

export const resolucaoService = {
  criar: (dto) => api.post('/api/resolucoes', dto),
  buscarPorId: (id) => api.get(`/api/resolucoes/${id}`),
  listarPorSistema: (sistemaId) => api.get(`/api/resolucoes/sistema/${sistemaId}`),
  atualizar: (id, dto) => api.patch(`/api/resolucoes/${id}`, dto),
  deletar: (id) => api.delete(`/api/resolucoes/${id}`),
  executar: (id, contexto) => api.post(`/api/resolucoes/${id}/executar`, contexto),
};