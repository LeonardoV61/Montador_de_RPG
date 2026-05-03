import { useState } from "react";
import { useAuth } from "../../Routes/AuthContext";
import Form from "./FormLogin"
import FormNav from "./FormNav";
import style from '../Css/styles.formContQ.module.css'
import axios from "axios";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true

export default function Container(){
    const [formValues, setFormValues] = useState({ nome: "", senha: "" });
    const [errorMessage, setErrorMessage] = useState("")
    const {authenticated, setAuthenticated} = useAuth()
    const navigate = useNavigate()

    function handleInputChange (e){
        const {name, value } = e.target
        setFormValues((prev) => ({...prev, [name]: value }))
    };


     async function handleSubmit(){
        console.log(formValues); 
        try {
            const response = await axios.post('https://back-end-barbalao.onrender.com/api/login/', {
                nome: formValues.nome,
                senha: formValues.senha
            },
            { withCredentials: true })

            if (response.data.message == "OK") {
                navigate("/adm")
                localStorage.setItem("authenticated", true)
                setAuthenticated(localStorage.getItem("authenticated"))
                setErrorMessage("")
            } else {
                setErrorMessage(response.data.message)
                navigate("/login")
            }

            console.log("Resposta do servidor: ", response.data.message)

        } catch (error){
            navigate("/login")
            setErrorMessage("Erro ao enviar dados, tente novamente")
            console.log("Erro ao buscar dados: ", error)
        }

        
    }
    
    return<>
            <FormNav />
            <div className={style.cont}>
                 <Form 
                        title="Login" 
                        btn="Logar" 
                        aContent={errorMessage}
                        values={formValues}
                        onInputChange={handleInputChange}
                        click={handleSubmit}
                        />
            </div>
    </>
}