import './LoginForm.css';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUsuario } from '../../../services/usuarioService';
import { useAuth } from '../../Context/usuarioContext';

const FormularioLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [tipo, setTipo] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    if (!email.trim() || !password.trim()) {
      setError('Por favor completá todos los campos.');
      return;
    }

    try {
      let data

      try {
        data = await loginUsuario(email, password);
        console.log('Login exitoso: ', data);
      } catch (err) {
        setError(err.message);
        console.log('Login Fallido: ', data);
        return;
      }

      const usuario = {
        nombre: data.nombre,
        email: data.email,
        tipo: data.tipo,
        id: data.id,
      };

      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(usuario));
      login(usuario);

      if (data.tipo === 'ANFITRION') {
        navigate('/app/anfitrion');
      } else {
        navigate('/app');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="login-container">
      <h2>Iniciar sesión</h2>
      <form className="login-form">
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Correo electronico"
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
        {error && <p className="error-msg">{error}</p>}
        <button type="button" onClick={() => handleLogin()}>
          Iniciar sesión
        </button>
        <p>
          ¿No tenés cuenta? <Link to="/signup">Registrate</Link>
        </p>
      </form>
    </section>
  );
};

export default FormularioLogin;
