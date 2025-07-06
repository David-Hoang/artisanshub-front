import "./ModalSendMessage.scss";
import { useContext, useState }  from 'react';
import axios from "axios";
import { AuthContext } from "../../../../context/AuthContext.jsx";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faCircleCheck } from '@fortawesome/free-solid-svg-icons';

import Modal from "../../../../components/ui/Modal";
import TextArea from "../../../../components/ui/TextArea.jsx";
import AlertMessage from "../../../../components/AlertMessage.jsx";
import Button from "../../../../components/ui/Button.jsx";
import SpinLoader from "../../../../components/ui/SpinLoader.jsx";

function ModalSendMessage({isOpen, closeModal, craftsmanInfos}) {

    const apiBase = import.meta.env.VITE_MAIN_API_URI;
    const {userToken} = useContext(AuthContext);

    const [messageToSend, setMessageToSend] = useState("");

    const defaultAlertMessage = {type : "", message : ""};
    const [alertMessage, setAlertMessage] = useState(defaultAlertMessage);

    const [isLoadingSend, setIsLoadingSend] = useState(false);

    const [messageSended, setMessageSended] = useState(false);
    
    const handleSendMessage = async (e) => {
        e.preventDefault()
        setAlertMessage(defaultAlertMessage);

        setIsLoadingSend(true);

        if(!messageToSend) {
            setAlertMessage({type : "error", message : "Saisissez votre message avant de cliquer sur le bouton d’envoi."});
            setIsLoadingSend(false);
            return;
        } else if (messageToSend.length > 65535){
            setAlertMessage({type : "error", message : "Votre message est trop long, maximum de caractère par message : 65535."});
            setIsLoadingSend(false);
            return;
        };

        try {
            const response = await axios.post(`${apiBase}/api/message/send/${craftsmanInfos.user.id}`,
                            { content : messageToSend},
                            {
                                headers: {
                                    "Authorization": "Bearer " + userToken,
                                }
                            })
            if(response.status === 201){
                setMessageSended(true);
                setMessageToSend("");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoadingSend(false);
        }
        
    }
    return ( 
        <Modal isOpen={isOpen} closeModal={closeModal} className="modal-send-message">
            { messageSended && 
                <>
                    <p className="message-sended"> 
                        <FontAwesomeIcon icon={faCircleCheck} />
                        Votre message à bien été transmis à {craftsmanInfos.user.first_name}, vous pouvez continuer la conversation dans votre tableau de bord.
                    </p>
                    <Button className="btn btn-primary btn-message-sended" onClick={closeModal}>
                            Fermer
                    </Button>
                </>
            }

            { !messageSended &&
                <>
                    <div className="modal-header">
                        <h4>Envoyer un message à {craftsmanInfos.user.first_name}</h4>
                    </div>
                    <form onSubmit={handleSendMessage} className="send-message">
                        <TextArea 
                            placeholder="Votre message ..."
                            rows="3"
                            value={messageToSend}
                            onChange={(e) => setMessageToSend(e.target.value)}
                        />

                        {alertMessage.message && alertMessage.type === "error" && 
                            <AlertMessage type="error">{alertMessage.message}</AlertMessage>
                        }

                        <div className="btn-wrapper">
                            <Button className="btn btn-secondary" onClick={closeModal}>
                                Fermer
                            </Button>

                            <Button type="submit" className="btn-primary">
                                { isLoadingSend 
                                    ? <SpinLoader />
                                    : <>
                                        Envoyer
                                        <FontAwesomeIcon icon={faPaperPlane} />
                                    </>
                                }
                            </Button>
                        </div>
                    </form>
                </>
            }

        </Modal>
    );
}

export default ModalSendMessage;