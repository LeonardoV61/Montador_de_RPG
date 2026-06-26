import api from '../utils/api';

export const campanhaService = {
  criar: (dto) => api.post('/api/campanhas', dto),
  buscarPorId: (id) => api.get(`/api/campanhas/${id}`),
  listarTodas: () => api.get('/api/campanhas'),
  listarMinhas: () => api.get('/api/campanhas/minhas'),
  listarPorUsuario: (usuarioId) => api.get(`/api/campanhas/usuario/${usuarioId}`),
  deletar: (id) => api.delete(`/api/campanhas/${id}`),
  
  // Participantes
  adicionarJogador: (campanhaId, dto) => 
    api.post(`/api/campanhas/${campanhaId}/jogadores`, dto),
  listarParticipantes: (campanhaId) => 
    api.get(`/api/campanhas/${campanhaId}/jogadores`),
  
  // Temporária
  criarTemporariaComSessao: (sistemaId) => 
    api.post('/api/campanhas/temporaria-com-sessao', { sistemaId }),

  // Personagem do jogador
  obterMeuPersonagem: (campanhaId) => 
    api.get(`/api/campanhas/${campanhaId}/meu-personagem`),
  vincularPersonagem: (campanhaId, dto) => 
    api.post(`/api/campanhas/${campanhaId}/vincular-personagem`, dto)
};