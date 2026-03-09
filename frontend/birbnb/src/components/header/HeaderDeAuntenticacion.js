import './Header.css'
import { Link } from 'react-router-dom'
import logo from "../../assets/logo-Photoroom.jpg"
export const Header = () => (
    <header className="nav-container">
        <nav>
            <Link to="/app" className ='header_logo'>
                <img
                    className="logo"
                    src={logo}
                    alt="Logo de Birbnb"
                />
                <span className="logo-text">Birbnb</span>
            </Link>
        </nav>
    </header>
)