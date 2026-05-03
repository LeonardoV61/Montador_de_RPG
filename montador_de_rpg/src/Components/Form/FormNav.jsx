import { Link, Outlet } from 'react-router-dom';
import style from '../Css/styles.formNav.module.css'
import Logo from '../../assets/BarB.png'

export default function FormNav() {
    return (
        <>
            <nav className={style.formNav}>
                <div>
                    <Link to="/"><img className={style.img} src={Logo} alt="Logo do bar balão" /></Link>
                </div>
                <div>
                    <Link className={style.formLink} to="/">início</Link>
                    <Link className={style.formLink} to="/about-us">Sobre nós</Link>
                </div>
            </nav>

        </>
    )
}