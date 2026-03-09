export const formatearMensajeNotificacion = (mensaje) => {

  const {
    titulo,
    adicional,
    huesped,
    anfitrion,
    inicioReserva,
    finReserva,
    alojamiento,
    horarioCheckIn,
    horarioCheckOut,
    motivo,
    duracion
  } = mensaje;

  const formatoFecha = (fecha) => {
    const date = new Date(fecha);
    date.setDate(date.getDate() + 1); 
    return date.toLocaleDateString('es-AR');
  };


  const partes = [];

  if (titulo) partes.push(`${titulo} \n`);
  if (huesped) partes.push(`👤 Huésped: ${huesped}`);
  if (anfitrion) partes.push(`👤 Anfitrión: ${anfitrion}`);
  if (alojamiento) partes.push(`🏠 Alojamiento: ${typeof alojamiento === 'object' ? alojamiento.nombre : alojamiento}`);
  if (inicioReserva && finReserva) partes.push(`📅 Fechas: Del ${formatoFecha(inicioReserva)} al ${formatoFecha(finReserva)}`);
  if (duracion) partes.push(`⏳ Duración: ${duracion} días`);
  if (horarioCheckIn) partes.push(`🕓 Check-In: ${horarioCheckIn}`);
  if (horarioCheckOut) partes.push(`⏰ Check-Out: ${horarioCheckOut}`);
  if (motivo) partes.push(`📝 Motivo: ${motivo}`);
  partes.push(`\n`)
  if (adicional) partes.push(`${adicional}`);

  return partes.join('\n');
};
