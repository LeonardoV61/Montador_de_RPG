import api from '../utils/api';

export const cenaService = {
  // ========== CRUD Básico ==========
  criar: (dto) => api.post('/api/cenas', dto),
  buscarPorId: (id) => api.get(`/api/cenas/${id}`),
  listarPorSessao: (sessaoId) => api.get(`/api/cenas/sessao/${sessaoId}`),
  atualizar: (id, dto) => api.put(`/api/cenas/${id}`, dto),
  deletar: (id) => api.delete(`/api/cenas/${id}`),

  // ========== Gerenciamento de Cena Ativa ==========
  buscarCenaAtiva: (sessaoId) => api.get(`/api/cenas/sessoes/${sessaoId}/cena`),

  // ========== Combate e Participantes ==========
  iniciarCenaCombate: (req, idMestre) => api.post('/api/cenas/combate/iniciar', req, {
    headers: { 'X-Mestre-Id': idMestre }
  }),
  
  adicionarParticipante: (idCena, idInstancia, lado, idMestre) => 
    api.post(`/api/cenas/${idCena}/participantes?idInstancia=${idInstancia}&lado=${lado}`, null, {
      headers: { 'X-Mestre-Id': idMestre }
    }),

  removerParticipante: (idCena, idInstancia, idMestre) => 
    api.delete(`/api/cenas/${idCena}/participantes/${idInstancia}`, {
      headers: { 'X-Mestre-Id': idMestre }
    }),

  encerrarCena: (idCena, motivo, idMestre) => 
    api.post(`/api/cenas/${idCena}/encerrar?motivo=${encodeURIComponent(motivo)}`, null, {
      headers: { 'X-Mestre-Id': idMestre }
    }),

  // ========== Movimentação de Tokens ==========
  atualizarPosicaoToken: (sessaoId, idInstancia, x, y) => 
    api.patch(`/api/cenas/sessoes/${sessaoId}/tokens/${idInstancia}/posicao?x=${x}&y=${y}`)
};