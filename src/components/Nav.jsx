import { Link } from 'react-router-dom';
import logo from '../assets/calendar.png';

function Nav(){
    return <nav>
        <img src= {logo}/>
        <h1>Tu Turno</h1>
        <ul>
                <li>Quiénes somos</li>
                <li>Misión</li>
                <li>Visión</li>
                <li>Equipo</li>
                <li>Contacto</li>
                <Link to="/login" className="botonLogin">Iniciar sesión</Link>
        </ul>
    </nav>
}

export default Nav;