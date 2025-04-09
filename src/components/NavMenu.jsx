import './NavMenu.scss';
import { Link } from "react-router-dom";

function NavMenu() {
    return ( 
        <>
            <li>
                <Link to="/">Accueil</Link>
            </li>
            <li>
                <Link to="/">Trouver mon artisan</Link>
            </li>
            <li>
                <Link to="/">Contact</Link>
            </li>
        </>
    );
}

export default NavMenu;