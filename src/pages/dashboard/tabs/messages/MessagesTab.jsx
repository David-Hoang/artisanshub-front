import './MessagesTab.scss';
import { useState, useEffect, useContext } from 'react';
import axios from "axios";

import { AuthContext } from "../../../../context/AuthContext.jsx";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock } from '@fortawesome/free-solid-svg-icons'

import { dateShortTime, firstCapitalize } from "../../../../utils/Helpers.jsx";

import DefaultCraftsman from '../../../../assets/img/default-craftsman.svg';
import DefaultClient from '../../../../assets/img/default-client.svg';

import SpinLoader from "../../../../components/ui/SpinLoader.jsx";
import Badge from "../../../../components/ui/Badge.jsx"

import ModalMessage from './elements/modals/ModalMessage.jsx';

function MessagesTab() {

    const apiBase = import.meta.env.VITE_MAIN_API_URI;
    const {userRole, userToken} = useContext(AuthContext);

    const [userConversations, setUserConversations] = useState(null);
    const [isLoadingConversations, setIsLoadingConversations] = useState(false);

    const fetchUserConversations = async () => {
        setIsLoadingConversations(true)

        try {
            const response = await axios.get(`${apiBase}/api/message/all-conversations`, {
                    headers: {
                        "Authorization": "Bearer " + userToken,
                    }
                })

            //populate userConversations
            loadConversation(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoadingConversations(false)
        }
    }

    useEffect(() => {
        fetchUserConversations()
    }, []);

    const loadConversation = (conversations) => {
        if(userRole === "client"){
        
            if(conversations && conversations.length > 0){

                const conversationList = conversations.map(conversation =>({
                        id : conversation.id,
                        first_name : conversation.first_name ?? "Prénom",
                        last_name : conversation.last_name ?? "Nom",
                        img_path : conversation.profile_img?.img_path ? `${apiBase}/storage/${conversation.profile_img.img_path}` : DefaultCraftsman,
                        img_title: conversation.profile_img?.img_title ? conversation.profile_img?.img_title : 'Image utilisateur',
                        job_name : conversation.craftsman?.job.name ?? "Métier",
                        last_message_time : conversation.last_message?.created_at,
                        last_message : conversation.last_message?.content ?? "Aucun message",
                    })
                )

                setUserConversations(conversationList);
            }else{
                setUserConversations(null)
            }
    
        }
        
        if(userRole === "craftsman"){

            if(conversations && conversations.length > 0){

                const conversationList = conversations.map(conversation =>({
                        id : conversation.id,
                        first_name : conversation.first_name ?? "Prénom",
                        last_name : conversation.last_name ?? "Nom",
                        img_path : conversation.profile_img?.img_path ? `${apiBase}/storage/${conversation.profile_img.img_path}` : DefaultClient,
                        img_title: conversation.profile_img?.img_title ? conversation.profile_img?.img_title : 'Image utilisateur',
                        last_message_time : conversation.last_message?.created_at,
                        last_message : conversation.last_message?.content ?? "Aucun message",
                    })
                )

                setUserConversations(conversationList);
            }else{
                setUserConversations(null)
            }
        }
    }

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
        <div id="messages-tab">

            { isLoadingConversations
                ? <SpinLoader className="loading-list"/>
                : userConversations && userConversations.length > 0
                ? 
                    <>
                        <ul className="conversation-list">
                            {userConversations.map(conversation => (

                                <li key={conversation.id} className="card contact-discussion" onClick={() => openModal(conversation)}>
                                    <div className="image-container">
                                        <img className="image-profile" 
                                            src={conversation.img_path}
                                            alt={conversation.img_title}
                                        />
                                    </div>
                                    <div className="infos-discussion">
                                        { conversation.job_name && <Badge color="info">{conversation.job_name}</Badge> }
                                        <div className="contact-name-date">
                                            <h3>{firstCapitalize(conversation.first_name)} {firstCapitalize(conversation.last_name)}</h3>
                                            <div className="message-date">
                                                <FontAwesomeIcon icon={faClock} />
                                                <p>{dateShortTime(conversation.last_message_time)}</p>
                                            </div>
                                        </div>
                                        <p className="message-content">{conversation.last_message}</p>
                                    </div>
                                </li>

                            ))}
                        </ul>
                    </>
                : <p className="no-message">Vous n'avez actuellement aucun message.</p>
            }

            { isModalOpen && 
                <ModalMessage 
                    isModalOpen={isModalOpen} 
                    closeModal={closeModal} 
                    selectedUserConversation={selectedUserConversation}
                /> 
            }
        </div>
    );
}

export default MessagesTab;