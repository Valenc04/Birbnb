import "../historialReservas/HistorialReservasPage.css";
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../components/Context/usuarioContext';
import Pagination from '@mui/material/Pagination';
import { findAllByAnfitrionId } from '../../services/reservaServicie';
import ReservaCard from '../../components/historialReservas/ReservaCard';
import { Skeleton, Alert, AlertTitle } from "@mui/material";

const HistorialReservasRecibidas = () => {
  const [reservas, setReservas] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const limit = 5;
  const { usuario } = useAuth();

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const fetchHistorialReservas = async () => {
    setLoading(true);
    try {
      const query = { page, limit };
      const response = await findAllByAnfitrionId(usuario.id, query);
      setReservas(response.data || []);
      setTotalPages(response.total_pages || 0);
    } catch (error) {
      console.error("Error al obtener historial de reservas:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
   if (!usuario?.id) return;
    fetchHistorialReservas();
  }, [page, usuario]);

  return (
    <div className="conteiner">
      <div className="contenedor-historial-reserva">
        <div className="titulo-reserva">
          <span>Reservas recibidas</span>
        </div>

        {loading ? (
          Array.from(new Array(limit)).map((_, index) => (
            <div key={index} className="reserva-card">
              <Skeleton variant="text" width={250} height={30} />
              <Skeleton variant="rectangular" height={120} />
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" />
            </div>
          ))
        ) : reservas.length > 0 ? (
          reservas.map((reserva) => (
            <ReservaCard key={reserva.reservaId} reserva={reserva} />
          ))
        ) : error ? (
          <Alert severity="error" sx={{ mt: 2 }}>
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        ) : (
          <div className="no-results">
            <span role="img" aria-label="error">❌</span>
            <p>No hay reservas registradas</p>
          </div>
        )}
      </div>

      <Pagination
        className="pagination"
        count={totalPages}
        page={page}
        onChange={handlePageChange}
        size="large"
        color="primary"
      />
    </div>
  );
};

export default HistorialReservasRecibidas;
