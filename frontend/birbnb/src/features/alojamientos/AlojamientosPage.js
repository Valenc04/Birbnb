import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { getAlojamientoById } from '../../services/alojamientoService'; // Ajusta la ruta según tu proyecto
import './AlojamientoPage.css';
import AlojamientoGaleria from "../../components/alojamiento/AlojamientoGaleria";
import AlojamientoInfo from "../../components/alojamiento/AlojamientoInfo";
import ReservarSection from "../../components/alojamiento/ReservarSection";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const AlojamientoPage = () => {
  
    const { id } = useParams();
    const [alojamiento, setAlojamiento] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAlojamiento = async () => {
            try {
                const data = await getAlojamientoById(id);
                setAlojamiento(data);
            } catch (error) {
                console.error(error);
                setError('No se pudo cargar el alojamiento');
            } finally {
                setLoading(false);
            }
        };

        fetchAlojamiento();
    }, [id]);

    return (
      <main>
        {loading ? (
          <>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '50vh',
              }}
            >
              <CircularProgress size={70} />
            </Box>
          </>
        ) : error ? (
          <p>{error}</p>
        ) : !alojamiento ? (
          <div>
            {' '}
            className="no-results"
            <span role="img" aria-label="error">
              ❌
            </span>
            <h3>{error}</h3>
          </div>
        ) : (
          <>
            <AlojamientoGaleria fotos={alojamiento.fotos} />
            <div className="container">
              <AlojamientoInfo alojamiento={alojamiento} />
              <ReservarSection alojamiento={alojamiento} />
            </div>
          </>
        )}
      </main>
    );
}

export default AlojamientoPage;