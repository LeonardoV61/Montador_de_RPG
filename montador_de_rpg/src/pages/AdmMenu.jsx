import styles from '<div styleName={} />
<Components />
<OldComponents></OldComponents>/Css/styles.AdmMenu.module.css'
import { Link } from 'react-router-dom';
import { useState } from 'react';


export default function AdmMenu() {

    let currentTheme = localStorage.getItem("theme");
    if (!currentTheme) {
        currentTheme = window.matchMedia('(prefers-color-scheme: dark)') ? "dark" : "light";
    }

    function changeTheme() {
        currentTheme = currentTheme == "light" ? "dark" : "light";
        localStorage.setItem("theme", currentTheme);
        currentIcon = currentTheme == "dark" ? "ri-sun-fill sun-icon" : "ri-moon-fill moon-icon";
        setThemeIcon(currentIcon);
        document.body.classList = currentTheme;
    }
    
    let currentIcon = currentTheme == "dark" ? "ri-sun-fill sun-icon" : "ri-moon-fill moon-icon";
    const [themeIcon, setThemeIcon] = useState(currentIcon);
    document.body.classList = currentTheme;

    return(
        <div  className={styles.AdmCont} >

            <div className={styles.AdmContM}>
                <div className={styles.AdmHeader}>

                    <Link to="/" className={styles.AdmLink}>
                        <button className={styles.AdmVolt} onClick={() => Location.reload()}>←</button>
                    </Link>
                
                    <h1  className={styles.AdmH1}>MENU</h1>

                    <button className={styles.themeButton} onClick={() => changeTheme()}><i className={themeIcon}></i></button>

                </div>
                
                <div  className={styles.AdmButtDiv}>
                    {/* <Link to="/adm/painel/produtos"  className={styles.AdmLink}>
                        <button className={localStorage.getItem("theme") == "light"? styles.AdmButtL : styles.AdmButt}>
                            <img src={cesta} className={styles.AdmImg} />
                            <i>Produtos</i> 
                        </button>
                    </Link>
                    <Link to="/adm/painel/categorias"  className={styles.AdmLink}>
                        <button className={localStorage.getItem("theme") == "light"? styles.AdmButtL : styles.AdmButt}>
                            <img src={pasta} className={styles.AdmImg} />
                            <i>Categorias</i> 
                        </button>
                    </Link>
                    <Link to="/adm/painel/Banners" className={styles.AdmLink}>
                        <button className={localStorage.getItem("theme") == "light"? styles.AdmButtL : styles.AdmButt}>
                            <img src={imagem} className={styles.AdmImg} />
                            <i>Banners</i> 
                        </button>
                    </Link> */}
                </div>

            </div>

        </div>
    )
}