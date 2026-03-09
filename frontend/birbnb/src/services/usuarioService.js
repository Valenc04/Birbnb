import axios from 'axios';
import urlBackend from './urlBackend';

const BACKEND_URL = urlBackend()

export const loginUsuario = async (email, password) => {
    const url = `${BACKEND_URL}/usuario/login`

    try {
        const response = await axios.post(url, {
            email,
            password
        });

        return response.data;
    } catch (err) {
        if (err.response) {
            console.error("Error completo:", err);
            const errorMessage = err.response.data?.message || "Credenciales incorrectas";
            throw new Error(errorMessage);
        } else {
            throw new Error("Error de conexión al servidor")
        }
    }
}

export const registrarUsuario = async (email, password, nombre) => {
    const url = `${BACKEND_URL}/usuario/signup`

    try {
        const response = await axios.post(url, {
            nombre,
            email,
            password
        });

        return response.data;
    } catch (error) {
        if (error.response) {
            console.error("Error completo:", error);
            throw error.response.data
        } else {
            throw new Error("Error de conexión al servidor")
        }
    }
}

export const convertirseEnAnfitrion = async (email) => {
    const url = `${BACKEND_URL}/usuario/anfitrion`

    try {
        const response = await axios.put(url, {
            email
        })

        return response.data
    } catch (error) {
        if (error.response) {
            console.error("Error completo:", error);
            throw error.response.data
        } else {
            throw new Error("Error de conexion al servidor")
        }
    }
}

export const convertirseEnHuesped = async (email) => {
    const url = `${BACKEND_URL}/usuario/huesped`

    try {
        const response = await axios.put(url, {
            email
        })

        return response.data
    } catch (error) {
        if (error.response) {
            console.error("Error completo:", error);
            throw error.response.data
        } else {
            throw new Error("Error de conexion al servidor")
        }
    }
}