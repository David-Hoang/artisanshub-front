import './MessagesTab.scss';
import { useState, useEffect, useContext } from 'react';
import axios from "axios";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock } from '@fortawesome/free-solid-svg-icons'

import { dateShortTime, firstCapitalize } from "../../../utils/Helpers.jsx";

import { AuthContext } from "../../../context/AuthContext";

import DefaultCraftsman from '../../../assets/img/default-craftsman.svg';

import SpinLoader from "../../ui/SpinLoader";
import Badge from "../../ui/Badge.jsx";
import ModalMessage from './elements/ModalMessage.jsx';

function MessagesTab() {

    const apiBase = import.meta.env.VITE_MAIN_API_URI;
    const { userToken, userDatas } = useContext(AuthContext);

    const [userConversations, setUserConversations] = useState(null);
    const [isLoadingConversations, setIsLoadingConversations] = useState(false)

    const fetchUserConversations = async () => {
        setIsLoadingConversations(true)

        try {
            const response = await axios.get(`${apiBase}/api/message/all-conversations`, {
                    headers: {
                        "Authorization": "Bearer " + userToken,
                    }
                })
            setUserConversations(response.data);
            console.log(response.data);
            
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoadingConversations(false)
        }
    }

    useEffect(() => {
        fetchUserConversations()
    }, []);

    const [selectedUserConversation, setSelectedUserConversation] = useState(null)

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (conversation) => {
        setSelectedUserConversation(conversation)
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUserConversation(null)
    }

    return ( 
        <div className="messages-tab-client">

            { isLoadingConversations
                ? <SpinLoader className="loading-list"/>
                : userConversations && userConversations.length > 0
                ? 
                    <>
                        <ul className="conversation-list">
                            {userConversations.map(conversation => (

                                <li key={conversation.id} className="card contact-discussion" onClick={() => openModal(conversation)}>
                                    <div className="image-container">
                                        <img className="image-craftsman" 
                                            src={conversation.profile_img?.img_path ? `${apiBase}/storage/${conversation.profile_img.img_path}` : DefaultCraftsman}
                                            alt={conversation.profile_img?.img_title ? conversation.profile_img?.img_title : 'Image utilisateur'}
                                        />
                                    </div>
                                    <div className="infos-discussion">
                                        <Badge color="info">{conversation.craftsman.job.name}</Badge>
                                        <div className="craftsman-name-date">
                                            <h3>{firstCapitalize(conversation.first_name)} {firstCapitalize(conversation.last_name)}</h3>
                                            <div className="message-date">
                                                <FontAwesomeIcon icon={faClock} />
                                                <p>{dateShortTime(conversation.last_message.created_at)}</p>
                                            </div>
                                        </div>
                                        <p className="message-content">{conversation.last_message.content}</p>
                                    </div>
                                </li>

                            ))}
                        </ul>
                        
                        { isModalOpen && <ModalMessage 
                                            isModalOpen={isModalOpen} 
                                            closeModal={closeModal} 
                                            selectedUserConversation={selectedUserConversation}
                                            userId={userDatas.id}
                                            userToken={userToken}
                                        /> 
                        }
                    </>
                : <p>Vous n'avez aucun messages</p>
            }

        </div>
    );
}

export default MessagesTab;