import { useState } from 'react';
import { Button, TextField } from '@mui/material';
import { useAuth } from '../Context/usuarioContext';

import Alert from '@mui/material/Alert';
const ReservaEstadoAccion = ({
  id,
  estadoDestino,
  onSubmit,
  textoBoton,
  requiereMotivo = false,
  textoSuccess,
  botonClassName,
  estadoActual,
  fechaFin,
}) => {
  const [motivo, setMotivo] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [accionConfirmada, setAccionConfirmada] = useState(false);
  const { usuario } = useAuth();
  const [, setLoading] = useState(false);
  const [mostrarFeedback, setMostrarFeedback] = useState(false);

  const puedeCancelar =
    (estadoActual === 'CONFIRMADA' || estadoActual === 'PENDIENTE') &&
    new Date(fechaFin) > new Date();

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const data = {
        estado: estadoDestino,
        usuario: {
          idusuario: usuario.email,
          tipo: usuario.tipo,
        },
      };
      if (requiereMotivo) {
        data.motivo = motivo;
      }

      await onSubmit(id, data);
      setMensaje(textoSuccess);
      setAccionConfirmada(true);
      setMostrarFeedback(true);
    } catch (error) {
      setMensaje(` ${error.message} ya fue ${estadoDestino} `);
      setMostrarFeedback(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {puedeCancelar && !accionConfirmada ? (
        !mostrarFormulario ? (
          <Button
            className={botonClassName}
            variant="contained"
            onClick={() => setMostrarFormulario(true)}
          >
            {textoBoton}
          </Button>
        ) : (
          <>
            {requiereMotivo && (
              <TextField
                fullWidth
                label="Motivo"
                multiline
                rows={2}
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                sx={{ marginBottom: 2 }}
              />
            )}
            <Button
              className={botonClassName}
              variant="contained"
              onClick={handleSubmit}
            >
              Confirmar
            </Button>
          </>
        )
      ) : null}

      {/* 🟢 ALERTA VISIBLE ABAJO DEL TODO */}
      {mostrarFeedback && (
        <Alert
          severity={accionConfirmada ? 'success' : 'error'}
          sx={{ mt: 2 }}
          onClose={() => setMostrarFeedback(false)} // Opcional: permitir cerrar la alerta
        >
          {mensaje}
        </Alert>
      )}
    </div>
  );
};

export default ReservaEstadoAccion;
