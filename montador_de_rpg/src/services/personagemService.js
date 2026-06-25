import api from '../utils/api.js';

export const personagemService = {
  // Entidades de um sistema (ex: Knight, Squire...)
  listarEntidadesPorSistema: (sistemaId) =>
    api.get(`/api/entidades-sistema/sistema/${sistemaId}`),

  // Procedimentos de criação do sistema
  listarProcedimentosPorSistema: (sistemaId) =>
    api.get(`/api/procedimentos/sistema/${sistemaId}`),

  // Cria instância + personagem de uma vez
  criarCompleto: (dto) =>
    api.post('/api/personagens/completo', dto),

  // Busca personagens do usuário
  listarPorUsuario: (usuarioId) =>
    api.get(`/api/personagens/usuario/${usuarioId}`),

  // Busca a ficha detalhada de um personagem específico por ID
  buscarPorId: (id) => 
    api.get(`/api/personagens/${id}`),

  // [ADICIONADO] Busca o personagem ativo do próprio jogador logado na campanha
  buscarMeuPersonagem: (campanhaId) =>
    api.get(`/api/personagens/meu-personagem/${campanhaId}`),
};
