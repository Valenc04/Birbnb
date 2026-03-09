import "./UsuarioCard.css"


const CardUsuario = ({className="", usuario}) => {

  const foto = "https://www.w3schools.com/howto/img_avatar.png"

  return (
    <div className={`perfil-card ${className}`}>
      {/* TODO: quizas se podria asociar la clase Foto con Usuario*/}
      <img className="perfil-imagen" src={foto} alt="Foto de perfil" />
      <div className="perfil-info">
        <p><strong>Nombre</strong> {usuario?.nombre}</p>
        <p><strong>Email</strong> {usuario?.email}</p>
        <p><strong>Tipo</strong> {usuario?.tipo}</p>
      </div>
    </div>
  );
};

export default CardUsuario;