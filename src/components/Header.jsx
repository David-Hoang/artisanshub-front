import './Header.scss';
import mainLogo from '../assets/img/logo/logo-192x192.png';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGripLines, faXmark } from '@fortawesome/free-solid-svg-icons';

import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

import Button from './Button.jsx';
import NavMenu from './NavMenu.jsx';

function Header() {

    const {isLogged, handleLogout} = useContext(AuthContext);
    const [toggleMobileMenu, setToggleMobileMenu] = useState(false);
    
    return (
        <header>
            <nav className="main-menu">
                <div className="desktop-list">
                    <Link to="/" className="desktop-logo-menu">
                        <img src={mainLogo} alt="Main logo" className="desktop-main-logo" />
                        <p>
                            rtisansHub
                        </p>
                    </Link>

                    <ul className="desktop-menu-nav">
                        <NavMenu />
                    </ul>
                </div>

                <div className="desktop-auth-btn">
                    { isLogged ? (
                        <>
                            <Button link="/connexion" className="btn-secondary">
                                Mon profil
                            </Button>
                            <Button className="btn-primary" onClick={handleLogout}>
                                Déconnexion
                            </Button>
                        </>
                    )
                    : ( 
                        <>
                            <Link to="/connexion" className="a-btn-secondary">Se connecter</Link>
                            <Link to="/inscription" className="a-btn-primary">S'inscrire</Link>
                        </>
                    )}
                </div>

                <Button className="toggle-menu" onClick={e => setToggleMobileMenu(!toggleMobileMenu)}>
                    <FontAwesomeIcon icon={faGripLines} />
                </Button>
            </nav>
            { toggleMobileMenu &&
                <div className="mobile-menu" onClick={e => setToggleMobileMenu(!toggleMobileMenu)}>
                    <div className="mobile-list" onClick={e => e.stopPropagation()}>
                        <Button className="close-mobile-menu" onClick={e => setToggleMobileMenu(!toggleMobileMenu)}>
                            <FontAwesomeIcon icon={faXmark} />
                        </Button>
                        
                        <div className="mobile-logo-wrapper">
                            <Link to="/" className="mobile-logo-menu">
                                <img src={mainLogo} alt="Main logo" className="mobile-main-logo" />
                                <p>
                                    rtisansHub
                                </p>
                            </Link>
                        </div>

                        <ul className="mobile-menu-nav">
                            <NavMenu />
                        </ul>
                        <div className="mobile-auth-btn">
                            { isLogged ? (
                                <>
                                    <Button link="/connexion" className="btn-secondary">
                                        Mon profil
                                    </Button>
                                    <Button className="btn-primary" onClick={handleLogout}>
                                        Déconnexion
                                    </Button>
                                </>
                            ) : ( 
                                <>
                                    <Link to="/connexion" className="a-btn-secondary">Se connecter</Link>
                                    <Link to="/inscription" className="a-btn-primary">S'inscrire</Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            }
        </header>
    );
}

export default Header;