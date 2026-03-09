export class RangoFechas {
    constructor(fechaInicio, fechaFin) {
        this.fechaInicio = fechaInicio
        this.fechaFin = fechaFin

        if (fechaInicio > fechaFin) throw new Error("La fecha de inicio debe ser anterior a la fecha de fin.")
    }

    
    seSolapaCon(otroRango) {
        return (
            this.fechaInicio <= otroRango.fechaFin &&
            this.fechaFin >= otroRango.fechaInicio
        )
    }
}