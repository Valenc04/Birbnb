import { Link, useNavigate } from 'react-router-dom';
import { useState , useEffect , useRef } from 'react';
import { useAuth } from '../Context/usuarioContext';

export const AnfitrionMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const ocultar = isOpen ? '' : 'hidden';
   const referenciaAlMenu = useRef(null);
      
   const {logout , usuario} = useAuth();
   const navigate = useNavigate();

  const handleLogout =  () => {
    logout();
    navigate("/login");
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
      <button id="toggle-menu">
        <span className="user-icon" onClick={() => setIsOpen(!isOpen)}>
          {usuario?.nombre.charAt(0).toUpperCase()}
        </span>
      </button>
      <div id="dropdown" className={`dropdown ${ocultar}`}>
        <ul>
          <li>
            <Link to="/app/anfitrion/notificaciones">Notificaciones</Link>
          </li>
          <li>
            <Link to="/app/anfitrion/reserva-recibidas-historial">Reservas recibidas</Link>
          </li>
          <li>
            <Link to="/app/anfitrion/perfil">Perfil</Link>
          </li>
          <li>
            <hr></hr>
            <button onClick={handleLogout}>Cerrar sesión</button>
          </li>
        </ul>
      </div>
    </div>
  );
};
