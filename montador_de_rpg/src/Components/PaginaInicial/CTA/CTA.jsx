import { useState } from 'react'
import { Link } from 'react-router-dom';
import styles from './styles.CTA.module.css'

export default function CTA() {

  return (
    <>
    <div className={styles.cta}>
        <h2>Pronto para sua <em>primeira sessão?</em></h2>
        <p>A mesa está posta. Os dados, rolados. Falta apenas você e seu grupo.</p>
        <Link to="/login" onClick={() => Location.reload()} className={styles.link}><button className={styles.btnDouradoCheio}>Começar gratuitamente ↗</button></Link>
    </div>
    </>
  )
}