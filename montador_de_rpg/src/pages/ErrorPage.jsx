import { useRouteError, Link } from "react-router-dom";
import FormNav from "../Components/NavBar/navBarE.jsx";
import style from '../Components/Css/styles.Error.module.css'

export default function ErrorPage(){
    const error = useRouteError()

    return (
        <>
            <FormNav />
            <div className={style.cont}>
                <h1>Página não encontrada</h1>
            </div>
        </>
    )
}