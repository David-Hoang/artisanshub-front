import './CtaContact.scss';
import { useContext, useState } from 'react';
import { AuthContext } from "../../../context/AuthContext.jsx";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faFilePen, faCircleInfo } from '@fortawesome/free-solid-svg-icons';

import Button from "../../../components/ui/Button.jsx";
import ModalSendMessage from "./modals/ModalSendMessage.jsx";
import ModalAskPrestation from "./modals/ModalAskPrestation.jsx";

function CtaContact({craftsmanInfos}) {

    const {hasCompletedProfile, isAdmin} = useContext(AuthContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [action, setAction] = useState(null);
    
    const openModal = (action) => {
        setIsModalOpen(true);
        setAction(action);
    }

    const closeModal = () => {
        setIsModalOpen(false);
        setAction(null);
    }
    
    return ( 
        <>
            <div className="cta-wrapper">
                
                <Button className="btn btn-primary"
                    onClick={() => openModal('message')}
                    disabled={!hasCompletedProfile}
                    title={!hasCompletedProfile && "Veuillez compléter votre profil pour utiliser cette fonctionnalité"}
                    >
                    Envoyer un message
                    <FontAwesomeIcon icon={faPaperPlane} />
                </Button>

                { !isAdmin &&
                    <Button className="btn btn-secondary"
                        onClick={() => openModal('prestation')}
                        disabled={!hasCompletedProfile}
                        title={!hasCompletedProfile && "Veuillez compléter votre profil pour utiliser cette fonctionnalité"}
                        >
                        Demande prestation
                        <FontAwesomeIcon icon={faFilePen} />
                    </Button>
                }
            </div>

            {!hasCompletedProfile &&
                <h4 className="important-informations">
                    <FontAwesomeIcon icon={faCircleInfo} />
                    Veuillez compléter vos informations pour accéder ces fonctionnalités.
                </h4>
            }

            {isModalOpen &&  action === "message" &&
                <ModalSendMessage 
                    isOpen={isModalOpen}
                    closeModal={closeModal}
                    craftsmanInfos={craftsmanInfos}
                />
            }

            {isModalOpen &&  action === "prestation" &&
                <ModalAskPrestation
                    isOpen={isModalOpen}
                    closeModal={closeModal}
                    craftsmanInfos={craftsmanInfos}
                />
            }

        </>
    );
}

export default CtaContact;