import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Button,
} from '@mui/material';

const ReservaFeedback = ({ loading, mensaje, onClose, autoClose = true }) => {
  useEffect(() => {
    if (!loading && autoClose) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [loading, autoClose, onClose]);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: '100vw',
        bgcolor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1300,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {loading ? (
        <CircularProgress size={80} color="success" />
      ) : (
        <Paper
          elevation={6}
          sx={{
            p: 4,
            textAlign: 'center',
            maxWidth: 400,
            minWidth: 300,
            borderRadius: 3,
          }}
        >
          <Typography variant="h5" color="success.main" gutterBottom>
            {mensaje.titulo}
          </Typography>

          {mensaje.detalles?.map((linea, index) => (
            <Typography key={index} variant="body1" sx={{ mb: 1 }}>
              {linea}
            </Typography>
          ))}

          <Typography variant="body2" sx={{ mt: 2 }}>
            Gracias por usar nuestra plataforma.
          </Typography>

          <Button variant="contained" color="success" onClick={onClose}>
            Cerrar
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default ReservaFeedback;
