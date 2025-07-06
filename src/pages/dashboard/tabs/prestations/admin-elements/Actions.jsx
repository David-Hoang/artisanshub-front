import "./Actions.scss";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../../../../context/AuthContext";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt } from '@fortawesome/free-solid-svg-icons';

import Button from "../../../../../components/ui/Button";
import Select from "../../../../../components/ui/Select";
import AlertMessage from "../../../../../components/AlertMessage";
import SpinLoader from "../../../../../components/ui/SpinLoader";
import { PrestationsContext } from "../../../context/PrestationsContext";

function Actions({ selectedPresDetails, closeModal, statusList, fetchSelectedDetailsPrestation }) {

    const {alertMessage, errorMessage, updatePrestationState, isLoadingPrestationUpdate } = useContext(PrestationsContext);
    // contain this prestation state
    const [prestationState, setPrestationState] = useState({});

    useEffect(() => {
        setPrestationState({state : selectedPresDetails.state})
    }, []);


    return ( 
        <div className="card-admin-prestation action-admin-prestation">
            <div className="wrapper">
                <div className="icon">
                    <FontAwesomeIcon icon={faBolt} />
                </div>
                <h3>Actions rapides</h3>
            </div>

            <div>
                <Select 
                    label="Que recherchez-vous ?"
                    id="job"
                    selectPlaceholder="Sélectionnez l'état"
                    value={prestationState.state}
                    datasValues={statusList}
                    onChange={(e) => setPrestationState({...prestationState, state : e.target.value})}
                />
                {errorMessage && <AlertMessage type="error">{errorMessage}</AlertMessage>}
            </div>

            <div className="btn-wrapper">
                <Button className="btn-secondary" onClick={closeModal}>Fermer</Button>
                <Button className="btn-primary" onClick={() => updatePrestationState(prestationState, selectedPresDetails.id, fetchSelectedDetailsPrestation)}>
                    {isLoadingPrestationUpdate ? (
                            <SpinLoader />
                        ) : (
                            <>
                                Sauvegarder
                            </>
                        )}
                </Button>
                {alertMessage && alertMessage.type === "success" && <AlertMessage type="success">{alertMessage.message}</AlertMessage>}
                {alertMessage && alertMessage.type === "error" && <AlertMessage type="error">{alertMessage.message}</AlertMessage>}
            </div>
        </div>
    );
}

export default Actions;