import './Header.scss';
import mainLogo from '../../assets/img/logo/logo-50x50.webp';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGripLines, faXmark } from '@fortawesome/free-solid-svg-icons';

import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";

import Button from '../ui/Button.jsx';
import NavMenu from './NavMenu.jsx';

function Header() {

    const {isLogged, handleLogout, hasCompletedProfile} = useContext(AuthContext);
    const [toggleMobileMenu, setToggleMobileMenu] = useState(false);
    
    const openMobileMenu = () => setToggleMobileMenu(true);
    const closeMobileMenu = () => setToggleMobileMenu(false);
    
    return (
        <header>
            <nav id="main-menu">
                <div className="desktop-list">
                    <Link to="/" className="desktop-logo-menu">
                        <img src={mainLogo} alt="Main logo" className="desktop-main-logo" width="38" height="45" />
                        <p>
                            rtisansHub
                        </p>
                    </Link>

                    <ul className="desktop-menu-nav">
                        <NavMenu closeMobileMenu={closeMobileMenu}/>
                    </ul>
                </div>

                <div className="desktop-auth-btn">
                    { isLogged ? (
                        <>
                            <Link to="/dashboard" className="a-btn-secondary" onClick={closeMobileMenu}>
                                Dashboard
                                {!hasCompletedProfile && <span className="red-notification-circle"></span> }
                            </Link>
                            <Button className="btn-primary" onClick={handleLogout}>Déconnexion</Button>
                        </>
                    )
                    : ( 
                        <>
                            <Link to="/connexion" className="a-btn-secondary">Se connecter</Link>
                            <Link to="/inscription" className="a-btn-primary">S'inscrire</Link>
                        </>
                    )}
                </div>

                <Button className="toggle-menu"
                        onClick={openMobileMenu}
                        aria-expanded={toggleMobileMenu}
                        aria-controls="mobile-menu"
                        aria-label="Ouvrir le menu principal"
                    >
                    <FontAwesomeIcon icon={faGripLines} />
                </Button>
            </nav>
            { toggleMobileMenu &&
                <div id="mobile-menu"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Menu principal"
                    onClick={closeMobileMenu}
                    >
                    <div className="mobile-list" onClick={e => e.stopPropagation()}>
                        <Button className="close-mobile-menu" onClick={closeMobileMenu}>
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
                                    <Link to="/dashboard" className="a-btn-secondary" onClick={closeMobileMenu}>
                                        Dashboard
                                        {!hasCompletedProfile && <span className="red-notification-circle"></span> }
                                    </Link>
                                    <Button className="btn-primary" onClick={handleLogout}>Déconnexion</Button>
                                </>
                            ) : ( 
                                <>
                                    <Link to="/connexion" className="a-btn-secondary" onClick={closeMobileMenu}>Se connecter</Link>
                                    <Link to="/inscription" className="a-btn-primary" onClick={closeMobileMenu}>S'inscrire</Link>
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