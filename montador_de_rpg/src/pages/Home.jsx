import NavBar from "../Components/NavBar/NavBar.jsx";
import Inicio from "../Components/Inicio/Inicio.jsx";
import Divisor from "../Components/Divisor/Divisor.jsx"
import Recursos from "../Components/Recursos/Recursos.jsx";
import Fluxo from "../Components/Fluxo/Fluxo.jsx";
import Sistemas from "../Components/Sistemas/Sistemas.jsx";
import CTA from "../Components/CTA/CTA.jsx";
import Footer from "../Components/Footer/Footer.jsx";

export default function Home({ banners }) {

  return (
    <>
      <NavBar />

      <main className='main'>
        <Inicio />
        <Divisor />
        <Recursos />
        <Divisor />
        <Fluxo />
        <Divisor />
        <Sistemas />
        <CTA /> 
      </main>

      <Footer />
    </>
  );
}
