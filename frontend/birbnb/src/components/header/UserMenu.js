import { Link, useNavigate } from 'react-router-dom';
import { useState , useEffect , useRef } from 'react';
import { useAuth } from '../Context/usuarioContext';
import SerAnfitrionButton from './SerAnfitrionButton';

export const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const ocultar = isOpen ? '' : 'hidden';
   const referenciaAlMenu = useRef(null);
      
   const {logout , usuario} = useAuth();
   const navigate = useNavigate();

  const handleLogout =  () => {
    logout();
    navigate("/app");
}
    useEffect(() => {
    const handleClickOutside = (event) => {
      if (referenciaAlMenu.current && !referenciaAlMenu.current.contains(event.target)) { //event.target elemento donde el usuario hace click
                                                                                           //referenciaAlMenu.current.contains(event.target) devuelve true si el clic ocurrió dentro del menú.
        setIsOpen(false); 
      }
    };
     document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside); 
    };
   
  }, []);

  return (
    <div className="user-menu" ref={referenciaAlMenu}>
      {usuario ? (
        <>
          <SerAnfitrionButton/>
          <button id="toggle-menu">
          <span className="user-icon" onClick={() => setIsOpen(!isOpen)}>
            {usuario.nombre.charAt(0).toUpperCase()}
          </span>
          </button>
          <div id="dropdown" className={`dropdown ${ocultar}`}>
            <ul>
              <li>
                <Link to="/app/notificaciones">Notificaciones</Link>
              </li>
              <li>
                <Link to="/app/reserva-historial">Mis reservas</Link>
              </li>
              <li>
                <Link to="/app/perfil">Perfil</Link>
              </li>
              <li>
                <hr />
                <button onClick={handleLogout}>Cerrar sesión</button>
              </li>
            </ul>
          </div>
        </>
      ) : (
        <div className="visualizer-buttons">
          <button className="anfitrion-button" onClick={() => navigate("/signup")}>
            <strong>Registrarse</strong>
          </button>
          <button className="anfitrion-button" onClick={() => navigate("/login")}>
            <strong>Iniciar sesión</strong>
          </button>
        </div>
      )}
    </div>
  );
};
