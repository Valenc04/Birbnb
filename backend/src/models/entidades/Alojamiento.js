import { between } from '../../utils/between.js';
import { Reserva } from './Reserva.js';
export class Alojamiento {
    disponibilidad = null;
    constructor({ anfitrion, nombre, descripcion, precioPorNoche, moneda, horarioCheckIn, horarioCheckOut, direccion, cantHuespedesMax, caracteristicas, reservas, fotos }) {
        this.anfitrion = anfitrion;
        this.nombre = nombre;
        this.descripcion = descripcion || '';
        this.precioPorNoche = precioPorNoche
        this.moneda = moneda || 'PESO_ARG'; // Valor por defecto
        this.horarioCheckIn = horarioCheckIn;
        this.horarioCheckOut = horarioCheckOut;
        this.direccion = direccion || { ciudad: '', pais: '' };
        this.cantHuespedesMax = cantHuespedesMax || 1; // Valor por defecto
        this.caracteristicas = caracteristicas || [];
           this.reservas = (reservas || []).map(r =>
      r instanceof Reserva
        ? r                    
        : new Reserva(r)        
    );
        this.fotos = fotos || [];   
    }

    // // Métodos para establecer propiedades opcionales
    // setDescripcion(descripcion) {
    //     this.descripcion = descripcion;
    // }

    // setMoneda(moneda) {

    //     if (!MONEDAS.includes(moneda)) {
    //         throw new Error(`Moneda no válida. Las opciones son: ${MONEDAS.join(', ')}`);
    //     }
    //     this.moneda = moneda;
    // }

    // setHorarios(checkIn, checkOut) {
    //     if (!this.validarFormatoHora(checkIn) || !this.validarFormatoHora(checkOut)) {
    //         throw new Error('Formato de hora inválido (HH:MM)');
    //     }
    //     this.horarioCheckIn = checkIn;
    //     this.horarioCheckOut = checkOut;
    // }

    // setDireccion(ciudad, pais, coordenadas = null) {
    //     this.direccion = { ciudad, pais };
    //     if (coordenadas) {
    //         this.direccion.coordenadas = coordenadas;
    //     }
    // }

    // setCapacidad(cantHuespedesMax) {
    //     if (cantHuespedesMax < 1) {
    //         throw new Error('Debe permitir al menos 1 huésped');
    //     }
    //     this.cantHuespedesMax = cantHuespedesMax;
    // }

    // // Métodos de negocio
    // agregarCaracteristica(caracteristica) {
    //     if (!this.caracteristicas) {
    //         this.caracteristicas = [];
    //     }
    //     if (!CARACTERISTICAS_VALIDAS.includes(caracteristica)) {
    //         throw new Error(`Característica no válida. Opciones: ${CARACTERISTICAS_VALIDAS.join(', ')}`);
    //     }
    //     this.caracteristicas.push(caracteristica);
    // }

    // agregarFoto(url, descripcion = '') {
    //     if (!this.fotos) {
    //         this.fotos = [];
    //     }
    //     this.fotos.push({ url, descripcion });
    // }

    // agregarReserva(reserva) {
    //     if (!this.reservas) {
    //         this.reservas = [];
    //     }
    //     this.reservas.push(reserva);
    // }

    // Métodos de consulta
    estasDisponibleEn(rangoDeFechas) {
        if (!this.reservas) return true;
        return this.reservas.every(reserva => !reserva.ocupaElRango(rangoDeFechas));
    }

    tuPrecioEstaDentroDe(valorMinimo, valorMaximo) {
        return between(this.precioPorNoche, valorMinimo, valorMaximo);
    }

    tenesCaracteristica(caracteristica) {
        if (!this.caracteristicas) return false;
        return this.caracteristicas.includes(caracteristica);
    }

    puedenAlojarse(cantHuespedes) {
        return this.cantHuespedesMax >= cantHuespedes;
    }

    agregarReserva(reserva) {
        this.reservas.push(reserva);
    }
}