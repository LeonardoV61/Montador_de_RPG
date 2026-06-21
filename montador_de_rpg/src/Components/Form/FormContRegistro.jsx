import { useState } from "react";
import FormNav from "../NavBar/navBar.jsx";
import Footer from "../Footer/Footer.jsx";
import style from './styles.forms.module.css';
import formStyle from './styles.registro.module.css';
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService.js";
import googleIcon from "../../assets/icons/google-icon.svg";
import discordIcon from "../../assets/icons/discord-icon.svg";

export default function ContainerRegistro() {
    const [formValues, setFormValues] = useState({ email: "", apelido: "", senha: "" });
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    function handleInputChange(e) {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e) {
        if (e && e.preventDefault) e.preventDefault();
        setLoading(true);
        setErrorMessage("");

        try {
            await authService.registro(formValues.email, formValues.senha, formValues.apelido);
            navigate("/login?registered=true");
        } catch (error) {
            if (error.status === 409) {
                setErrorMessage("Este email já está cadastrado.");
            } else {
                setErrorMessage("Erro ao criar conta. Tente novamente.");
            }
        } finally {
            setLoading(false);
        }
    }

    const handleOAuth2Login = (provider) => {
        authService.redirectToOAuth(provider);
    };

    return (
        <>
            <FormNav />
            <div className={style.cont}>
                <form className={formStyle.formCont} onSubmit={handleSubmit}>
                    <h1 className={style.formTitle}>Registro</h1>

                    <input
                        onChange={handleInputChange}
                        className={style.inputs}
                        placeholder="Email"
                        name="email"
                        type="email"
                        required
                    />

                    <input
                        onChange={handleInputChange}
                        className={style.inputs}
                        placeholder="Apelido"
                        name="apelido"
                        type="text"
                        required
                    />

                    <div className={style.passwordCont}>
                        <input
                            onChange={handleInputChange}
                            className={style.inputs}
                            placeholder="Senha"
                            name="senha"
                            type="password"
                            required
                        />
                    </div>

                    {errorMessage && <h5 className={style.error}>{errorMessage}</h5>}

                    <button className={style.formBtn} type="submit" disabled={loading}>
                        {loading ? "Criando..." : "Criar Conta"}
                    </button>

                    <div className={style.dividerContainer}>
                        <hr className={style.dividerLine} />
                        <span className={style.dividerText}>ou entre com</span>
                        <hr className={style.dividerLine} />
                    </div>

                    <div className={style.socialContainer}>
                        <button type="button" onClick={() => handleOAuth2Login("google")} className={style.socialBtn}>
                            <img src={googleIcon} alt="Google" className={style.socialIcon} />
                            Google
                        </button>
                        <button type="button" onClick={() => handleOAuth2Login("discord")} className={style.socialBtn}>
                            <img src={discordIcon} alt="Discord" className={style.socialIcon} />
                            Discord
                        </button>
                    </div>

                    <p className={formStyle.loginLink}>
                        Já tem uma conta? <span onClick={() => navigate("/login")}>Entrar</span>
                    </p>
                </form>
            </div>
            <Footer />
        </>
    );
}