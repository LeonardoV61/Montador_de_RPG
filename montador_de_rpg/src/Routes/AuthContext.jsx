import { useState, createContext, useContext, useEffect } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(() => {
    const token = localStorage.getItem("token");
    return !!token;
  });

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "token") {
        setAuthenticated(!!e.newValue);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = async (email, senha) => {
    try {
      const data = await authService.login(email, senha);
      if (data?.token) {
        localStorage.setItem("token", data.token);
        setAuthenticated(true);
      }
    } catch (error) {
      console.error("Erro no login:", error);
      setAuthenticated(false);
    }
  };

  const handleOAuthRedirect = () => {
    const token = authService.handleOAuthRedirect();
    if (token) {
      setAuthenticated(true);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ authenticated, login, logout, handleOAuthRedirect }}>
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
