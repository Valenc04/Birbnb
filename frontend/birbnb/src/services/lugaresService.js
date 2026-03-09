import axios from 'axios';
import urlBackend from './urlBackend';

const BACKEND_URL = urlBackend()

export const getLugares = async ({ q = '', autocomplete = false, limit = 10 }) => {
  const url = `${BACKEND_URL}/lugares?q=${encodeURIComponent(q)}&autocomplete=${autocomplete}&limit=${limit}`;
  try {
    const response = await axios.get(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener los lugares');
  }
};
