export const diferenciaDias = (fechaInicio, fechaFin) => {
    const MS_POR_DIA = 1000 * 60 * 60 * 24;

    return Math.round((fechaFin - fechaInicio) / MS_POR_DIA);
}