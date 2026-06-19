import { useState } from "react";
import { useAuth } from "../../Routes/AuthContext";
import Form from "./FormLogin.jsx";
import FormNav from "../NavBar/navBar.jsx";
import Footer from "../Footer/Footer.jsx";
import style from './styles.forms.module.css';
import { useNavigate } from "react-router-dom";

// IMPORTAÇÃO DA API COMENTADA (FUNCIONAL)
// import api from "../../utils/api";

import googleIcon from "../../assets/icons/google-icon.svg";
import discordIcon from "../../assets/icons/discord-icon.svg";

export default function ContainerU(){
    const [formValues, setFormValues] = useState({ nome: "", senha: "" });
    const [errorMessage, setErrorMessage] = useState("");
    
    // Usando a função login do seu AuthContext
    const { login } = useAuth();
    const navigate = useNavigate();

    function handleInputChange (e){
        const {name, value } = e.target;
        setFormValues((prev) => ({...prev, [name]: value }));
    };

    async function handleSubmit(e){
        if (e && e.preventDefault) e.preventDefault();

        console.log("Tentativa de Login capturada (Bypass Ativo):", formValues);
        
        try {
            // ==========================================
            // LOGICA DE BYPASS (ATIVA SEM COMENTÁRIOS)
            // ==========================================
            const response = {
                data: {
                    message: "OK",
                    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.YnlwYXNzLWZha2Uua2V5.token123"
                }
            };

            if (response.data && response.data.token) {
                login(response.data.token); 
                setErrorMessage("");
                navigate("/menu");
                localStorage.setItem("authenticated", "true");
            } else {
                setErrorMessage("Falha na autenticação do servidor.");
            }

            // ==========================================
            // LOGICA REAL DO SPRING BOOT (COMENTADA)
            // ==========================================
            /*
            const response = await api.post("/auth/login", {
                username: formValues.nome, 
                password: formValues.senha
            });

            if (response.data && response.data.token) {
                login(response.data.token);
                setErrorMessage("");
                navigate("/menu");
                localStorage.setItem("authenticated", "true");
            } else {
                setErrorMessage("Falha na autenticação do servidor.");
            }
            */

        } catch (error){
            console.error("Erro no fluxo de login: ", error);
            setErrorMessage("Erro ao processar o login temporário.");
            
            // TRATAMENTO DE ERRO REAL (COMENTADO)
            /*
            const msgErro = error.response?.data?.message || "Usuário ou senha inválidos, tente novamente.";
            setErrorMessage(msgErro);
            */
        }
    }

    // ==========================================
    // LOGICA DE OAUTH2 BYPASS (ATIVA)
    // ==========================================
    const handleOAuth2Login = (provider) => {
        console.log(`Bypass: Simulando OAuth2 via ${provider}`);
        login(`fake-token-oauth2-${provider}`);
        navigate("/menu");
    };

    // LOGICA DE OAUTH2 REAL (COMENTADA)
    /*
    const handleOAuth2LoginReal = (provider) => {
        window.location.href = `${import.meta.env.VITE_API_URL}/oauth2/authorize/${provider}`;
    };
    */
    
    return (
        <>
          <FormNav />
            <div className={style.cont}>
                 <Form 
                    title="Login" 
                    btn="Logar" 
                    aContent={errorMessage}
                    values={formValues}
                    onInputChange={handleInputChange}
                    click={handleSubmit} // Mantenha 'click' ou mude para 'onSubmit' dependendo do seu FormLogin.jsx
                 >
                <div className={style.dividerContainer}>
                    <hr className={style.dividerLine} />
                    <span className={style.dividerText}>ou entre com</span>
                    <hr className={style.dividerLine} />
                </div>
                <div className={style.socialContainer}>
                    <button 
                        type="button" 
                        onClick={() => handleOAuth2Login("google")} 
                        className={style.socialBtn}
                    >
                        <img src={googleIcon} alt="Google" className={style.socialIcon} />
                        Google
                    </button>
                    <button 
                        type="button" 
                        onClick={() => handleOAuth2Login("discord")} 
                        className={style.socialBtn}
                    >
                        <img src={discordIcon} alt="Discord" className={style.socialIcon} />
                        Discord
                    </button>
                </div>
                </Form>
            </div>
          <Footer />
        </>
    );
}