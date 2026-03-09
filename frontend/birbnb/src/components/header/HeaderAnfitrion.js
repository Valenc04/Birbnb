import './Header.css'
import  {AnfitrionMenu} from './AnfitrionMenu'
import { Link } from 'react-router-dom'
import logo from "../../assets/logo-Photoroom.jpg"
import SerHuespedButton from './SerHuespedButton';


export const Header = () => (
    <header className="nav-container">
        <nav>
            <Link to="/app/anfitrion" className='header_logo'>
                <img
                    className="logo"
                    src={logo}
                    alt="Logo de Birbnb"
                />

                <span className="logo-text">Birbnb</span>
            </Link>
            <div className="nav-usuario">
                <SerHuespedButton/>
                <AnfitrionMenu/>
            </div>
        </nav>
    </header>
)