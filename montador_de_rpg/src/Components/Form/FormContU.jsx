import { useState } from "react";
import { useAuth } from "../../Routes/AuthContext";
import Form from "./FormLogin.jsx";
import FormNav from "../NavBar/navBar.jsx";
import Footer from "../Footer/Footer.jsx";
import style from './styles.forms.module.css';
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";

import googleIcon from "../../assets/icons/google-icon.svg";
import discordIcon from "../../assets/icons/discord-icon.svg";

export default function ContainerU(){
    const [formValues, setFormValues] = useState({ nome: "", senha: "" });
    const [errorMessage, setErrorMessage] = useState("");
    const { setAuthenticated } = useAuth(); 
    const navigate = useNavigate();

    function handleInputChange (e){
        const {name, value } = e.target;
        setFormValues((prev) => ({...prev, [name]: value }));
    };

    async function handleSubmit(){
        try {
            // Chamada real para o seu backend Spring Boot
            // Dica: Se o seu backend esperar "email" ou "username", altere a chave 'username' abaixo
            const response = await api.post("/auth/login", {
                username: formValues.nome, 
                password: formValues.senha
            });
            if (response.data && response.data.token) {
                localStorage.setItem("token", response.data.token);
                setAuthenticated(true);
                setErrorMessage("");
                navigate("/menu");
            } else {
                setErrorMessage("Falha na autenticação do servidor.");
            }

        } catch (error){
            console.error("Erro ao buscar dados: ", error);
            const msgErro = error.response?.data?.message || "Usuário ou senha inválidos, tente novamente.";
            setErrorMessage(msgErro);
        }
    }

    // Função que despacha o usuário para o fluxo do Google ou Discord configurado no Spring Security
    const handleOAuth2Login = (provider) => {
        window.location.href = `${import.meta.env.VITE_API_URL}/oauth2/authorize/${provider}`;
    };
    
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
                    click={handleSubmit}
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
                        className={`${style.socialBtn} ${style.googleBtn}`}
                    >
                        <img src={googleIcon} alt="Google" className={style.socialIcon} />
                        Google
                    </button>
                    <button 
                        type="button" 
                        onClick={() => handleOAuth2Login("discord")} 
                        className={`${style.socialBtn} ${style.discordBtn}`}
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