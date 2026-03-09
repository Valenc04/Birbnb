import { useState } from 'react';
import { saveReserva } from '../../services/reservaServicie.js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/usuarioContext.js';
import ReservaExitoSpinner from '../Spiner/ReservaExitosa_Spiner.js';

const FormularioReserva = ({
  formData,
  alojamiento,
  precioTotal,
  recargarFechas,
}) => {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mostrarFeedback, setMostrarFeedback] = useState(false); // un solo estado para manejar todo
  const [reservaExitosa, setReservaExitosa] = useState(false);
  const handleReservar = async () => {
    if (!usuario || !usuario.email) {
      navigate('/login');
      return;
    }

  const formatoFecha = (fecha) => {
    const date = new Date(fecha);
    date.setDate(date.getDate() + 1); 
    return date.toLocaleDateString('es-AR');
  };


    const reservaData = {
      huespedReservador: {
        idhuespedReservador: usuario.email,
      },
      alojamiento: {
        idalojamiento: alojamiento?.id,
      },
      cantHuespedes: Number(formData.huespedes),
      rangoFechas: {
        fechaInicio: formData.fechaEntrada,
        fechaFin: formData.fechaSalida,
      },
      precioPorNoche: formData.precioPorNoche,
    };

    try {
      setLoading(true);
      setMostrarFeedback(true);
      await saveReserva(reservaData);
      setMensaje({
        titulo: '¡Reserva creada con éxito!',
        detalles: [
          `📅 Fechas: ${formatoFecha(formData.fechaEntrada)} a ${formatoFecha(formData.fechaSalida)}`,
          `🏡 Alojamiento: ${alojamiento?.nombre}`,
          `💵 Precio total: $${precioTotal}`,
        ],
      });

      setReservaExitosa(true);
    } catch (error) {
      console.error('Error al reservar:', error);
      setError(` ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const cerrarFeedback = () => {
    setMostrarFeedback(false);
    setMensaje('');
    if (typeof recargarFechas === 'function') recargarFechas();
  };

  return (
    <>
      {mostrarFeedback && (
        <ReservaExitoSpinner
          loading={loading}
          mensaje={mensaje}
          onClose={cerrarFeedback}
          autoClose={false}
        />
      )}

      {!reservaExitosa && (
        <div>
          <button
            className="botonReservar"
            onClick={handleReservar}
            disabled={loading}
          >
            {loading ? 'Reservando...' : 'Reservar'}
          </button>
          {error && (
            <div
              className="mensaje-error"
              style={{ color: 'red', marginTop: '10px' }}
            >
              ❌ Error al realizar la reserva: {error}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default FormularioReserva;
