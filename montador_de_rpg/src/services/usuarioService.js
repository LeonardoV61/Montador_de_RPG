import api from '../utils/api';

export const usuarioService = {
  buscarPorId: (id) => api.get(`/api/usuarios/${id}`),
  buscarPorEmail: (email) => api.get(`/api/usuarios/email/${email}`),
  listarTodos: () => api.get('/api/usuarios'),
  atualizar: (id, dto) => api.patch(`/api/usuarios/${id}`, dto),
  deletar: (id) => api.delete(`/api/usuarios/${id}`),
  perfil: () => api.get('/api/usuarios/me'),
};