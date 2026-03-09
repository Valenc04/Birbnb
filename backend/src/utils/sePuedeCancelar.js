export function sePuedeCancelar(reserva) {
    const fechaActual = new Date();
    const fechaInicio = new Date(reserva.rangoFechas.fechaInicio);

    return fechaActual < fechaInicio;
}