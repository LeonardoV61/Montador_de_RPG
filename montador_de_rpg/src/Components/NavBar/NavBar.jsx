import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/Hydra.png';
import styles from './styles.NavBar.module.css'


export default function NavBar() {
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

  return (
    <>
    <nav className={`${styles.navContainer} ${scrolled ? styles.navScrolled : ''}`}>
        <div className={styles.navContents}>
          <div className={styles.logo}>
          <Link to="/" onClick={() => Location.reload()}><img  src={logo}/></Link>
          </div>
          <div className={styles.links}>
            <a href="#">Como funciona</a>
            <a href="#">Sistemas</a>
            <a href="#">Mesa</a>
          </div>
        </div>
        
        <div className={styles.links}>
            <a href="#">Entrar</a>
            <button className={styles.btnDouradoCheio}>Jogar Agora</button>
        </div>
    </nav>
    </>
  )
};