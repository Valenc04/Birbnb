import axios from 'axios';
import { eachDayOfInterval } from "date-fns";
import urlBackend from './urlBackend';

const BACKEND_URL = urlBackend()


export async function saveReserva(reservaData) {
  try {
    const response = await axios.post(`${BACKEND_URL}/reserva`, reservaData)

    return response.data

  } catch (error) {
   console.error("Error completo:", error);
     const mensajeError = "Reserva ya realizada"
  throw new Error(mensajeError);
  }
}

export async function ConsultarDisponibilidad(reservaData, id) {
  try {
    const response = await axios.get(`${BACKEND_URL}/alojamiento/${id}/disponible`, {
      params: reservaData
    });
    return response.data;
  } catch (error) {
    console.error("Error completo:", error);
    const mensajeError = error.response?.data?.message || "Error consultar disponibilidad del alojamiento";
    throw new Error(mensajeError);
  }
}

export async function cambioEstado(id,cambioEstadoData) {
  try{
    const response = await axios.post(`${BACKEND_URL}/reserva/${id}/cambioEstado`, cambioEstadoData)
    return response.data
  }catch(error){
     console.error("Error completo:", error);
    const mensajeError =  "La reserva"
    throw new Error(mensajeError)
  }
  
}

export async function findAllByUserId(userId, query) {
  try{
    const response = await axios.get(`${BACKEND_URL}/reserva/${userId}/historial`, {
      params: query
    })
    return response.data;
  }catch(error){
     console.error("Error completo:", error);
    const mensajeError = error.response?.data?.message || "Error consultar reservas del usuario"
    throw new Error(mensajeError)
  }
}

export async function findAllByAnfitrionId(userId, query) {
  try{
    const response = await axios.get(`${BACKEND_URL}/reserva/${userId}/historial-anfitrion`, {
      params: query
    })
    return response.data;
  }catch(error){
    console.error("Error completo:", error);
    const mensajeError = error.response?.data?.message || "Error consultar reservas del usuario"
    throw new Error(mensajeError)
  }
}

  export const calcularNoches = (fechaInicio, fechaFin) => {
    if (!fechaInicio || !fechaFin) return 0;
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const diff = fin.getTime() - inicio.getTime();
    return diff > 0 ? diff / (1000 * 3600 * 24) : 0;
  };
  
  export async function reservasOcupadas(id){
    try{                                   //Por que con esta ruta si funciona ?
      const response = await axios.get(`${BACKEND_URL}/alojamiento/${id}/reservas-ocupadas`)
      return response.data;
    }catch(error){
       console.error("Error completo:", error);
       const mensajeError = error.response?.data?.message || "Error consultar reservas ocupadas del alojamiento";
    throw new Error(mensajeError);
  }
    }
  
export function normalizarFechaLocal(fecha) {
  const utc = new Date(fecha);
  return new Date(utc.getUTCFullYear(), utc.getUTCMonth(), utc.getUTCDate());
}

export function obtenerFechasOcupadas(rangos) {
  return rangos.flatMap(({ fechaInicio, fechaFin }) => {
    return eachDayOfInterval({
      start: normalizarFechaLocal(fechaInicio),
      end: normalizarFechaLocal(fechaFin),
    });
  });
}
