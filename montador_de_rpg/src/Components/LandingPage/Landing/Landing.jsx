import { useState } from 'react'
import NavBar from '../NavBar/NavBar'
import Inicio from '../Inicio/Inicio'
import Recursos from './Recursos'
import Fluxo from './Fluxo'
import Sistemas from '../Sistemas/Sistemas'
import CTA from '../CTA/CTA'
import Footer from '../Footer/Footer'
import styles from './Landing.css'

export default function Landing() {

  return (
    <>
    <NavBar />
    <Inicio />
    <div className={styles.divisor}><div className={styles.divisorCentro}></div></div>
    <Recursos />
    <div className={styles.divisor}><div className={styles.divisorCentro}></div></div>
    <Fluxo />
    <Sistemas />
    <CTA />
    <Footer />
    </>
  )
}