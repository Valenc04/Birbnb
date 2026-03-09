import './BotonesHomeAnfitrion.css'
import { useNavigate } from 'react-router-dom'
import { Box } from '@mui/material';


export const BotonHomeAnfitrion = () => {
    const navigate = useNavigate();

    return (
        <Box className="botones-anfitrion">
            {/*
            <button className="boton-anfitrion" onClick={() => navigate("/app/anfitrion/mis-alojamientos")}>
                Ver mis alojamientos
            </button>
            */}
            <button className="anfitrion-button boton-anfitrion-principal" onClick={() => navigate("/app/anfitrion/reserva-recibidas-historial")}>
                Ver reservas recibidas
            </button>
        </Box>
    )
}


