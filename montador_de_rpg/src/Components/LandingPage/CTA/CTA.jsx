import { useState } from 'react'
import styles from './CTA.css'

export default function CTA() {

  return (
    <>
    <div className={styles.cta}>
        <h2>Pronto para sua <em>primeira sessão?</em></h2>
        <p>A mesa está posta. Os dados, rolados. Falta apenas você e seu grupo.</p>
        <button className={styles.btnDouradoCheio}>Começar gratuitamente ↗</button>
    </div>
    </>
  )
}