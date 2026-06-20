import api from '../utils/api';

export const authService = {
  login: (email, senha) => api.post('/auth/login', { email, senha }),
  // O login OAuth2 redireciona para o backend e retorna o token na URL.
  // Para o front, basta extrair o token do query param e armazená-lo.
  handleOAuthRedirect: () => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      window.history.replaceState({}, document.title, window.location.pathname); // limpa a URL
    }
    return token;
  },
};