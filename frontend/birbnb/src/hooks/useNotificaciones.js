import { useEffect, useState, useCallback} from "react";
import axios from 'axios';
import urlBackend from '../services/urlBackend';

const BACKEND_URL = urlBackend();


const useNotificaciones = (userId, tipoInicial = 'todas') => {
    const [notificaciones, setNotificaciones] = useState([]);
    const [tipo, setTipo] = useState(tipoInicial);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const limit = 5; 


    const fetchNotificaciones = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const query = {
                page: page,
                limit: limit
            }

            const url =
               tipo === 'todas'
                  ? `${BACKEND_URL}/notificaciones/${userId}`
                  : `${BACKEND_URL}/notificaciones/${userId}/${tipo}`
            
            const respuesta = await axios.get(url, {
                params: query
            })
            console.log("📦 Respuesta del backend:", respuesta.data);
            setNotificaciones(respuesta.data.data)
            setTotalPages(respuesta.data.total_pages || 0)
        } catch (err) {
            console.error(err)
            setError('Error al obtener las notificaciones')
        } finally {
            setLoading(false)
        }
    }, [userId, tipo, page])

    const marcarComoLeida = async (notiId) => {
        const url = `${BACKEND_URL}/notificaciones/${notiId}/${userId}/leer`
        try {
            await axios.patch(url);

            await fetchNotificaciones();
        } catch (err) {
            console.error('No se pudo marcar como leida:', err);
        }
    }

    useEffect(() => {
        if (userId) {
            fetchNotificaciones();
        }
    }, [userId, tipo, fetchNotificaciones, page]);

    return {
        notificaciones,
        tipo,
        setTipo,
        loading,
        error,
        marcarComoLeida,
        totalPages,
        page,
        setPage
    }
}

export default useNotificaciones;