import './CtaContact.scss';
import { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faFilePen } from '@fortawesome/free-solid-svg-icons';

import Button from "../../../components/ui/Button.jsx";
import ModalSendMessage from "./modals/ModalSendMessage.jsx";
import ModalAskPrestation from "./modals/ModalAskPrestation.jsx";

function CtaContact({craftsmanInfos}) {
    
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
                    onClick={() => openModal('message')}>
                    Envoyer un message
                    <FontAwesomeIcon icon={faPaperPlane} />
                </Button>


                <Button className="btn btn-secondary"
                    onClick={() => openModal('prestation')}>
                    Demande prestation
                    <FontAwesomeIcon icon={faFilePen} />
                </Button>
            </div>

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