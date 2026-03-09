import React, { useState, useEffect } from 'react';
import { useAuth } from '../../components/Context/usuarioContext';
import { NavAnfitrion } from '../../components/navAnfitrion/navAnfitrion';
import CardUsuario from '../../components/perfilUsuario/UsuarioCard';
import { Skeleton, Card, CardContent} from '@mui/material';
import { BotonHomeAnfitrion } from '../../components/botonesHomeAnfitrion/BotonesHomeAnfitrion';

export const HomePageAnfitrion = () => {
    const { usuario } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (usuario) {
            setLoading(true);
            const timeout = setTimeout(() => setLoading(false), 1500);
            return () => clearTimeout(timeout);
        }
    }, [usuario]);

    return (
        <main>
            {usuario && <NavAnfitrion nombre={usuario.nombre} />}
            <BotonHomeAnfitrion/>
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
        </main>
    );
};
