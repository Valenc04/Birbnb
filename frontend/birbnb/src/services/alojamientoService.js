import axios from 'axios';
import urlBackend from './urlBackend';

const BACKEND_URL = urlBackend()


export const getAlojamientosByMultipleFilters = async (filters) => {
  const params = new URLSearchParams();

  if (filters.pais) params.append('pais', filters.pais);
  if (filters.ciudad) params.append('ciudad', filters.ciudad);
  if (filters.min !== undefined) params.append('min', filters.min);
  if (filters.max !== undefined) params.append('max', filters.max);
  if (filters.cantidad !== undefined) params.append('cantidad', filters.cantidad);
  if (filters.caracteristicas && filters.caracteristicas.length > 0) params.append('caracteristicas', filters.caracteristicas);
  if (filters.rangoFechas) params.append('rangoFechas', filters.rangoFechas)
  if (filters.page) params.append('page', filters.page);
  if (filters.limit) params.append('limit', filters.limit);

  const url = `${BACKEND_URL}/alojamientos?${params.toString()}`;
  console.log('🚀 URL final:', url);

  const response = await axios.get(url,
    {
      headers: {
        'Content-Type': 'application/json',
      }
    }
  );

  
  return response.data;
};


export const getAlojamientoById = async (id) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/alojamientos/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener el alojamiento');
  }
};