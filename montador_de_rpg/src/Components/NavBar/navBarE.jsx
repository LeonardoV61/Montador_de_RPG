import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/Hydra.png';
import styles from './styles.NavBar.module.css'

export default function NavBar() {
  return (
    <>
    <nav className={styles.navContainer}>
        <div className={styles.navContents}>
          <div className={styles.logo}>
            <Link to="/" onClick={() => Location.reload()}><img  src={logo} alt="Logo do Montador de RPG"/></Link>
          </div>
        </div>
        
        <div className={styles.links}>
            <li><Link to="/" onClick={() => Location.reload()}>Como Funciona</Link></li>
            <li><Link to="/" onClick={() => Location.reload()}>Sistemas</Link></li>
            <li><Link to="/" onClick={() => Location.reload()}>Mesa</Link></li>
        </div>
    </nav>
    </>
  )
};