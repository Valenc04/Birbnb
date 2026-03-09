import './navAnfitrion.css';

export const NavAnfitrion = ({ nombre }) => {
  return (
    <nav className="nav-anfitrion">
      <h1 className="titulo-bienvenida">
        👋 Bienvenido, {nombre}. Tu panel de anfitrión está listo.
      </h1>
    </nav>
  );
};