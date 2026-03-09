import { useNavigate } from 'react-router-dom';
import { convertirseEnHuesped } from "../../services/usuarioService";
import { useState } from 'react';
import { useAuth } from '../Context/usuarioContext';

export const SerHuespedButton = () => {
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(false)
  const navigate = useNavigate();
  const { usuario, login } = useAuth();
  const [mostrarModal, setMostrarModal] = useState(false)

  const abrirModal = () => setMostrarModal(true)
  const cerrarModal = () => setMostrarModal(false)

  const confirmar = async () => {
    try {
      const nuevoUsuario = await convertirseEnHuesped(usuario.email)

      const usuarioActualizado = {
        ...usuario,
        tipo: nuevoUsuario.tipo
      }

      localStorage.setItem('usuario', JSON.stringify(usuarioActualizado))
      login(usuarioActualizado);

      navigate('/app');
    } catch (error) {
      setError("Hubo un error en intentar convertirse en huesped")
    } finally {
      cerrarModal()
    }
  }

  return (
    <>
      <button className="anfitrion-button boton-convertirse" onClick={abrirModal}><strong>Convertite en huesped</strong></button>

      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal">
            <strong><h1>¿Queres convertirte en huesped?</h1></strong>
            <hr></hr>
            <h2>Beneficios</h2>
            <p>•Busca y reserva alojamientos</p>
            <div className="modal-botones">
              <button className="anfitrion-button" onClick={confirmar}>Sí, continuar</button>
              <button className="anfitrion-button" onClick={cerrarModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SerHuespedButton;