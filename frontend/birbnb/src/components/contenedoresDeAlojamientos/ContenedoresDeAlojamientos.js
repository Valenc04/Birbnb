import ContenedorDeAlojamientos from './ContenedorDeAlojamientos.js';
import './ContenedoresDeAlojamientos.css';

const ContenedoresDeAlojamientos = () => (
  <section className="alojamiento-containers">
    <ContenedorDeAlojamientos ciudad="Buenos Aires" pais="Argentina" />
    <ContenedorDeAlojamientos ciudad="Caballito" pais="Venezuela" />
  </section>
);

export default ContenedoresDeAlojamientos;
