import './PrestationsTab.scss';
import { useState, useEffect, useContext } from 'react';
import axios from "axios";

import { PrestationsContext } from "../../context/PrestationsContext.jsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGears, faFileLines, faEuroSign, faCalendar, faUserCheck, faPhone, faEnvelope, faHourglassHalf, faListCheck, faCaretRight, faBolt, faUserClock, faCheck, faUserXmark } from '@fortawesome/free-solid-svg-icons'

import { dateShort, firstCapitalize } from "../../../../utils/Helpers.jsx";
import Button from "../../../../components/ui/Button.jsx";
import Badge from "../../../../components/ui/Badge.jsx"
import SpinLoader from "../../../../components/ui/SpinLoader";
import AlertMessage from "../../../../components/AlertMessage";


import ModalPrestation from "./elements/ModalPrestation.jsx";

function PrestationsTab({userToken, userRole}) {
    
    const {isLoadingPrestations, userPrestations} = useContext(PrestationsContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPrestation, setSelectedPrestation] = useState(null);
    
    const openModal = (selectedPrestation) => {
        setIsModalOpen(true);
        setSelectedPrestation(selectedPrestation);
    }

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedPrestation(null);
    }

    return ( 
            <div className="prestations-tab-client">
                {isLoadingPrestations 
                ? <SpinLoader className="loading-list"/>
                : userPrestations && userPrestations.length > 0 
                ? 
                    <>
                        { userPrestations.map(pres => (
                                <article key={pres.id} className="prestation-card">
                                    <div className="wrapper">
                                        <div className="prestation-header">
                                            <h3 className="prestation-title">{firstCapitalize(pres.title)}</h3>
                                            <p className="craftsman-name">Artisan : {firstCapitalize(pres.craftsman?.user?.last_name)} {firstCapitalize(pres.craftsman?.user?.first_name)}</p>
                                        </div>

                                        {pres.state === "await-craftsman" && <Badge color="pending">En attente artisan</Badge> }
                                        {pres.state === "await-client" && <Badge color="pending">En attente client</Badge> }
                                        {pres.state === "confirmed" && <Badge color="info">Prestation confirmé</Badge> }
                                        {pres.state === "completed" && <Badge color="success">Prestation complété</Badge> }
                                        {pres.state === "refused-by-client" && <Badge color="danger">Refusé par le client</Badge> }
                                        {pres.state === "refused-by-craftsman" && <Badge color="danger">Refusé par l'artisan</Badge> }
                                    </div>
                                    <p className="prestation-date">Date de demande : {dateShort(pres.created_at)}</p>
                                    <Button className="btn-primary" onClick={() => openModal(pres)}>Voir les détails</Button>
                                </article>
                            ))
                        }
                        {isModalOpen && 
                            <ModalPrestation 
                                isModalOpen={isModalOpen}
                                closeModal={closeModal} 
                                selectedPrestation={selectedPrestation}
                                userRole={userRole}
                                userToken={userToken}
                            />
                        }
                        {/* { isModalOpen && userRole === 'client' && 
                            <ModalPrestationClient 
                                isModalOpen={isModalOpen}
                                selectedPrestation={selectedPrestation}
                                closeModal={closeModal}
                                userToken={userToken}
                            />
                        }
                        { isModalOpen && userRole === 'craftsman' && 
                            <ModalPrestationCraftsman
                                isModalOpen={isModalOpen}
                                selectedPrestation={selectedPrestation}
                                closeModal={closeModal}
                                userToken={userToken}
                            />
                        } */}
                    </>
                : <p>Vous n'avez actuellement aucune prestation.</p>
                }
            </div>
    );
}

export default PrestationsTab;