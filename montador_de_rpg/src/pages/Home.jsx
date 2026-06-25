import { useRef } from "react";
import NavBar from "../Components/NavBar/navBar.jsx";
import Inicio from "../Components/PaginaInicial/Inicio/Inicio.jsx";
import Divisor from "../Components/PaginaInicial/Divisor/Divisor.jsx"
import Recursos from "../Components/PaginaInicial/Recursos/Recursos.jsx";
import Fluxo from "../Components/PaginaInicial/Fluxo/Fluxo.jsx";
import Sistemas from "../Components/PaginaInicial/Sistemas/Sistemas.jsx";
import CTA from "../Components/PaginaInicial/CTA/CTA.jsx";
import Footer from "../Components/Footer/Footer.jsx";

export default function Home() {
  const recursosRef = useRef(null);
  const fluxoRef = useRef(null);
  const sisRef = useRef(null);

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
      <NavBar fluxoRef={fluxoRef} sisRef={sisRef}/>
      <main className='main'>
        <Inicio onExplorar={scrollToRecursos} />
        <Divisor />
        <div ref={recursosRef}>
          <Recursos />
        </div>
        <Divisor ref={fluxoRef}/>
        <Fluxo />
        <Divisor ref={sisRef}/>
        <Sistemas />
        <CTA /> 
      </main>
      <Footer />
    </>
  );
}
