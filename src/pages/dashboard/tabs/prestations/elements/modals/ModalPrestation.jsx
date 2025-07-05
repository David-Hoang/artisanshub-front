import "./ModalPrestation.scss";
import { useState, useEffect, useContext } from 'react';
import axios from "axios";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGears } from '@fortawesome/free-solid-svg-icons';

import { firstCapitalize } from "../../../../../../utils/Helpers.jsx";

import { PrestationsContext } from "../../../../context/PrestationsContext.jsx";
import { AuthContext } from "../../../../../../context/AuthContext.jsx";

import Modal from "../../../../../../components/ui/Modal.jsx";
import SpinLoader from "../../../../../../components/ui/SpinLoader.jsx";

import ResumeClientPrestation from "../ResumeClientPrestation.jsx";
import StatePrestationClient from "../StatePrestationClient.jsx";
import StatePrestationCraftsman from "../StatePrestationCraftsman.jsx";

import ContactClient from "../ContactClient.jsx";
import ContactCraftsman from "../ContactCraftsman.jsx";
import Actions from "../Actions.jsx";

function ModalPrestation({isModalOpen, closeModal, selectedPrestation}) {

    const apiBase = import.meta.env.VITE_MAIN_API_URI;

    const {setQuoteForm, setAlertMessage, setQuoteErrorForm} = useContext(PrestationsContext);
    const {userToken, userRole} = useContext(AuthContext);
    const [detailsPrestation, setDetailsPrestation] = useState(null);
    const [isLoadingDetailsPrestation, setIsLoadingDetailsPrestation] = useState(false);

    const fetchDetailsPrestation = async (presId) => {
        setIsLoadingDetailsPrestation(true)
        try {
            const response = await axios.get(`${apiBase}/api/prestation/${presId}`, {
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
        setQuoteForm({price : "", date : ""});
        setAlertMessage({type : "", message : ""});
        setQuoteErrorForm({price : "", date : ""});
        fetchDetailsPrestation(selectedPrestation.id);
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
                ? <SpinLoader className="loading-prestations"/>
                : detailsPrestation 
                    ? 
                        <div className="modal-main">
                            <div className="content-prestation">

                                <ResumeClientPrestation detailsPrestation={detailsPrestation} userRole={userRole}/>

                                {userRole === 'client' && <StatePrestationClient detailsPrestation={detailsPrestation} />}
                                {userRole === 'craftsman' && <StatePrestationCraftsman detailsPrestation={detailsPrestation} />}
                                
                            </div>
                            
                            <aside>
                                {userRole === 'client' && <ContactClient detailsPrestation={detailsPrestation}/> }
                                {userRole === 'craftsman' && <ContactCraftsman detailsPrestation={detailsPrestation}/> }
                                <Actions 
                                    detailsPrestation={detailsPrestation}
                                    user={{userToken, userRole}}
                                    closeModal={closeModal} 
                                    fetchDetailsPrestation={fetchDetailsPrestation}
                                />
                            </aside>
                        </div>
                    : <p>Un problème est survenu. Veuillez recharger la prestation.</p>
            }
        </Modal>
    );
}

export default ModalPrestation;