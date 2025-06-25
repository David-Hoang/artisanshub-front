import './PrestationsTab.scss';
import { useState, useContext } from 'react';

import { PrestationsContext } from "../../context/PrestationsContext.jsx";

import { dateShort, firstCapitalize } from "../../../../utils/Helpers.jsx";
import Button from "../../../../components/ui/Button.jsx";
import Badge from "../../../../components/ui/Badge.jsx";
import SpinLoader from "../../../../components/ui/SpinLoader";

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
        <div className="prestations-tab">
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
                                        <p className="user-name">Artisan : {firstCapitalize(pres.user_last_name)} {firstCapitalize(pres.user_first_name)}</p>
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
                    { isModalOpen && 
                        <ModalPrestation 
                            isModalOpen={isModalOpen}
                            closeModal={closeModal} 
                            selectedPrestation={selectedPrestation}
                            userRole={userRole}
                            userToken={userToken}
                        />
                    }
                </>
            : <p>Vous n'avez actuellement aucune prestation.</p>
            }
        </div>
    );
}

export default PrestationsTab;