import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/Hydra.png';
import styles from './styles.navBar.module.css'


export default function NavBar({fluxoRef, sisRef}) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Limpeza do evento ao desmontar o componente
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function backToBegin(){
    window.scrollTo({top: 0, behavior: "smooth"});
  };

  return (
    <>
    <nav className={`${styles.navContainer} ${scrolled ? styles.navScrolled : ''}`}>
        <div className={styles.navContents}>
          <div className={styles.logo}><img onClick={backToBegin} src={logo} alt="Logo do Montador de RPG"/></div>
          <div className={styles.links}>
            <li onClick={() => fluxoRef.current.scrollIntoView({ behavior: "smooth" })}>Como Funciona</li>
            <li onClick={() => sisRef.current.scrollIntoView({ behavior: "smooth" })}>Sistemas</li>
            {/* <li onClick={() => Location.reload()}>Mesa</li> */}
          </div>
        </div>
        {localStorage.getItem("authenticated") === "true" ? (
          <button className={`${styles.btnDouradoCheio} ${styles.link}`} onClick={() => navigate('/menu')}>Perfil</button>
        ):(
          <div className={styles.links}>
              <Link to="/login"><li>Entrar</li></Link>
              <Link to="/login"><button className={`${styles.btnDouradoCheio} ${styles.link}`}>Jogar Agora</button></Link>
          </div>
        )}
    </nav>
    </>
  )
};