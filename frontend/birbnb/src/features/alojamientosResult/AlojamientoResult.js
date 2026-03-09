import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ContenedorDeAlojamientos from '../../components/contenedoresDeAlojamientos/ContenedorDeAlojamientos';
import './AlojamientoResult.css';
import SearchBar from '../../components/searchBar/SearchBar';

export const AlojamientoResult = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [currentPage, setCurrentPage] = useState(1);
  const [showNextButton, setShowNextButton] = useState(false);

  // Recuperar parámetros del query
  const ciudad = searchParams.get('ciudad') || '';
  const pais = searchParams.get('pais') || '';
  const min = searchParams.get('min') || '';
  const max = searchParams.get('max') || '';
  const cantidad = searchParams.get('cantidad') || '';
  const caracteristicas = searchParams.get('caracteristicas') || '';
  const rangoFechas = searchParams.get('rangoFechas') || '';

  // Separar fechas
  const [fechaEntrada = '', fechaSalida = ''] = rangoFechas.split(',');

  // Convertir características a objeto
  const caracteristicasArray = caracteristicas.split(',');
  const initialCheckboxes = {
    wifi: caracteristicasArray.includes('WIFI'),
    pool: caracteristicasArray.includes('PISCINA'),
    pets: caracteristicasArray.includes('MASCOTAS_PERMITIDAS'),
    parking: caracteristicasArray.includes('ESTACIONAMIENTO')
  };

  const handleNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Comprobación simple cuando cambia la página o los parámetros de búsqueda
    const alojamientosEnPagina = document.querySelectorAll('.alojamiento-card').length;
    setShowNextButton(alojamientosEnPagina === 4); // Mostrar siguiente solo si hay 10 items
  }, [currentPage, location.search]);

  return (
    <div className="alojamiento-result-container">
      <div className="alojamientos-wrapper">
        <SearchBar
          initialValues={{
            DESTINO: ciudad && pais ? `${ciudad}, ${pais}` : '',
            HUESPEDES: cantidad,
            PRECIOMIN: min,
            PRECIOMAX: max,
            fechaEntrada,
            fechaSalida,
            checkboxes: initialCheckboxes
          }}
        />
        <ContenedorDeAlojamientos
          ciudad={ciudad}
          pais={pais}
          precioMin={min}
          precioMax={max}
          cantidad={cantidad}
          caracteristicas={caracteristicas}
          rangoFechas={rangoFechas}
          page={currentPage}
        />
      </div>
      <div className="paginacion-container">
        <div className="paginacion-controls">
          <button
            className={`paginacion-btn prev-btn ${currentPage === 1 ? 'disabled' : ''}`}
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            &larr; Anterior
          </button>

          <div className="pagina-indicador">
            Página {currentPage}
          </div>

          {showNextButton && (
            <button className="paginacion-btn next-btn" onClick={handleNextPage}>
              Siguiente &rarr;
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlojamientoResult;