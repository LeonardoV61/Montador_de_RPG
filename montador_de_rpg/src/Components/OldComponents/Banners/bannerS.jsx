import styles from '../Css/styles.bannerS.module.css'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import img1 from '../../assets/Banners/Lanches.jpg'
import img2 from '../../assets/Banners/Porcoes.png'
import img3 from '../../assets/Banners/Pasteis.jpg'

export default function BannerS({ banners, ordem }){
    const bannersL = banners[ordem] || []
    console.log("b ordem", bannersL)
    
    return(
        <>
            <div style={{ width: "99%", margin: "0 .3vw" }}>
                {bannersL.length != 0?
                    <Carousel className={styles.carrousel} showArrows={true} showThumbs={false} showStatus={false} showIndicators={false} swipeable={true} >
                        {bannersL.map(banner => (
                            <div>
                                <img src={banner.imagem} alt="Slide 1" />
                                <div className={styles.bannerText}>
                                    <h1 className={styles.customTitle}>{banner.titulo}</h1>
                                    <p className={styles.customLegend}>{banner.sub_titulo}</p>
                                </div>
                            </div>
                        ))}
                    </Carousel>
                    :
                    <Carousel className={styles.carrousel} showArrows={true} showThumbs={false} showStatus={false} showIndicators={false} swipeable={true} >
                        <div>
                            <img src={img1} alt="Slide 1" />
                            <div className={styles.bannerText}>
                                <h1 className={styles.customTitle}>Lanches Variados</h1>
                                <p className={styles.customLegend}>Suculentos, artesanais e feitos para conquistar</p>
                            </div>
                        </div>
                        <div>
                            <img src={img2} alt="Slide 2" />
                            <div className={styles.bannerText}>
                                <h1 className={styles.customTitle}>Porções Irresistíveis</h1>
                                <p className={styles.customLegend}>Batatas e petiscos no ponto certo para compartilhar</p>
                            </div>
                        </div>
                        <div>
                            <img src={img3} alt="Slide 3" />
                            <div className={styles.bannerText}>
                                <h1 className={styles.customTitle}>Pastéis Crocantes</h1>
                                <p className={styles.customLegend}>Recheados de sabor, crocantes a cada mordida</p>
                            </div>
                        </div>
                    </Carousel>
                }
            </div>
        </>
    )
}




