import './NotificationCard.css';

const NotificationCard = ({ notificacion, onMarcarComoLeida }) => {
  const mensajeFormateado = notificacion.mensaje
    .split('\n')
    .map((linea, index) => (
      <span key={index}>
        {linea}
        <br />
      </span>
    ));

  return (
    <div className="reserva-card">
      <div className="reserva-header">
        <span className="reserva-fecha">
          {new Date(notificacion.fechaAlta).toLocaleString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      </div>
      <div className="reserva-body">
        <ul className="reserva-lista">
          <li>
            <strong>Mensaje:</strong>
            <div className="mensaje-formateado">
              {mensajeFormateado}
            </div>
          </li>
          <li>
            <strong>Estado:</strong> {notificacion.leida ? "✅ Leída" : "📭 No leída"}
          </li>
        </ul>
        <div className="reserva-footer">
          {!notificacion.leida && (
            <button className="reserva-boton" onClick={() => onMarcarComoLeida(notificacion.id)}>
              Marcar como leída
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
