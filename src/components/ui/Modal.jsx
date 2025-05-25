import './Modal.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import Button from "./Button";

function Modal({children, isOpen, closeModal, className, ...props}) {

    if (!isOpen) return null;

    return ( 
        <div className="background-modal" onClick={closeModal}>
            <div className={className ? `modal ${className}` : "modal"}
                onClick={(e) => {e.stopPropagation()}}>
                    
                <Button className="close-modal" onClick={closeModal}>
                    <FontAwesomeIcon icon={faXmark} />
                </Button>

                {children}

            </div>
        </div>
    );
}

export default Modal;