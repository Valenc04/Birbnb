import { useNavigate } from 'react-router-dom';

const FormularioAlojamiento = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const ciudad = e.target.elements.ciudad.value; // Nota: hay un typo aquí, debería ser "ciudad" o "ciudad"
    const pais = e.target.elements.pais.value;

    if (ciudad === '' || pais === '') {
      alert('Por favor complete ambos campos!');
    } else {
      // Redireccionar a la ruta "/alojamientos" con parámetros de búsqueda
      navigate(
        `/app/alojamientosResults?ciudad=${encodeURIComponent(ciudad)}&pais=${encodeURIComponent(pais)}`,
      );
    }
  };

  return (
    <section className="hero-search">
      <form id="alojamientosForm" onSubmit={handleSubmit}>
        <h1>Elija las preferencias de su alojamiento</h1>
        <input
          type="text"
          id="ciudad"
          name="ciudad" // Añade name para acceder fácilmente a los valores
          className="form-control"
          placeholder="Ingrese la ciudad..."
        />
        <input
          type="text"
          id="pais"
          name="pais" // Añade name para acceder fácilmente a los valores
          className="form-control"
          placeholder="Ingrese el país..."
        />
        <button type="submit">Buscar</button>
      </form>
    </section>
  );
};

export default FormularioAlojamiento;
