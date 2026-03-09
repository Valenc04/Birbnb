import useNotificaciones from '../../hooks/useNotificaciones';
import NotificationBotonCard from '../../components/notifications/NotificationBotonCard';
import NotificationCard from '../../components/notifications/NotificationCard';
import { useAuth } from '../../components/Context/usuarioContext';
import './NotificationsPage.css';
import Pagination from '@mui/material/Pagination';
import { Skeleton } from '@mui/material';

const NotificationsPage = () => {
  const { usuario } = useAuth();
  const userId = usuario?.id;

  const {
    notificaciones,
    tipo,
    setTipo,
    loading,
    error,
    marcarComoLeida,
    totalPages,
    page,
    setPage
  } = useNotificaciones(userId);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <div className="conteiner">
      <div className="contenedor-historial-reserva">
        <div className="titulo-reserva">
          <span>Mis Notificaciones</span>
          <div className="botones-noti">
            <NotificationBotonCard texto="Leídas" activo={tipo === 'leidas'} onClick={() => setTipo('leidas')} />
            <NotificationBotonCard texto="No leídas" activo={tipo === 'no-leidas'} onClick={() => setTipo('no-leidas')} />
            <NotificationBotonCard texto="Todas" activo={tipo === 'todas'} onClick={() => setTipo('todas')} />
          </div>
        </div>

        {/* Loading Skeletons */}
        {loading &&
          Array.from(new Array(5)).map((_, index) => (
            <div key={index} className="reserva-card">
              <Skeleton variant="text" width="50%" height={30} />
              <Skeleton variant="text" width="80%" height={20} />
              <Skeleton variant="rectangular" height={50} sx={{ mt: 1, borderRadius: 2 }} />
            </div>
          ))
        }

        {/* Error message */}
        {error && <p className="error-message">{error}</p>}

        {/* No results */}
        {!loading && !error && notificaciones.length === 0 && (
          <p className="no-results">No hay notificaciones.</p>
        )}

        {/* Notifications */}
        {!loading && !error && notificaciones.map((n) => (
          <NotificationCard
            key={n.id}
            notificacion={n}
            onMarcarComoLeida={marcarComoLeida}
          />
        ))}

        {/* Pagination */}
        <Pagination
          className="pagination"
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          size="large"
          color="primary"
        />
      </div>
    </div>
  );
};

export default NotificationsPage;