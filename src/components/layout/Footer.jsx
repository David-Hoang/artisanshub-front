import './Footer.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faLinkedinIn, faYoutube } from '@fortawesome/free-brands-svg-icons';

import { thisYear } from "../../utils/Helpers";

function Footer() {
    return ( 
        <footer>
            <div id="footer-wrapper">

                <div className="footer-main-section">
                    <div className="footer-about-us">
                        <h3>Qui somme nous ?</h3>
                        <p>
                            Derrière ArtisansHub, il y a une équipe engagée qui veut remettre l’humain au cœur des projets.
                            Nous avons conçu cet espace pour connecter des particuliers à des artisans de qualité, dans un esprit de confiance et de proximité.
                            ArtisansHub, c’est bien plus qu’un simple annuaire : c’est un lieu d’échange, de valorisation du savoir-faire, et de soutien à ceux qui font vivre nos métiers manuels.
                            Ensemble, nous créons une nouvelle façon de collaborer, plus simple, plus humaine, plus locale.
                        </p>
                    </div>
                    <div className="footer-list">
                        <div className="footer-categories">
                            <h4>Catégories</h4>
                            <ul>
                                <li>
                                    <a href="#">Plombier</a>
                                </li>
                                <li>
                                    <a href="#">Électricien</a>
                                </li>
                                <li>
                                    <a href="#">Jardinier</a>
                                </li>
                                <li>
                                    <a href="#">Menusier</a>
                                </li>
                            </ul>
                        </div>
                        <div className="footer-legals">
                            <h4>Informations légales</h4>
                            <ul>
                                <li><a href="#">Mentions légales</a></li>
                                <li><a href="#">Politique de confidentialité</a></li>
                                <li><a href="#">Conditions d’utilisation</a></li>
                                <li><a href="#">Contact</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="footer-social">
                    <ul>
                        <li>
                            <a href="#" aria-label="Facebook">
                                <FontAwesomeIcon icon={faFacebookF} />
                            </a>
                        </li>
                        <li>
                            <a href="#" aria-label="Instagram">
                            <FontAwesomeIcon icon={faInstagram} />
                            </a>
                        </li>
                        <li>
                            <a href="#" aria-label="LinkedIn">
                            <FontAwesomeIcon icon={faLinkedinIn} />
                            </a>
                        </li>
                        <li>
                            <a href="#" aria-label="Youtube">
                            <FontAwesomeIcon icon={faYoutube} />
                            </a>
                        </li>
                    </ul>
                </div>

                <div className="footer-signature">
                    <p>© {thisYear()} ArtisansHub. Tous droits réservés.</p>
                    <p>Fait avec amour et passion ❤️</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;