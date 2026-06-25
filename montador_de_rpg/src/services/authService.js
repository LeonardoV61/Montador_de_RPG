import api from '../utils/api';

export const authService = {
  login: (email, senha) => api.post('/auth/login', { email, senha }),
  
  registro: (email, senha, apelido) => api.post('/auth/register', { email, senha, apelido }),

  redirectToOAuth: (provider) => {
    window.location.href = `${import.meta.env.VITE_API_URL}/oauth2/authorize/${provider}`;
  },

  handleOAuthRedirect: () => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    return token;
  },
};