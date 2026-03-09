import './SignUpForm.css';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registrarUsuario } from '../../../../services/usuarioService';

const FormularioSignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmbit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim() || !confirmPassword.trim() || !nombre.trim()) {
      setError("Por favor completá todos los campos.");
      return;
    }
    else if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
    }

    try {
      const data = await registrarUsuario(email, password, nombre);
      console.log('Registro exitoso: ', data);

      localStorage.setItem('token', data.token);
      navigate('/app');

    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="signup-container">
      <h2>Crear cuenta</h2>
      <form className="signup-form" onSubmit={handleSubmbit}>
        <input 
          type="text"
          id="nombre-completo"
          name="nombre-completo" 
          placeholder="Nombre completo" 
          required 
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input 
          type="email" 
          id="email"
          name="email"
          placeholder="Correo electrónico" 
          required 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="password" 
          id="password"
          name="password"
          placeholder="**********" 
          required 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          id="confirm-password"
          name="confirm-password"
          placeholder="**********"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {error && <p className="error-msg">{error}</p>}
        <button type="submit">Registrarme</button>
        <p>
          ¿Ya tenés cuenta? <Link to="/login">Iniciar sesión</Link>
        </p>
      </form>
    </section>
  );
};

export default FormularioSignUp;