import React, { useState } from 'react';
import { useAuth } from '../Context/usuarioContext';
import { Button, Alert } from '@mui/material';

const CambioEstadoAnfitrion = ({ id, onSubmit, estadoActual }) => {
  const { usuario } = useAuth();

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (nuevoEstado) => {
    setLoading(true);
    setMensaje('');
    setError('');

    const data = {
      estado: nuevoEstado,
      usuario: {
        idusuario: usuario.email,
        tipo: usuario.tipo,
      },
    };

    try {
      await onSubmit(id, data);
      setMensaje(`Reserva ${nuevoEstado.toLowerCase()}.`);
    } catch (err) {
      setError('Ocurrió un error al cambiar el estado.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {mensaje && <Alert severity="success" style={{ marginBottom: 10 }}>{mensaje}</Alert>}
      {error && <Alert severity="error" style={{ marginBottom: 10 }}>{error}</Alert>}

      {estadoActual === 'PENDIENTE' && (
        <div style={{ display: 'flex', justifyContent: 'end', gap: 10 }}>
          <Button
            variant="contained"
            onClick={() => handleSubmit('CONFIRMADA')}
            disabled={loading}
          >
            Confirmar
          </Button>
          <Button
            variant="contained"
            onClick={() => handleSubmit('RECHAZADA')}
            disabled={loading}
          >
            Rechazar
          </Button>
        </div>
      )}

      {estadoActual === 'CONFIRMADA' && (
        <div>
          <Button
            variant="contained"
            onClick={() => handleSubmit('RECHAZADA')}
            disabled={loading}
          >
            Rechazar
          </Button>
        </div>
      )}

      {estadoActual === 'RECHAZADA' && (
        <div>

        </div>
      )}
    </div>
  );
};

export default CambioEstadoAnfitrion;