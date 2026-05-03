import NavB from "../Components/NavBar/navB.jsx";
import Footer from "../Components/Footer/Footer.jsx";
import Banner from "../Components/Banners/bannerS.jsx";

export default function Home({ banners }) {
  // fallback caso banners venha vazio
  const bannersList =
    banners || JSON.parse(localStorage.getItem("banners")) || [];

  return (
    <>
      <NavB />

      <main className="main">
        <Banner banners={bannersList} />
      </main>

      <Footer />
    </>
  );
}
