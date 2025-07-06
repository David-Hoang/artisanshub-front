import "./Parties.scss";
import { firstCapitalize } from "../../../../../utils/Helpers";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserGroup } from '@fortawesome/free-solid-svg-icons';


function Parties({ selectedPresDetails }) {
    return ( 
        <div className="card-admin-prestation parties-prestation">
            <div className="wrapper">
                <div className="icon">
                    <FontAwesomeIcon icon={faUserGroup} />
                </div>
                <h3>Parties prenantes</h3>
            </div>

            <div className="parties">
                <div className="client-part">
                    <div className="icon">
                        <FontAwesomeIcon icon={faUser} />
                    </div>
                    <div className="client-infos">
                        <p className="label">Client</p>
                        <p className="user-name">
                            {firstCapitalize(selectedPresDetails?.client_first_name ?? "inconnu") 
                            + ' ' +
                            firstCapitalize(selectedPresDetails?.client_last_name ?? "inconnu")}
                        </p>
                    </div>
                </div>

                <div className="craftsman-part">
                    <div className="icon">
                        <FontAwesomeIcon icon={faUser} />
                    </div>
                    <div className="craftsman-infos">
                        <p className="label">Artisan</p>
                        <p className="user-name">
                            {firstCapitalize(selectedPresDetails?.craftsman_first_name ?? "inconnu") 
                            + ' ' +
                            firstCapitalize(selectedPresDetails?.craftsman_last_name ?? "inconnu")}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Parties;