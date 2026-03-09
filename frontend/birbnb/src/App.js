import './App.css';
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import { HomePage } from './features/home/HomePage';
import { HomePageAnfitrion} from './features/home/HomePageAnfitrion'
import Layout from './features/layout/Layout';
import LayoutAnfitrion from './features/layout/LayoutAnfitrion';
import NotificacionsPage from './features/notifications/NotificationsPage';
import HistorialReservasPage from './features/historialReservas/HistorialReservasPage';
import AlojamientoPage from './features/alojamientos/AlojamientosPage';
import PerfilUsuarioPage from './features/perfilUsuario/PerfilUsuarioPage';
import AlojamientoResult from './features/alojamientosResult/AlojamientoResult';
import SignUpPage from './features/signUp/SignUpPage';
import LoginPage from './features/login/LoginPage';
import { UsuarioProvider } from './components/Context/usuarioContext';
import HistorialReservasRecibidas from './features/historialReservasRecibidas/HistorialReservasRecibidas';


function App() {
  return (
     <UsuarioProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/app" replace />} />
        {/*Por ahora al iniciar el sv nos dirije al home de siempre*/}
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/signup" element={<SignUpPage/>} />

        {/* Rutas protegidas o internas con layour comun */}
        <Route path="/app" element={<Layout />}>
          {/* Marco a Home como la primer pagina tras el login */}
          <Route index element={<HomePage />} />
          <Route path="notificaciones" element={<NotificacionsPage />}></Route>
          {''}
          <Route path="reserva-historial" element={<HistorialReservasPage />}></Route>
          <Route path="perfil" element={<PerfilUsuarioPage />}></Route>
          <Route path="alojamiento/:id" element={<AlojamientoPage />} />
          <Route path="alojamientosResults" element={<AlojamientoResult />} />
        </Route>

        <Route path="/app/anfitrion" element={<LayoutAnfitrion/>}>
          <Route index element={<HomePageAnfitrion/>} />
          <Route path="notificaciones" element={<NotificacionsPage/>}/>
          {''}
          <Route path="reserva-recibidas-historial" element={<HistorialReservasRecibidas/>}/>
          <Route path="perfil" element={<PerfilUsuarioPage/>} />
          <Route path="alojamiento/:id" element={<AlojamientoPage />} />
          <Route path="alojamientosResults" element={<AlojamientoResult />} />
        </Route>

        <Route path="*" element={<Navigate to="/app" replace />} />
      </Routes>
    </BrowserRouter>
    </UsuarioProvider>
  );
}

export default App;
