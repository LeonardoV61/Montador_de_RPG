import { useState } from 'react'
import { Link } from 'react-router-dom';
import logo from '../../assets/Hydra.png';
import styles from './styles.NavBar.module.css'


export default function NavBar() {

  return (
    <>
    <nav>
        <div className={styles.logo}>
          <Link to="/" onClick={() => Location.reload()}><img  src={logo}/></Link>
        </div>
        <div className={styles.links}>
            <a href="#">Como funciona</a>
            <a href="#">Sistemas</a>
            <a href="#">Mesa</a>
            <a href="#">Entrar</a>
        </div>
    </nav>
    </>
  )
};