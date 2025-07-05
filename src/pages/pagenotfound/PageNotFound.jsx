import "./PageNotFound.scss";
import { useNavigate } from "react-router-dom";
import NotFound from "../../assets/img/404-not-found.svg";
import Button from "../../components/ui/Button";

function PageNotFound() {

    const navigate = useNavigate()

    return ( 
        <main id="main-not-found" 
            style={{backgroundImage : `url(${NotFound})`}}
            >
            
            <div className="content">
                <h1>Oops ! La page que vous recherchez n'existe pas sur ArtisansHub.</h1>
                <Button className="btn-primary" onClick={() => navigate("/")}>Accueil</Button>
            </div>
        </main>
    );
}

export default PageNotFound;