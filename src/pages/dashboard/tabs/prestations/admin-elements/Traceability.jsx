import "./Traceability.scss"
import { dateLongTime } from "../../../../../utils/Helpers";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';

function Traceability({ selectedPresDetails }) {
    return ( 
        <div className="card-admin-prestation traceability-admin-prestation">

            <div className="wrapper">
                <div className="icon">
                    <FontAwesomeIcon icon={faClock} />
                </div>
                <h3>Traçabilité</h3>
            </div>

            <div className="traceability-dates">
                <div>
                    <p className="label">ID Prestation</p>
                    <p>#{selectedPresDetails.id}</p>
                </div>
                <div>
                    <p className="label">Date de création</p>
                    <p>{dateLongTime(selectedPresDetails.created_at)}</p>
                </div>
                <div>
                    <p className="label">Dernière modification</p>
                    <p>{dateLongTime(selectedPresDetails.updated_at)}</p>
                </div>
            </div>
        </div>
    );
}

export default Traceability;