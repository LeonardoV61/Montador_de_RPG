import { useRef } from "react";
import NavBar from "../Components/NavBar/navBar.jsx";
import Inicio from "../Components/Inicio/Inicio.jsx";
import Divisor from "../Components/Divisor/Divisor.jsx"
import Recursos from "../Components/Recursos/Recursos.jsx";
import Fluxo from "../Components/Fluxo/Fluxo.jsx";
import Sistemas from "../Components/Sistemas/Sistemas.jsx";
import CTA from "../Components/CTA/CTA.jsx";
import Footer from "../Components/Footer/Footer.jsx";

export default function Home() {
  const recursosRef = useRef(null);

  function scrollToRecursos() {
    if (recursosRef.current) {
      var offsetTop = recursosRef.current.offsetTop;
      var navHeight = 80; 
      window.scrollTo({
        top: offsetTop - navHeight,
        behavior: "smooth"
      });
    }
  };
  
  return (
    <>
      <NavBar />
      <main className='main'>
        <Inicio onExplorar={scrollToRecursos} />
        <Divisor />
        <div ref={recursosRef}>
          <Recursos />
        </div>
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
