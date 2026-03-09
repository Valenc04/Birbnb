import { Alojamiento } from "../../../models/entidades/Alojamiento.js";
import { describe, expect, test } from "@jest/globals";


describe('Clase Alojamiento - Pruebas Básicas', () => {
    const datosBasicos = {
        anfitrion: "Juan Pérez", 
        nombre: "Cabaña en el bosque",
        descripcion: "Acogedora cabaña con vista al bosque",
        precioPorNoche: 80,
        moneda: "USD",
        horarioCheckIn: "15:00",
        horarioCheckOut: "11:00",
        direccion: { ciudad: "Bariloche", pais: "Argentina" }, 
        cantHuespedesMax: 4,
        caracteristicas: ["wifi", "chimenea"],
        reservas: [], 
        fotos: []
    };

    test('debería crear una instancia de Alojamiento correctamente', () => {
        const alojamiento = new Alojamiento(datosBasicos);

        expect(alojamiento).toBeInstanceOf(Alojamiento);
        expect(alojamiento.nombre).toBe("Cabaña en el bosque");
        expect(alojamiento.precioPorNoche).toBe(80);
    });

    test('debería estar disponible cuando no tiene reservas', () => {
        const alojamiento = new Alojamiento(datosBasicos);
        const rangoFechas = {
            fechaInicio: new Date('2023-11-01'),
            fechaFin: new Date('2023-11-10')
        };

        expect(alojamiento.estasDisponibleEn(rangoFechas)).toBe(true);
    });

    test('debería tener las características correctas', () => {
        const alojamiento = new Alojamiento(datosBasicos);

        expect(alojamiento.tenesCaracteristica("wifi")).toBe(true);
        expect(alojamiento.tenesCaracteristica("chimenea")).toBe(true);
        expect(alojamiento.tenesCaracteristica("piscina")).toBe(false);
    });

    test('debería aceptar huéspedes según capacidad máxima', () => {
        const alojamiento = new Alojamiento(datosBasicos);

        expect(alojamiento.puedenAlojarse(3)).toBe(true); 
        expect(alojamiento.puedenAlojarse(4)).toBe(true); 
        expect(alojamiento.puedenAlojarse(5)).toBe(false); 
    });

    test('debería determinar si el precio está en un rango', () => {
        const alojamiento = new Alojamiento(datosBasicos);

        expect(alojamiento.tuPrecioEstaDentroDe(50, 100)).toBe(true); 
        expect(alojamiento.tuPrecioEstaDentroDe(80, 100)).toBe(true); 
        expect(alojamiento.tuPrecioEstaDentroDe(90, 120)).toBe(false); 
    });
});