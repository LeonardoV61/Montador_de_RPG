import api from '../utils/api';

export const sessaoService = {
  iniciar: (campanhaId) => api.post(`/api/sessoes/campanhas/${campanhaId}/iniciar`),
 agendar: (campanhaId, data) =>
  api.post(`/api/sessoes/campanhas/${campanhaId}/agendar`, {
    dataInicio: `${data}T00:00:00`  // ← converte "2026-06-26" em "2026-06-26T00:00:00"
  }),
  listarPorCampanha: (campanhaId) => api.get(`/api/sessoes/campanha/${campanhaId}`),
  encerrar: (sessaoId) => api.post(`/api/sessoes/${sessaoId}/encerrar`),
  entrar: (sessaoId, tokenConvite) =>
    api.post(`/api/sessoes/${sessaoId}/entrar`, tokenConvite ? { tokenConvite } : null),
  gerarConvite: (sessaoId, idUsuarioAlvo) =>
    api.post(`/api/sessoes/${sessaoId}/convite`, { idUsuarioAlvo }),
  alterarAtributoMestre: (sessaoId, instanciaId, atributo, valor) =>
    api.patch(`/api/sessoes/${sessaoId}/instancias/${instanciaId}/atributos`, { atributo, valor }),
  alterarAtributoJogador: (sessaoId, atributo, valor) =>
    api.patch(`/api/sessoes/${sessaoId}/meu-personagem/atributos`, { atributo, valor }),
};