import { useState, useEffect, useRef ,useCallback } from 'react';
import {
  reservasOcupadas,
  obtenerFechasOcupadas,
  ConsultarDisponibilidad,
  calcularNoches,
} from '../../services/reservaServicie';

export function useDisponibilidadReserva(idalojamiento, cantHuespMax) {
  const [datos, setDatos] = useState({
    fechaInicio: '',
    fechaFin: '',
    cantHuespedes: 1,
  });
  const [fechasOcupadas, setFechasOcupadas] = useState([]);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const refCalendario = useRef();

  useEffect(() => {
    async function cargarFechas() {
      try {
        const rangos = await reservasOcupadas(idalojamiento);
        
        const fechas = obtenerFechasOcupadas(rangos);
       
        setFechasOcupadas(fechas);
      
      } catch (err) {
        console.error('Error al obtener fechas ocupadas', err);
      }
    }
    cargarFechas();
  }, [idalojamiento]);

   const cargarFechas = useCallback(async () => {
    try {
      const rangos = await reservasOcupadas(idalojamiento);
      const fechas = obtenerFechasOcupadas(rangos);
      setFechasOcupadas(fechas);
    } catch (err) {
      console.error('Error al obtener fechas ocupadas', err);
    }
  }, [idalojamiento]); 

  useEffect(() => {
    cargarFechas()
  }, [cargarFechas]); 

  useEffect(() => {
    setDatos({
      fechaInicio: '',
      fechaFin: '',
      cantHuespedes: 1,
    });
    setResultado(null);
  }, [fechasOcupadas]);

  const handleDateChange = ([inicio, fin]) => {
    if (!inicio || !fin || !(inicio instanceof Date) || !(fin instanceof Date)) {
      setDatos((prev) => ({
        ...prev,
        fechaInicio: '',
        fechaFin: '',
      }));
      setResultado(null);
      return;
    }
    
   const diffMs = fin.getTime() - inicio.getTime();
  const diffDias = diffMs / (1000 * 60 * 60 * 24);

  if (diffDias < 1) {
    setError('La estadía debe ser de al menos una noche');
    setDatos((prev) => ({
      ...prev,
      fechaInicio: '',
      fechaFin: '',
    }));
    setResultado(null);
    return;
  }

  setError(null); 

    setDatos((prev) => ({
      ...prev,
      fechaInicio: inicio.toISOString().split('T')[0],
      fechaFin: fin.toISOString().split('T')[0],
    }));
    setResultado(null);
    setError(null);
  };

 const handleInputChange = (event) => {
  const { name, value } = event.target;
  setDatos((prev) => ({
    ...prev,
    [name]: name === 'cantHuespedes' ? Number(value) : value,
  }));
  setResultado(null);
  setError(null);
};
  useEffect(() => {
  setResultado(null);
}, [datos.fechaInicio, datos.fechaFin, datos.cantHuespedes]);

  const handleConsulta = async () => {
    const cant = Number(datos.cantHuespedes);
    if (!datos.fechaInicio || !datos.fechaFin) {
      setError('Seleccioná un rango de fechas');
      refCalendario.current?.abrirCalendario();
      return;
    }
    if (!Number.isInteger(cant) || cant <= 0 || cant > cantHuespMax) {
      setError(`Ingrese una cantidad de huéspedes válida del 1 al ${cantHuespMax}`);
      return;
    }
     setResultado(null);
    setLoading(true);
    try {
      const res = await ConsultarDisponibilidad(datos, idalojamiento);
      setResultado(res);
      setError(null);
    } catch (err) {
      setError('No se pudo consultar la disponibilidad.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    datos,
    fechasOcupadas,
    resultado,
    error,
    loading,
    noches: calcularNoches(datos.fechaInicio, datos.fechaFin),
    refCalendario,
    handleDateChange,
    handleInputChange,
    handleConsulta,
    setResultado,
    recargarFechas: cargarFechas,
  };
}