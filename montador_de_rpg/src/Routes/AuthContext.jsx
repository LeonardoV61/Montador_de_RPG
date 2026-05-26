import { useState, createContext, useContext, useEffect } from "react";
import api from "../utils/api";
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(() => {
    const token = localStorage.getItem("token");
    return !!token;
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  // Monitora outras abas do navegador. Se o usuário deslogar em uma aba, desloga em todas.
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "token") {
        if (!e.newValue) {
          // Token foi removido
          setAuthenticated(false);
          delete api.defaults.headers.common["Authorization"];
        } else {
          // Token foi adicionado/atualizado
          setAuthenticated(true);
          api.defaults.headers.common["Authorization"] = `Bearer ${e.newValue}`;
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Função para centralizar o login com sucesso
  const login = (token) => {
    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setAuthenticated(true);
  };

  // Função de logout limpa o estado, o storage e os headers do Axios
  const logout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setAuthenticated(false);
  };

  // Opcional: Função para validar se o token atual ainda é válido no backend
  const validateTokenOnServer = async () => {
    try {
      // Supondo que você tenha uma rota no Spring que valide o token atual
      await api.get("/auth/validate"); 
    } catch (error) {
      // Se o backend retornar 401 ou 403, desloga o usuário imediatamente
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{ authenticated, login, logout, validateTokenOnServer }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}