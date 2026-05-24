import { useState } from "react";
import { useAuth } from "../../Routes/AuthContext";
import Form from "./FormLogin.jsx";
import FormNav from "../NavBar/navBar.jsx";
import Footer from "../Footer/Footer.jsx";
import style from './styles.forms.module.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Importação dos ícones SVG
import googleIcon from "../../assets/icons/google-icon.svg";
import discordIcon from "../../assets/icons/discord-icon.svg";

axios.defaults.withCredentials = true;

export default function ContainerU(){
    const [formValues, setFormValues] = useState({ nome: "", senha: "" });
    const [errorMessage, setErrorMessage] = useState("");
    const { setAuthenticated } = useAuth(null); 
    const navigate = useNavigate();

    function handleInputChange (e){
        const {name, value } = e.target;
        setFormValues((prev) => ({...prev, [name]: value }));
    };

    async function handleSubmit(){
        console.log(formValues);
        try {
            const response = {
                data: {
                    message: "OK"
                }
            };

            if (response.data.message == "OK") {
                navigate("/menu");
                localStorage.setItem("authenticated", "true");
                setAuthenticated(localStorage.getItem("authenticated"));
                setErrorMessage("");
            } else {
                setErrorMessage(response.data.message);
                navigate("/login");
            }

            console.log("Resposta do servidor: ", response.data.message);

        } catch (error){
            navigate("/login");
            setErrorMessage("Erro ao enviar dados, tente novamente");
            console.log("Erro ao buscar dados: ", error);
        }
    }
    
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
                    <button type="button" className={`${style.socialBtn} ${style.googleBtn}`}>
                        <img src={googleIcon} alt="Google" className={style.socialIcon} />
                        Google
                    </button>
                    <button type="button" className={`${style.socialBtn} ${style.discordBtn}`}>
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