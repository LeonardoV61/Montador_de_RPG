import styles from '../Css/styles.Footer.module.css';

export default function Footer() {
  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <p>© 2025 Barbalao. Todos os direitos reservados.</p>
          <div className={styles.socials}>
            <div className={styles.socialLinks}>
              <i class="ri-whatsapp-fill"></i>
              <a href="https://wa.me/5519996829711">Whatsapp</a>
            </div>
            <div className={styles.socialLinks}>
              <i className="ri-instagram-fill"></i>
              <a href='https://www.instagram.com/bar_balao/'>Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
