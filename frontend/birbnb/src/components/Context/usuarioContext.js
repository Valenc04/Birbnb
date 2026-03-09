import { createContext, useState, useEffect, useContext } from 'react';

export const UsuarioContext = createContext();

export const UsuarioProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const data = localStorage.getItem('usuario');
      if (data) {
        setUsuario(JSON.parse(data));
      }
    } catch (err) {
      setError("Error al cargar el usuario");
    }
  }, []);

  const login = (usuarioData) => {
    setUsuario(usuarioData);
    localStorage.setItem('usuario', JSON.stringify(usuarioData));
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
  };

  return (
    <UsuarioContext.Provider value={{ usuario, login, logout, error }}>
      {children}
    </UsuarioContext.Provider>
  );
};

export const useAuth = () => useContext(UsuarioContext);
