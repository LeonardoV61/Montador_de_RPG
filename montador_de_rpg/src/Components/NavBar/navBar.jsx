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
            <Link to="/" onClick={() => Location.reload()}><img  src={logo} alt="Logo do Montador de RPG"/></Link>
          </div>
          <div className={styles.links}>
            <li><Link to="/" onClick={() => Location.reload()}>Como Funciona</Link></li>
            <li><Link to="/" onClick={() => Location.reload()}>Sistemas</Link></li>
            <li><Link to="/" onClick={() => Location.reload()}>Mesa</Link></li>
          </div>
        </div>
        
        <div className={styles.links}>
            <li><Link to="/" onClick={() => Location.reload()}>Entrar</Link></li>
            <button className={styles.btnDouradoCheio}>Jogar Agora</button>
        </div>
    </nav>
    </>
  )
};