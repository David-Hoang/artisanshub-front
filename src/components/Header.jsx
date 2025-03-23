import './header.scss';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGripLines } from '@fortawesome/free-solid-svg-icons';

import Button from './Button.jsx';

function Header() {
    return (
        <nav className="main-menu">
            <ul className="menu">
                <li>
                    <Link to="/">ArtisansHub</Link>
                </li>
                <li>
                    <Link to="/">Accueil</Link>
                </li>
                <li>
                    <Link to="/">Trouver mon artisan</Link>
                </li>
                <li>
                    <Link to="/">Contact</Link>
                </li>
            </ul>
            <ul className="">
                <li>
                    <Button link="/connexion" className="btn-secondary">
                        Se connecter
                    </Button>
                </li>
                <li>
                    <Button link="/inscription" className="btn-primary">
                        Créer un compte
                    </Button>
                </li>
                <li>
                    <FontAwesomeIcon icon={faGripLines} />
                </li>
            </ul>
        </nav>
    );
}

export default Header;
