// ReservaCard.jsx
import React, { useEffect, useState } from 'react';
import ReservaEstadoAccion from '../contenedorReserva/cambioEstado';
import { cambioEstado, normalizarFechaLocal } from '../../services/reservaServicie';
import { Link } from 'react-router-dom';
import { getAlojamientoById } from '../../services/alojamientoService';
import "./ReservaCard.css"


const ReservaCardCancelacion = ({ reserva }) => {
  const [alojamiento, setAlojamiento] = useState(null);
  const [estadoReserva, setEstadoReserva] = useState(reserva.estado);

  const fechaInicio = normalizarFechaLocal(reserva.rangoFechas?.fechaInicio);
  const fechaFin = normalizarFechaLocal(reserva.rangoFechas?.fechaFin);

  const diffMs = fechaFin - fechaInicio; // diferencia en milisegundos
  const cantidadNoches = Math.ceil(diffMs / (1000 * 60 * 60 * 24)); // en días
  const precioTotal = reserva.precioNoche * cantidadNoches;


  useEffect(() => {
    const fetchAlojamiento = async () => {
      const data = await getAlojamientoById(reserva.alojamientoId);
      setAlojamiento(data);
    };

    fetchAlojamiento();
  }, [reserva.alojamientoId]);

  //TODO: Mejorar el estilo
  return (
    <div className="reserva-card">
      <div className="reserva-header">
        <span className="reserva-fecha">Fecha: {reserva.fechaAlta}</span>
      </div>
      <div className="reserva-body">
        <p>
          <strong>Reserva:</strong> {reserva.reservaId}
        </p>
        <ul className="reserva-lista">
          <li>
            <strong>Cantidad huéspedes:</strong> {reserva.cantidadHuespedes}
          </li>
          <li>
            <strong>Alojamiento: </strong>
            <Link to={`/app/alojamiento/${reserva.alojamientoId}`}
                  className="link-alojamiento"
            >
              {alojamiento?.nombre}
            </Link>
          </li>
          <li>
            <strong>Rango fechas: </strong>
            {normalizarFechaLocal(reserva.rangoFechas?.fechaInicio).toLocaleDateString("es-AR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })} -{' '}
            {normalizarFechaLocal(reserva.rangoFechas?.fechaFin).toLocaleDateString("es-AR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </li>
          <li>
            <strong>Estado:</strong> {estadoReserva}
          </li>
          <li>
            <strong>Precio por noche: </strong>
            ${reserva.precioNoche}
          </li>
          <li>
            <strong>Cantidad de noches: </strong>
            {cantidadNoches}
          </li>
          <li>
            <strong>Total a pagar: </strong>
            ${precioTotal}
          </li>
        </ul>

        <div className="reserva-footer">
          <ReservaEstadoAccion
            id={reserva.reservaId}
            estadoDestino="CANCELADA"
            onSubmit={async (id, data) => {
              await cambioEstado(id, data);
              setEstadoReserva(data.estado); // actualiza el estado local para reflejar visualmente
            }}
            textoBoton="Cancelar"
            requiereMotivo={true}
            textoSuccess="¡Reserva cancelada con éxito!"
            botonClassName="reserva-boton"
            estadoActual={estadoReserva}
            fechaFin={reserva.rangoFechas?.fechaFin}
          />
        </div>
      </div>
    </div>

  );
}
export default ReservaCardCancelacion;