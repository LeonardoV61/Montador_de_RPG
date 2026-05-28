import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/Hydra.png';
import styles from './styles.NavBar.module.css'


export default function NavBar() {
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
          <div className={styles.logo}>
            <Link to="/" onClick={backToBegin}><img  src={logo} alt="Logo do Montador de RPG"/></Link>
          </div>
          <div className={styles.links}>
            <li><Link to="/" onClick={() => Location.reload()}>Como Funciona</Link></li>
            <li><Link to="/" onClick={() => Location.reload()}>Sistemas</Link></li>
            <li><Link to="/" onClick={() => Location.reload()}>Mesa</Link></li>
          </div>
        </div>
        {localStorage.getItem("authenticated") === "true" ? (
          <button className={`${styles.btnDouradoCheio} ${styles.link}`} onClick={() => navigate('/menu')}>Perfil</button>
        ):(
          <div className={styles.links}>
              <li><Link to="/login" onClick={() => Location.reload()}>Entrar</Link></li>
              <button className={`${styles.btnDouradoCheio} ${styles.link}`} onClick={() => navigate('/jogo')}>Jogar Agora</button>
          </div>
        )}
    </nav>
    </>
  )
};