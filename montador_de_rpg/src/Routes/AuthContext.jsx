import axios from "axios";
import { useState, useEffect, createContext, useContext } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(localStorage.getItem("authenticated"))

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios.defaults.baseURL = 'https://back-end-barbalao.onrender.com';
  }, []);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await axios.get("/api/check_session/");
      console.log("Resposta check_session:", res.data);
      
      if (res.data.authenticated) {
        setAuthenticated(true);
        localStorage.setItem("authenticated", true);

      } else {
        setAuthenticated(false);
        localStorage.removeItem("authenticated");
      }
    } catch (error) {
      console.error("Erro ao verificar sessão:", error);
      setAuthenticated(false);
      localStorage.removeItem("authenticated");
    } 
  };


  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
