import './Header.scss';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGripLines } from '@fortawesome/free-solid-svg-icons';

import Button from './Button.jsx';

function Header() {
    return (
        <header>
            <nav className="main-menu">
                <div className="logo-menu">
                    <Link to="/" className="logo-name">ArtisansHub</Link>

                    <ul className="menu">
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
                </div>

                <ul className="auth-btn">
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
                </ul>

                <Button className="toggle-menu">
                    <FontAwesomeIcon icon={faGripLines} />
                </Button>
            </nav>
        </header>
    );
}

export default Header;
