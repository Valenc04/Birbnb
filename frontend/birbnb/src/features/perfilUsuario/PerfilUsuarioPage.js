import React, { useState, useEffect } from 'react';
import { useAuth } from '../../components/Context/usuarioContext';
import "./PerfilUsuarioPage.css"
import CardUsuario from '../../components/perfilUsuario/UsuarioCard';
import { Skeleton, Card, CardContent} from '@mui/material';


const PerfilUsuarioPage = () => {
  const {usuario, error} = useAuth();
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const timeout = setTimeout(() => setLoading(false), 1500)

    return () => clearTimeout(timeout)
  }, [])

  if (error) return <p>{error}</p>

  return (
    <div className="perfil-container">
      <h1 className="perfil-titulo">Mi Perfil</h1>

      {loading ? (
        <Card className="skeleton-card" sx={{ maxWidth: 1024, margin: 'auto', mt: 2 }}>
          <CardContent>
            <Skeleton variant="text" height={40} width={750} />
            <Skeleton variant="text" height={30} width={600} />
            <Skeleton variant="text" height={30} width={600} />
          </CardContent>
        </Card>
      ) : usuario ? (
        <CardUsuario usuario={usuario} />
      ) : (
        <p>No se encontró información del usuario.</p>
      )}
    </div>
  );
};
export default PerfilUsuarioPage;