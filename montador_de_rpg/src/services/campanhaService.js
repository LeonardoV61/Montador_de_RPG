import api from '../utils/api';

export const campanhaService = {
  criar: (dto) => api.post('/api/campanhas', dto),
  buscarPorId: (id) => api.get(`/api/campanhas/${id}`),
  listarTodas: () => api.get('/api/campanhas'),
  deletar: (id) => api.delete(`/api/campanhas/${id}`),
  adicionarJogador: (campanhaId, dto) =>
    api.post(`/api/campanhas/${campanhaId}/jogadores`, dto),
  criarTemporariaComSessao: (sistemaId) =>
    api.post('/api/campanhas/temporaria-com-sessao', { sistemaId }),
};