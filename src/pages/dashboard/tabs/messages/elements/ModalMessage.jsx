import './ModalMessage.scss';

import { useState, useEffect, useRef, useContext  } from 'react';
import axios from "axios";

import { AuthContext } from "../../../../../context/AuthContext.jsx";

import { firstCapitalize, dateMessageFormat } from "../../../../../utils/Helpers";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

import Modal from "../../../../../components/ui/Modal.jsx";
import Badge from "../../../../../components/ui/Badge.jsx";
import TextArea from "../../../../../components/ui/TextArea.jsx";
import SpinLoader from "../../../../../components/ui/SpinLoader.jsx";
import Button from "../../../../../components/ui/Button.jsx";
import AlertMessage from "../../../../../components/AlertMessage.jsx";

function ModalMessage({isModalOpen, closeModal, selectedUserConversation}) {
        
    const apiBase = import.meta.env.VITE_MAIN_API_URI;
    const {userToken} = useContext(AuthContext)

    const [isLoadingConversation, setIsLoadingConversation] = useState(false)
    const [conversation, setConversation] = useState([])

    const [messageToSend, setMessageToSend] = useState("");
    const [alertMessage, setAlertMessage] = useState("");

    const messageList = useRef(null);

    const fetchConversation = async () => {
        setIsLoadingConversation(true);
        try {
            const response = await axios.get(`${apiBase}/api/message/conversation/${selectedUserConversation.id}`, {
                headers: {
                    "Authorization": "Bearer " + userToken,
                }
            })

            if(response.status === 200){
                setConversation(response.data);
            }                

        } catch (error) {
            console.log(error);
        } finally {
            setIsLoadingConversation(false);
        }
    }

    useEffect(() => {
        fetchConversation()
    }, []);

    useEffect(() => {
        if (conversation.length > 0 && messageList.current) {
            setTimeout(() => {
                messageList.current.scrollIntoView({ behavior: "smooth" });
            }, 0);
        }
    }, [conversation]);

    const handleSendMessage = async (e) => {
        e.preventDefault()
        setAlertMessage("");

        if(!messageToSend) {
            return;
        } else if (messageToSend.length > 65535){
            setAlertMessage("Votre message est trop long, maximum de caractère par message : 65535.");
            return;
        };

        try {
            const response = await axios.post(`${apiBase}/api/message/send/${selectedUserConversation.id}`,
                            { content : messageToSend},
                            {
                                headers: {
                                    "Authorization": "Bearer " + userToken,
                                }
                            })
            if(response.status === 201){
                setMessageToSend("");
                fetchConversation();
            }
        } catch (error) {
            console.log(error);
        }
        
    }
        
    return ( 
        <Modal isOpen={isModalOpen} closeModal={closeModal} className="modal-message">
            <div className="modal-header">
                <div className="image-container">
                    <img className="image-craftsman" 
                        src={ selectedUserConversation.img_path }
                        alt={ selectedUserConversation.img_title }
                        />
                </div>
                <div className="user-name-job">
                    <h4 className="user-name">{firstCapitalize(selectedUserConversation.first_name)} {firstCapitalize(selectedUserConversation.last_name)}</h4>
                    { selectedUserConversation.job_name && <Badge color="info">{selectedUserConversation.job_name}</Badge> }
                </div>
            </div>
            <section className="messages-content">
                {isLoadingConversation 
                    ? <SpinLoader/>
                    : conversation && conversation.length > 0 
                        ? 
                        <ul className="conversation" ref={messageList}>
                            {conversation.map((message, key) => (
                                <li key={key} className={`message-content ${selectedUserConversation.id === message.sender_id  ? 'receiver' : ' sender'}`}>
                                    <div className={`message-badge ${selectedUserConversation.id === message.sender_id  ? 'receiver' : ' sender'}`}>
                                        <p className="message">
                                            {message.content}
                                        </p>
                                    </div>
                                    <p className="date-time">{dateMessageFormat(message.created_at)}</p>
                                </li>
                            ))}
                        </ul>
                        : <p>Vous n'avez aucun message avec {firstCapitalize(selectedUserConversation.first_name)} {firstCapitalize(selectedUserConversation.last_name)}</p>
                }
            </section>
            <form onSubmit={handleSendMessage} className="send-message">
                {alertMessage && <AlertMessage type="error">{alertMessage}</AlertMessage>}
                <TextArea 
                    placeholder="Votre message ..."
                    rows="4"
                    value={messageToSend}
                    onChange={(e) => setMessageToSend(e.target.value)}
                />
                <Button type="submit" className="btn-primary">
                    Envoyer
                    <FontAwesomeIcon icon={faPaperPlane} />
                </Button>
            </form>
        </Modal>
    );
}

export default ModalMessage;