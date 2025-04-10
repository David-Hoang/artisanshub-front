import './NavMenu.scss';
import { Link } from "react-router-dom";

function NavMenu(closeMobileMenu) {
    return ( 
        <>
            <li>
                <Link to="/" onClick={closeMobileMenu}>Accueil</Link>
            </li>
            <li>
                <Link to="/" onClick={closeMobileMenu}>Trouver mon artisan</Link>
            </li>
            <li>
                <Link to="/" onClick={closeMobileMenu}>Contact</Link>
            </li>
        </>
    );
}

export default NavMenu;