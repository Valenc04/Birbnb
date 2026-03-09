import SearchField from '../searchBar/generic/SearchField';
import FormularioReserva from './formularioCrearReserva';
import DateRangeComp from '../contenedorReserva/calendarioReserva';
import { useDisponibilidadReserva } from '../contenedorReserva/disponibilidad';
import '../alojamiento/ReservarSection.css';

const ConsultarDisponibilidadReserva = ({ alojamiento }) => {
  const {
    datos,
    fechasOcupadas,
    resultado,
    error,
    loading,
    noches,
    refCalendario,
    handleDateChange,
    handleInputChange,
    handleConsulta,
    recargarFechas,
  } = useDisponibilidadReserva(alojamiento?.id, alojamiento?.cantHuespedesMax);

  return (
    <section className="reservar">
      <h3>
        {noches > 0 ? (
          <h3>
            Precio total ({noches} {noches === 1 ? 'noche' : 'noches'}):{' '}
            <strong>${noches * alojamiento?.precioPorNoche}</strong>
          </h3>
        ) : (
          <h3>Agrega las fechas para ver los precios</h3>
        )}
      </h3>

      <div className="form">
        <SearchField label="FECHAS">
          <DateRangeComp
            ref={refCalendario}
            onChange={handleDateChange}
            fechasOcupadas={fechasOcupadas}
          />
        </SearchField>

        <SearchField
          type="number"
          label="HUÉSPEDES"
          name="cantHuespedes"
          value={datos.cantHuespedes}
          min="1"
          max={alojamiento?.cantHuespedesMax}
          onChange={handleInputChange}
          onKeyDown={(e) => e.preventDefault()}
        />
      </div>

      {(resultado === null || resultado === false) && (
        <button onClick={handleConsulta} disabled={loading}>
          {loading ? 'Consultando...' : 'Consultar Disponibilidad'}
        </button>
      )}

      {resultado === true && (
        <FormularioReserva
          formData={{
            fechaEntrada: datos.fechaInicio,
            fechaSalida: datos.fechaFin,
            huespedes: datos.cantHuespedes,
            precioPorNoche: alojamiento?.precioPorNoche,
          }}
          alojamiento={alojamiento}
          precioTotal={noches * alojamiento?.precioPorNoche}
          recargarFechas={recargarFechas}
        />
      )}

      {error && <p className="error">{error}</p>}
    </section>
  );
};

export default ConsultarDisponibilidadReserva;
