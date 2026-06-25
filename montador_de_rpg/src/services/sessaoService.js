import api from '../utils/api';

export const sessaoService = {
  iniciar: (campanhaId) => api.post(`/api/sessoes/campanhas/${campanhaId}/iniciar`),
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