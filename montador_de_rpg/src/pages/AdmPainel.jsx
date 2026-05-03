import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CriaCateg from "../Components/Adm/Criacao/Categoria";
import CriaProd from "../Components/Adm/Criacao/Produtos";
import CriaBanner from "../Components/Adm/Criacao/Banner";
import styles from '../Components/Css/styles.AdmPainel.module.css';
import AdmProdutoModal from "../Components/Adm/MenorComp/AdmProdutoModal";
import AdmEditProductModal from "../Components/Adm/MenorComp/AdmEditProductModal";

export default function AdmPainel() {
    const local = useLocation();
    const titulo = local.pathname.slice(12).toUpperCase();

    const [novo, setNovo] = useState(false);
    const [fechar, setFechar] = useState(true);
    const [backdrop, setBackdrop] = useState(false);
    const [viewProduct, setViewProduct] = useState(false);
    const [editProduct, setEditProduct] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [admSearchText, setAdmSearchText] = useState('');

    useEffect(() => {
        if (viewProduct) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {document.body.style.overflow = ''};
    }, [viewProduct]);

    
    console.log(novo)

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

    const [scroll, setScroll] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            setScroll(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    
    return(
        <div className={styles.PainelCont}>

            <div className={`${styles.PainelContNav} ${scroll? styles.shrink: ""}`}>
                <div className={styles.PainelHeader}>
                    <Link to="/adm" className={styles.PainelLink}>
                        <button className={styles.PainelVolt}>←</button>
                    </Link>
                    <h1 className={styles.PainelH1}>{titulo}</h1>
                    <button className={styles.themeButton} onClick={() => changeTheme()}><i className={themeIcon}></i></button>
                </div>
                

                <div className={styles.PainelNav}>
                    
                    <input type="text" className={styles.PainelPesq} 
                    value={admSearchText} 
                    onChange={(e) => setAdmSearchText(e.target.value)}
                    placeholder="Hamburger..."/>

                    <div className={styles.PainelButtstNav}>
                        {/* <button className={styles.PainelFilt}>
                            <img src={filtro} alt="" />
                        </button> */}
                        <div>
                            <button className={styles.PainelNew} onClick={() => setNovo(!novo)}></ button>
                        </div>
                    </div>
                </div>
            </div>

            {
                viewProduct && <AdmProdutoModal produto={selectedProduct} setViewProduct={setViewProduct} setEditProduct={setEditProduct}/>
            }
            {
                editProduct && <AdmEditProductModal produto={selectedProduct} setEditProduct={setEditProduct}/>
            }

            <div className={styles.scrollDiv}>
                <div className={styles.PainelOutlet}>
                    <Outlet context={{setBackdrop, setViewProduct, setSelectedProduct, admSearchText}}/>
                </div>
            </div>

            {novo && (
                titulo == "CATEGORIAS"? 
                    <CriaCateg />
                :
                titulo == "PRODUTOS"?
                    <CriaProd />
                :
                    <CriaBanner />
            )}

        </div>
    )
}