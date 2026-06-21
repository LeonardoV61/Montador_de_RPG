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
};
