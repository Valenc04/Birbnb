import "./NotificationBotonCard.css"
const NotificationBotonCard = ({texto, onClick, activo}) =>{
    return (
    <button
       className={`boton-noti ${activo ? 'activo' : ''}`}
       onClick={onClick}
    >
        {texto}
    </button>    
    )
}

export default NotificationBotonCard

