import './NavMenu.scss';
import { Link, useLocation } from "react-router-dom";

function NavMenu({closeMobileMenu}) {
    let location = useLocation()

    return ( 
        <>
            <li className={location.pathname === '/' ? "active-menu" : ""}>
                <Link to="/" onClick={closeMobileMenu}>
                    Accueil
                </Link>
            </li>
            <li className={location.pathname === '/trouver-artisan' ? "active-menu" : ""}>
                <Link to="/trouver-artisan" onClick={closeMobileMenu}>
                    Trouver mon artisan
                </Link>
            </li>
            <li className={location.pathname === '/contactez-nous' ? "active-menu" : ""}>
                <Link to="/contactez-nous" onClick={closeMobileMenu}>
                    Contact
                </Link>
            </li>
        </>
    );
}

export default NavMenu;