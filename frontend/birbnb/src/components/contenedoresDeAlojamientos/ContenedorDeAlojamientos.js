import AlojamientoCard from './AlojamientoCard';
import ContenedorHeader from './ContenedorHeader';
import React, { useEffect, useState } from 'react';
import { getAlojamientosByMultipleFilters } from '../../services/alojamientoService';
import './ContenedorDeAlojamientos.css';

const ContenedorDeAlojamientos = ({ ciudad, pais, precioMin, precioMax, cantidad, caracteristicas, rangoFechas, page, limit = 4 }) => {
  const [alojamientos, setAlojamientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlojamientos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getAlojamientosByMultipleFilters({
          ciudad,
          pais,
          min: precioMin || 0,
          max: precioMax || 1000000,
          cantidad: cantidad || 1,
          caracteristicas: caracteristicas || undefined,
          rangoFechas: rangoFechas || undefined,
          page: page || 1,
          limit
        });

        setAlojamientos(response.items || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Error al buscar alojamientos');
        setAlojamientos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAlojamientos();
  }, [ciudad, pais, precioMin, precioMax, cantidad, caracteristicas, rangoFechas, page, limit]);

  return (
    <>
      <ContenedorHeader ciudad={ciudad} pais={pais} />
      
      <div className="cards">
        {loading ? (
          [1, 2, 3, 4].map((item) => (
            <div key={item} className="alojamiento-card skeleton">
              <div className="alojamiento-img skeleton-img"></div>
              <div className="card-content">
                <div className="skeleton-text"></div>
                <div className="skeleton-text"></div>
              </div>
            </div>
          ))
        ) : error ? (
          <div className="no-results">
            <span role="img" aria-label="error">❌</span>
            <h3>{error}</h3>
            <p>Intenta con otros parámetros de búsqueda</p>
          </div>
        ) : alojamientos.length > 0 ? (
          alojamientos.map((alojamiento) => (
            <AlojamientoCard key={alojamiento.id} {...alojamiento} />
          ))
        ) : (
          <div className="no-results">
            <span role="img" aria-label="triste">😢</span>
            <h3>No hay alojamientos disponibles</h3>
            <p>Prueba cambiando tus filtros de búsqueda</p>
          </div>
        )}
      </div>
    </>
  );
};

export default ContenedorDeAlojamientos;