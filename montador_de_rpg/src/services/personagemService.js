import api from '../utils/api';

export const personagemService = {
  criar: (dto) => api.post('/api/personagens', dto),
  criarCompleto: (dto) => api.post('/api/personagens/completo', dto),
  buscarPorId: (id) => api.get(`/api/personagens/${id}`),
  listarPorCampanha: (campanhaId) => api.get(`/api/personagens/campanha/${campanhaId}`),
  listarPorUsuario: (usuarioId) => api.get(`/api/personagens/usuario/${usuarioId}`),
  buscarAtivoDoJogador: (campanhaId) => api.get(`/api/personagens/campanha/${campanhaId}/ativo`),
  atualizar: (id, dto) => api.patch(`/api/personagens/${id}`, dto),
  deletar: (id) => api.delete(`/api/personagens/${id}`),
  meuPersonagem: (campanhaId) => api.get(`/api/personagens/meu-personagem?campanhaId=${campanhaId}`),
};