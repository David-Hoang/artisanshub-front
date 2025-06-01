import './DetailsInformationsTab.scss';

import { firstCapitalize, dateMonthYear } from "../../../utils/Helpers";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons'

function DetailsInformationsTab({craftsmanInfos, ...props}) {

    console.log(craftsmanInfos)
    return ( 
        <div className="details-tab-craftsman">
            <div className="description-craftsman">
                <h2>À propos de {firstCapitalize(craftsmanInfos.user.first_name)} {firstCapitalize(craftsmanInfos.user.last_name)}</h2>

                <p>
                    {craftsmanInfos.description 
                        ? craftsmanInfos.description
                        : `${firstCapitalize(craftsmanInfos.user.first_name)} n'a encore pas renseigné sa description.`
                    }
                </p>
            </div>

            <div className="details-craftsman-wrapper">
                <div className="card">
                    <p className="card-title">Tarification</p>
                    <p className="details-price">{craftsmanInfos.price ?  craftsmanInfos.price + '€/h' : "Non renseigné"}</p>
                </div>
                <div className="card">
                    <p className="card-title">Zone d'intervention</p>
                    <p>Region : <span className="details-location">{craftsmanInfos.user.region}</span></p>
                    <p>Ville : <span className="details-location">{craftsmanInfos.user.city}</span></p>
                </div>
                <div className="card">
                    <p className="card-title">Membre depuis</p>
                    <p className="details-member-since">{dateMonthYear(craftsmanInfos.user.created_at)}</p>
                </div>
            </div>

            <div className="contact-craftsman">
                <h2>Informations de contact</h2>

                <div className="card-wrapper">
                    <div className="card phone-wrapper">
                        
                        { craftsmanInfos.user.hasOwnProperty("phone") 
                            ? craftsmanInfos.user.phone 
                                ? <>
                                    <a href={`tel:+${craftsmanInfos.user.phone}`} className="contact craftsman-phone">
                                        <FontAwesomeIcon icon={faPhone} />
                                    </a>
                                    <p>{craftsmanInfos.user.phone}</p>
                                </>
                                : <p>Non renseigné</p>
                            : <>
                                <div className="contact craftsman-phone">
                                    <FontAwesomeIcon icon={faPhone} />
                                </div>
                                <p>Vous devez être connecté pour voir cette information</p>
                            </> 
                            
                        }
                    </div>
                    <div className="card email-wrapper">
                        { craftsmanInfos.user.hasOwnProperty("email") 
                            ? craftsmanInfos.user.email 
                                ? <>
                                    <a href={`tel:+${craftsmanInfos.user.email}`} className="contact craftsman-email">
                                        <FontAwesomeIcon icon={faEnvelope} />
                                    </a>
                                    <p>{craftsmanInfos.user.email}</p>
                                </>
                                : <p>Non renseigné</p>
                            : <>
                                <div className="contact craftsman-email">
                                    <FontAwesomeIcon icon={faEnvelope} />
                                </div>
                                <p>Vous devez être connecté pour voir cette information</p>
                            </> 
                            
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetailsInformationsTab;