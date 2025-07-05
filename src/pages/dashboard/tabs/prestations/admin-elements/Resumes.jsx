import "./Resumes.scss"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileLines, faEuroSign, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { dateFull } from "../../../../../utils/Helpers";

import Badge from "../../../../../components/ui/Badge.jsx";

function ResumeAdminPrestation({selectedPresDetails}) {
    return ( 
        <div className="card-admin-prestation resume-admin-prestation">
            <div className="wrapper">
                <div className="icon">
                    <FontAwesomeIcon icon={faFileLines} />
                </div>
                <h3>Aperçu du projet</h3>
            </div>

            <div className="description-client-prestation">
                <h4>Description</h4>
                <p>{selectedPresDetails.description ?? ""}</p>
            </div>

            <div className="craftsman-suggestion-prestation">
                <div className="price-card">
                    <div className="icon">
                        <FontAwesomeIcon icon={faEuroSign} />
                    </div>
                    <div className="suggestion-content">

                        <p className="suggestion-title">Prix proposé par l'artisan</p>
                        <p className={`suggestion ${selectedPresDetails.price ? 'price': ''}`}>
                            {selectedPresDetails.price ?
                                selectedPresDetails.price + ' €'
                                : "Tarif non défini"}
                        </p>
                    </div>
                </div>

                <div className="date-card">
                    <div className="icon">
                        <FontAwesomeIcon icon={faCalendar} />
                    </div>
                    <div className="suggestion-content">
                
                        <p className="suggestion-title">Date planifiée</p>
                        <p className="suggestion-date">
                            {selectedPresDetails.date 
                                ? dateFull(selectedPresDetails.date)
                                : "Date non définie"
                            }
                        </p>
                    </div>
                </div>
            </div>

            <div className="state-prestation">
                <h4>État de la prestation</h4>
                {selectedPresDetails.state === "await-craftsman" && <Badge color="pending">En attente artisan</Badge> }
                {selectedPresDetails.state === "await-client" && <Badge color="pending">En attente client</Badge> }
                {selectedPresDetails.state === "confirmed" && <Badge color="info">Prestation confirmé</Badge> }
                {selectedPresDetails.state === "completed" && <Badge color="success">Prestation complété</Badge> }
                {selectedPresDetails.state === "refused-by-client" && <Badge color="danger">Refusé par le client</Badge> }
                {selectedPresDetails.state === "refused-by-craftsman" && <Badge color="danger">Refusé par l'artisan</Badge> }
            </div>
        </div>
    );
}

export default ResumeAdminPrestation;