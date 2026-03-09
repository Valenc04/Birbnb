import { useState } from 'react';
import UsuarioCard from '../perfilUsuario/UsuarioCard';
import './AlojamientoInfo.css';

const AlojamientoInfo = ({ alojamiento }) => {
  const [verMas, setVerMas] = useState(false);

  const textoCompleto = alojamiento.descripcion;
  const mostrarCorto = !verMas && textoCompleto.length > 250;
  const textoMostrar = mostrarCorto ? textoCompleto.slice(0, 250) : textoCompleto;

  return (
    <section className="detalles">
      <div className="detalles-especificos">
        <h2>{alojamiento.nombre}</h2>
        <p>
          Cantidad de huespedes máxima: <span>{alojamiento.cantHuespedesMax}</span>
        </p>
        <p>
          Dirección: <span>{alojamiento.direccion.ciudad.nombre}</span> - <span>{alojamiento.direccion.calle}</span>
        </p>
      </div>

      <UsuarioCard className="compacto" usuario={alojamiento.anfitrion} />

      <div className="descripcion">
        <h2>Descripción</h2>
        <p className={`descripcion-texto ${mostrarCorto}`}>
          {textoMostrar}
        </p>
        {textoCompleto.length > 150 && (
          <button className="btn-ver-mas" onClick={() => setVerMas(!verMas)}>
            {verMas ? 'Ver menos' : 'Ver más'}
          </button>
        )}
      </div>

      <div className="container-caracteristicas">
        <h2>¿Qué ofrece este lugar?</h2>
        <div className="caracteristicas">
          {alojamiento.caracteristicas.map((categoria, index) => (
            <div key={index}>
              <p>{categoria}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AlojamientoInfo;
