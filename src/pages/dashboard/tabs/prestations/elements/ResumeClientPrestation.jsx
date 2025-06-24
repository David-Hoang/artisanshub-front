import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileLines, faEuroSign, faCalendar } from '@fortawesome/free-solid-svg-icons'

import { dateFull } from "../../../../../utils/Helpers.jsx";

function ResumeClientPrestation({detailsPrestation}) {

    return ( 
        <div className="resume-client-prestation">
            <div className="wrapper">
                <div className="icon">
                    <FontAwesomeIcon icon={faFileLines} />
                </div>
                <h3>Aperçu du projet</h3>
            </div>

            <div className="description-client-prestation">
                <p>Description</p>
                {detailsPrestation.description && 
                    <p>{detailsPrestation.description}</p>
                }
            </div>

            <div className="craftsman-suggestion-prestation">

                <div className="price-card">
                    <div className="icon">
                        <FontAwesomeIcon icon={faEuroSign} />
                    </div>
                    <div className="suggestion-content">
                        <p className="suggestion-title">Prix proposé par l'artisan</p>
                        <p className={`suggestion ${detailsPrestation.price ? 'price': ''}`}>
                            {detailsPrestation.price ?
                                detailsPrestation.price + ' €'
                            : "Tarif non défini"}
                        </p>
                    </div>
                </div>

                <div className="date-card">
                    <div className="icon">
                        <FontAwesomeIcon icon={faCalendar} />
                    </div>
                    <div className="suggestion-content">
                        <p className="suggestion-title">Date proposée par l'artisan</p>
                        <p className="suggestion-date">
                            {detailsPrestation.date ?
                                dateFull(detailsPrestation.date)
                            : "Date non définie"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResumeClientPrestation;