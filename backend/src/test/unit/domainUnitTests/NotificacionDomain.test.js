// Notificacion.test.js
import {Notificacion} from '../../../models/entidades/Notificacion.js'
import {describe, test, expect} from '@jest/globals'


describe('Testeo de la capa de DOMINIO - Notificacion', () => {
    test('deberia crear una instancia de Notificacion correctamente', () => {
        const mensaje = 'Test message'
        const usuario = {nombre: "UsuarioPrueba", email: "usuarioPrueba@gmail.com", tipo: 'HUESPED'}
        const notificacion = new Notificacion(mensaje, usuario)

        expect(notificacion.mensaje).toBe(mensaje)
        expect(notificacion.usuario).toBe(usuario)
        expect(notificacion.fechaAlta).toBeInstanceOf(Date)
        expect(notificacion.leida).toBe(false)
        expect(notificacion.fechaLeida).toBeNull()
    })

    test('deberia marcar la notificacion como leida y settear fechaLeida', () => {
        const mensaje = 'Test message'
        const usuario = {nombre: "UsuarioPrueba", email: "usuarioPrueba@gmail.com", tipo: 'HUESPED'}
        const notificacion = new Notificacion(mensaje, usuario)

        notificacion.marcarComoLeida()

        expect(notificacion.leida).toBe(true)
        expect(notificacion.fechaLeida).toBeInstanceOf(Date)
    })

    test('deberia tirar un error al querer leer una notificacion que ya fue marcada como leida previamente', () => {
        const mensaje = 'Test message'
        const usuario = {nombre: "UsuarioPrueba", email: "usuarioPrueba@gmail.com", tipo: 'HUESPED'}
        const notificacion = new Notificacion(mensaje, usuario)
        notificacion.id = 5

        notificacion.marcarComoLeida()

        expect(() => notificacion.marcarComoLeida()).toThrow(`La Notificacion con ID 5 ya fue marcada como leida`)
    })
})