import './AlojamientoCard.css';
import { Link } from 'react-router-dom';

const AlojamientoCard = ({
  id,
  nombre,
  precioPorNoche,
  cantHuespedesMax,
  fotos = [] // Valor por defecto para evitar errores
}) => (
  <Link to={`/app/alojamiento/${id}`} className="alojamiento-card-link">
    <div className="alojamiento-card">
      <div className="card-content">
        <h4>{nombre}</h4>
        {fotos.length > 0 && (
          <img
            src={fotos[0].path}
            alt={fotos[0].descripcion}
            className="alojamiento-image"
          />
        )}
        <div className="card-details">
          <p>Precio por noche: ${precioPorNoche}</p>
          <p>Huéspedes máximos: {cantHuespedesMax}</p>
        </div>
      </div>
    </div>
  </Link>
);

export default AlojamientoCard;
