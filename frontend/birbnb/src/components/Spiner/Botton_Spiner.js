import * as React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { green } from '@mui/material/colors';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function CircularIntegration() {
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [mensaje, setMensaje] = React.useState("");
  const timer = React.useRef(undefined);

  const buttonSx = {
    ...(success && {
      bgcolor: green[500],
      '&:hover': {
        bgcolor: green[700],
      },
    }),
  };

  React.useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  const handleButtonClick = () => {
    if (!loading) {
      setSuccess(false);
      setMensaje(""); // Limpiamos mensaje anterior
      setLoading(true);
      timer.current = setTimeout(() => {
        setSuccess(true);
        setLoading(false);
        setMensaje("Gracias por reservar ✅");
      }, 2000);
    }
  };

  return (
    <Box sx={{ m: 1, position: 'relative', textAlign: 'center' }}>
      <Button
        variant="contained"
        sx={buttonSx}
        disabled={loading}
        onClick={handleButtonClick}
      >
        RESERVAR
      </Button>
      {loading && (
        <CircularProgress
          size={24}
          sx={{
            color: green[500],
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: '-12px',
            marginLeft: '-12px',
          }}
        />
      )}
      {success && (
        <Typography variant="body1" sx={{ mt: 2, color: green[700] }}>
          {mensaje}
        </Typography>
      )}
    </Box>
  );
}