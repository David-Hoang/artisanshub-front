import { Link } from "react-router-dom";

function Header() {
    return (
        <nav>
            <ul>
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
            <ul>
                <li>
                    <Link to="/connexion">Connexion</Link>
                </li>
                <li>
                    <Link to="/inscription">Créer un compte</Link>
                </li>
            </ul>
        </nav>
    );
}

export default Header;
