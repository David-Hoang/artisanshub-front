import './Header.scss';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGripLines } from '@fortawesome/free-solid-svg-icons';

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

import Button from './Button.jsx';

function Header() {

    const {isLogged, handleLogout} = useContext(AuthContext)
    
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
                    { isLogged ? (
                        <>
                            <li>
                                <Button link="/connexion" className="btn-secondary">
                                    Mon profil
                                </Button>
                            </li>
                            <li>
                                <Button className="btn-primary" onClick={handleLogout}>
                                    Déconnexion
                                </Button>
                            </li>
                        </>
                    )
                    : ( 
                        <>
                            <li>
                                <Link to="/connexion" className="a-btn-secondary">Se connecter</Link>
                            </li>
                            <li>
                                <Link to="/inscription" className="a-btn-primary">S'inscrire</Link>
                            </li>
                        </>
                    )}
                </ul>

                <Button className="toggle-menu">
                    <FontAwesomeIcon icon={faGripLines} />
                </Button>
            </nav>
        </header>
    );
}

export default Header;
