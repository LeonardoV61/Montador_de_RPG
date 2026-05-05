import styles from '../Css/styles.navB.module.css';
import logo from '../../assets/Hydra.png';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function NavB({setSearchModal, searchText, setSearchText}) {

  /* Exibibe botão painel se autenticado */
  // const [link, setLink] = useState(null)
  // useEffect(() => {
  //   if (authenticated) {
  //     setLink(<li><a href="/adm">ADM</a></li>);
  //   } else {
  //     setLink(null);
  //   }
  // }, []);

  /* inicializa tema */
  let currentTheme = localStorage.getItem("theme") || "";
  if (!currentTheme.includes('dark') && !currentTheme.includes('light')) {
    currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";
    localStorage.setItem("theme", currentTheme);
  }
  
  /* define o icone do tema */
  let currentIcon = currentTheme == "dark" ? "ri-sun-fill sun-icon" : "ri-moon-fill moon-icon";
  const [themeIcon, setThemeIcon] = useState(currentIcon);
  document.body.classList = currentTheme;

  function changeTheme() {
      currentTheme = currentTheme == "light" ? "dark" : "light";
      localStorage.setItem("theme", currentTheme);
      currentIcon = currentTheme == "dark" ? "ri-sun-fill sun-icon" : "ri-moon-fill moon-icon";
      setThemeIcon(currentIcon);
      document.body.classList = currentTheme;
  }

  
  useEffect(() => {
    const header = document.querySelector("header");
    const handleScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add(styles.shrink);
      } else {
        header.classList.remove(styles.shrink);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
      
  return (
        <>
         {/*<!--========== Header ==========-->*/}
            <header className={styles.header}>
                <div className={styles.inner}>
                    <div className={styles.logo}>
                        <Link to="/" onClick={() => Location.reload()}><img  src={logo}/></Link>
                    </div>
                    {/* <div className={styles.searchBar}>
                      <input type="text" value={searchText} 
                      onChange={(e) => setSearchText(e.target.value)} 
                      name="searchBar" 
                      id="searchBar" 
                      placeholder='Pesquise algum produto...'/>
                      <button onClick={() => {
                        if (searchText) {
                          setSearchModal(true)
                        } else {
                          alert("Pesquise algo primeiro");
                        }
                        }}>
                          <i className="ri-search-line"></i> 
                      </button>
                    </div> */}
                    <div className={styles.headerBtns}>
                        <li><Link to="/" onClick={() => Location.reload()}>Início</Link></li>
                        <li><Link to="/about-us" onClick={() => Location.reload()}>Sobre Nós</Link></li>
                        {/* {link} */}
                        <button className={styles.themeButton} onClick={() => changeTheme()}><i className={themeIcon}></i></button>
                    </div>
                </div>
                <div className="scroll-indicator-bar"></div>
            </header>
        </> 
    )
}





