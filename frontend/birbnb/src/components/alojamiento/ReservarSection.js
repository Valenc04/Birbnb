import ConsultarDisponibilidadReserva from '../formularioReserva/formularioConsultarDisponibilidad';

const ReservarSection = ({ alojamiento }) => {
  return (
    <ConsultarDisponibilidadReserva
      alojamiento ={alojamiento}
    />
  );
};

export default ReservarSection;
