import './Header.css'
import { UserMenu } from './UserMenu';
import { Link } from 'react-router-dom';

import logo from "../../assets/logo-Photoroom.jpg"
export const Header = () => {

  return (
    <>
      <header className="nav-container">
        <nav>
          <Link to="/app" className='header_logo'>
            <img
              className="logo"
              src={logo}
              alt="Logo de Birbnb"
            />
            <span className="logo-text">Birbnb</span>
          </Link>
          <div className="nav-usuario">
            <UserMenu></UserMenu>
          </div>
        </nav>
      </header>
    </>
  );
}