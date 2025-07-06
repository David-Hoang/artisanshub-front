import "./PageNotFound.scss";
import { Link } from "react-router-dom";
import NotFoundImg from "../../assets/img/404-not-found.svg";

function PageNotFound() {

    return ( 
        <main id="main-not-found">
            <img className="not-found-picture" src={NotFoundImg} alt="SVG illustration pour la page 404" />
            <div className="content">
                <h1>Oops ! La page que vous recherchez n'existe pas sur ArtisansHub.</h1>
                <Link to="/" className="a-btn-primary">Acceuil</Link>
            </div>
        </main>
    );
}

export default PageNotFound;