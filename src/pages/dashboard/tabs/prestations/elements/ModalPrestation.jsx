import { useState, useEffect } from 'react';
import axios from "axios";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGears, faUserCheck, faPhone, faEnvelope, faHourglassHalf, faListCheck, faCaretRight, faBolt, faUserClock, faCheck, faUserXmark } from '@fortawesome/free-solid-svg-icons';

import { firstCapitalize, dateLong, dateFull } from "../../../../../utils/Helpers.jsx";

import DefaultCraftsman from '../../../../../assets/img/default-craftsman.svg';
import DefaultClient from '../../../../../assets/img/default-client.svg';

import Modal from "../../../../../components/ui/Modal.jsx";
import SpinLoader from "../../../../../components/ui/SpinLoader.jsx";

import ResumeClientPrestation from "./ResumeClientPrestation.jsx";
import StatePrestation from "./StatePrestation.jsx";

import Contact from "./Contact.jsx";
import Actions from "./Actions.jsx";


function ModalPrestation({isModalOpen, closeModal, selectedPrestation, userToken, userRole}) {

    const apiBase = import.meta.env.VITE_MAIN_API_URI;

    const [detailsPrestation, setDetailsPrestation] = useState(null);
    const [isLoadingDetailsPrestation, setIsLoadingDetailsPrestation] = useState(false);

    const defaultAlertMessage = {type : "", message : ""};
    const [alertMessage, setAlertMessage] = useState(defaultAlertMessage);

    const fetchDetailPrestation = async (presId) => {
        setIsLoadingDetailsPrestation(true)
        try {
            const response = await axios.get(`${apiBase}/api/prestation/${selectedPrestation.id}`, {
                headers: {
                    "Authorization": "Bearer " + userToken,
                }
            })
            setDetailsPrestation(response.data);
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoadingDetailsPrestation(false)
        }
    }

    useEffect(() => {
        fetchDetailPrestation();
    }, []);

    return ( 
        <Modal isOpen={isModalOpen} closeModal={closeModal} className="prestation-details">
            <div className="modal-header">
                <div className="icon-bg">
                    <FontAwesomeIcon icon={faGears}/>
                </div>
                <div className="modal-title">
                    <h3>{firstCapitalize(selectedPrestation.title)}</h3>
                    <h4>Détails de la prestation</h4>
                </div>
            </div>
            
            {isLoadingDetailsPrestation 
                ? <SpinLoader/>
                : detailsPrestation 
                    ? 
                        <div className="modal-main">
                            <div className="modal-client-prestation">
                                <ResumeClientPrestation detailsPrestation={detailsPrestation} />
                                <StatePrestation detailsPrestation={detailsPrestation} />
                            </div>
                            
                            <aside>
                                <Contact detailsPrestation={detailsPrestation} />
                                <Actions 
                                    detailsPrestation={detailsPrestation} 
                                    closeModal={closeModal} 
                                    fetchDetailPrestation={fetchDetailPrestation}
                                    userToken={userToken}
                                    alertMessage={alertMessage}
                                    setAlertMessage={setAlertMessage}
                                />
                            </aside>
                        </div>
                    : <p>Un problème est survenu. Veuillez recharger la prestation.</p>
            }
        </Modal>
    );
}

export default ModalPrestation;