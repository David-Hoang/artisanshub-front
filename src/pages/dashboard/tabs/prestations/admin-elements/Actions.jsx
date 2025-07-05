import "./Actions.scss";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt } from '@fortawesome/free-solid-svg-icons';

import Button from "../../../../../components/ui/Button";
import Select from "../../../../../components/ui/Select";

function Actions({ selectedPresDetails, closeModal }) {
    return ( 
        <div className="card-admin-prestation action-admin-prestation">
            <div className="wrapper">
                <div className="icon">
                    <FontAwesomeIcon icon={faBolt} />
                </div>
                <h3>Actions rapides</h3>
            </div>

                <Select></Select>
            <div className="btn-wrapper">
                <Button className="btn-secondary" onClick={closeModal}>Fermer</Button>
                <Button className="btn-primary" onClick={closeModal}>Sauvegarder</Button>
            </div>
        </div>
    );
}

export default Actions;