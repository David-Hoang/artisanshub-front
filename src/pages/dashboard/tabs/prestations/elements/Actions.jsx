import { useState, useContext } from "react";
import axios from "axios";

import { PrestationsContext } from "../../../context/PrestationsContext.jsx";


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGears, faFileLines, faEuroSign, faCalendar, faUserCheck, faPhone, faEnvelope, faHourglassHalf, faListCheck, faCaretRight, faBolt, faUserClock, faCheck, faUserXmark } from '@fortawesome/free-solid-svg-icons'

import Button from "../../../../../components/ui/Button";
import AlertMessage from "../../../../../components/AlertMessage";
import SpinLoader from "../../../../../components/ui/SpinLoader";

function Actions({detailsPrestation, closeModal, fetchDetailPrestation, userToken, alertMessage, setAlertMessage}) {

    const apiBase = import.meta.env.VITE_MAIN_API_URI;
    const {fetchUserPrestations} = useContext(PrestationsContext);

    const [isLoadingConfirm, setIsLoadingConfirm] = useState(false);
    const [isLoadingCancel, setIsLoadingCancel] = useState(false);

    const defaultAlertMessage = {type : "", message : ""};

    const clientAccept = async (presId) => {
        // Empty alert message
        setAlertMessage(defaultAlertMessage);
        setIsLoadingConfirm(true);

        try {
            const response = await axios.patch(`${apiBase}/api/prestation/${presId}/accept`,
                {},
                { headers: {"Authorization": "Bearer " + userToken} 
            })

            if(response.status === 200) {
                setAlertMessage({...alertMessage, type : "success", message : "Votre modification a bien été pris en compte."});
                fetchDetailPrestation(presId);
                // fetchUserPrestations();
            }

        } catch (error) {

            const { status } = error.response;

            if(status === 403){
                setAlertMessage({...alertMessage, type : "error", message : "Cette prestation ne vous est pas assignée ou son état ne permet pas de répondre"});

            } else if (status === 404){
                setAlertMessage({...alertMessage, type : "error", message : "Cette prestation n'existe pas."});
            } 
            else if(status === 500){
                setAlertMessage({...alertMessage, type : "error", message : "Une erreur est survenue lors de l'acceptation de la prestation."});
            }
        } finally {
            setIsLoadingConfirm(false);
        }
    }

    
    const clientRefuse = async (presId) => {
        // Empty alert message
        setAlertMessage(defaultAlertMessage);
        setIsLoadingCancel(true);

        try {
            const response = await axios.patch(`${apiBase}/api/prestation/${presId}/client-refuse`,
                {},
                { headers: {"Authorization": "Bearer " + userToken} 
            })

            if(response.status === 200) {
                setAlertMessage({...alertMessage, type : "success", message : "Vous avez refusé la proposition."});
                fetchDetailPrestation(presId);
                // fetchUserPrestations();
            }

        } catch (error) {

            const { status } = error.response;

            if(status === 403){
                setAlertMessage({...alertMessage, type : "error", message : "Cette prestation ne vous est pas assignée ou son état ne permet pas de répondre"});

            } else if (status === 404){
                setAlertMessage({...alertMessage, type : "error", message : "Cette prestation n'existe pas."});
            } 
            else if(status === 500){
                setAlertMessage({...alertMessage, type : "error", message : "Une erreur est survenue lors du refus de la prestation."});
            }
        } finally {
            setIsLoadingCancel(false);
        }
    }

    return ( 
        <div className="actions-btn">
            <div className="wrapper">
                <div className="icon">
                    <FontAwesomeIcon icon={faBolt} />
                </div>
                <h3>Actions</h3>
            </div>
            <div className="info-card card">
                {detailsPrestation.state === "await-craftsman" && 
                    <p className="prestation-info pending">En attente de la réponse de l'artisan&nbsp;...</p>
                }
                {detailsPrestation.state === "await-client" && 
                    <>
                        <Button className="action-accept" onClick={() => clientAccept(detailsPrestation.id)}> 
                            {isLoadingConfirm ? (
                                <SpinLoader />
                            ) : (
                                <>
                                    Accepter la proposition
                                </>
                            )}
                        </Button> 
                        <Button className="action-refuse" onClick={() => clientRefuse(detailsPrestation.id)}>
                            {isLoadingCancel ? (
                                <SpinLoader />
                            ) : (
                                <>
                                    Refuser la proposition
                                </>
                            )}
                        </Button>
                    </>
                }

                {detailsPrestation.state === "confirmed" && 
                    <p className="prestation-info info">Vous avez accepté la proposition, l'artisan va intervenir sous peu.</p>
                }
                {detailsPrestation.state === "completed" && 
                    <p className="prestation-info success">Votre projet est terminé succès.</p>
                }
                {detailsPrestation.state === "refused-by-client" &&
                    <p className="prestation-info cancel">Vous avez refusé la proposition.</p>
                }
                {detailsPrestation.state === "refused-by-craftsman" &&
                    <p className="prestation-info cancel">L'artisan a refusé votre demande.</p>
                }

                <Button className="btn-primary" onClick={closeModal}>Fermer</Button>
                {alertMessage && alertMessage.type === "success" && <AlertMessage type="success">{alertMessage.message}</AlertMessage>}
                {alertMessage && alertMessage.type === "error" && <AlertMessage type="error">{alertMessage.message}</AlertMessage>}
            </div>
        </div>
    );
}

export default Actions;