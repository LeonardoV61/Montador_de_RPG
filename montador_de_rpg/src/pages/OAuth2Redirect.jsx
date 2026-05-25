import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../Routes/AuthContext";

export default function OAuth2Redirect() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setAuthenticated } = useAuth();

    useEffect(() => {
        // Extrai o token vindo na URL do redirecionamento do backend (?token=...)
        const token = searchParams.get("token");

        if (token) {
            localStorage.setItem("token", token);
            setAuthenticated(true);
            navigate("/menu");
        } else {
            navigate("/login?error=oauth2_failed");
        }
    }, [searchParams, navigate, setAuthenticated]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <h2>Carregando sua sessão na mesa de RPG...</h2>
        </div>
    );
}