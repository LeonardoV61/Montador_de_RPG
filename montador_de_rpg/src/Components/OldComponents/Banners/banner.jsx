import { Banners } from '../../assets/Data/Banners'

export default function Banner(){
    const listaBanners = Banners.map(
        (banner) => 
            <div key={banner.id}>
                <img src={getImagePath(banner)}/>
                <h1 className={`legend ${styles.customTitle}`}>{banner.title}</h1>
                <p className={`legend ${styles.customLegend}`}>{banner.desc}</p>
            </div>
    )
    return(
        <>
        <Banner/></>
    )
}