import "./UsersTab.scss";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../../context/AuthContext";
import { dateShort } from "../../../../utils/Helpers";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrash } from '@fortawesome/free-solid-svg-icons';

import Table from "../../../../components/ui/Table";
import SpinLoader from "../../../../components/ui/SpinLoader";
import ModalUser from "./elements/modals/ModalUser";
import Button from "../../../../components/ui/Button";
import AlertMessage from "../../../../components/AlertMessage";

function UsersTab() {

    const apiBase = import.meta.env.VITE_MAIN_API_URI;
    const { userToken } = useContext(AuthContext);
    const [isLoadingUsersList, setIsLoadingUsersList] = useState(false);
    const [usersList, setUsersList] = useState([])
    const [errorMessage, setErrorMessage] = useState("");

    const fetchUsersList = async () => {
        setIsLoadingUsersList(true);

        try {
            const users = await axios.get(`${apiBase}/api/admin/all-users`, {
                    headers: {
                        "Authorization": "Bearer " + userToken,
                    }
                })
            
            if(users.status === 200) setUsersList(users.data);
            
        } catch (error) {
            setErrorMessage("Une erreur est survenu, veuillez reessayer plus tard.");
        } finally {
        setIsLoadingUsersList(false);
        }
    } 

    useEffect(() => {
        fetchUsersList()
    }, []);

    const titleCol = [ "Nom", "Prénom", "Email", "Rôle", "Téléphone", "Région", "Inscrit le", "Action" ];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const openModal = (selectedUser) => {
        setIsModalOpen(true);
        setSelectedUser(selectedUser);
    }

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    }

    const [isOpenconfirmDelete , setisOpenConfirmDelete] = useState(false);
    const defaultAlertMessage = {type : "", message : ""};
    const [alertMessage, setAlertMessage] = useState(defaultAlertMessage);
    const [isLoadingUserDelete, setIsLoadingUserDelete] = useState(false);

    const confirmDelete = (index) => {
        setisOpenConfirmDelete(index);
    }

    const closeDelete = () => {
        setAlertMessage(defaultAlertMessage);
        setisOpenConfirmDelete(null);
    }

    const deleteUser = async (userId) => {
        setAlertMessage(defaultAlertMessage);
        setIsLoadingUserDelete(true);

        try{
            const response = await axios.delete(`${apiBase}/api/admin/user/${userId}`,
                { headers: 
                    {"Authorization": `Bearer ${userToken}`
                }
            })

            if(response.status === 200){
                setisOpenConfirmDelete(null);
                fetchUsersList();
            } 

        } catch(error) {
            const { status, data } = error.response;

            if(status === 404){
                setAlertMessage({...alertMessage, type : "error", message : data.message})
            } else {
                setAlertMessage({...alertMessage, type : "error", message : "Une erreur est survenue durant la suppression de l'utilisateur."})
            }
        } finally {
            setIsLoadingUserDelete(false);
        }
    }

    return ( 
        <div id="users-tab" onClick={() => isOpenconfirmDelete !== false && closeDelete()}>
            
            <Table
                thead={titleCol}>
                    { isLoadingUsersList 
                        ? (
                            <tr>
                                <td colSpan={8}>
                                    <SpinLoader className="loading-user-list"/>
                                </td>
                            </tr>
                            
                        ) : usersList && usersList.length > 0 

                        ? (
                            usersList.map((user, index) => (
                                <tr key={user.id} onClick={() => openModal(user)}>
                                    <td className="data-lastname" data-label="Nom">
                                        {user.last_name}
                                    </td>
                                    <td className="data-firstname" data-label="Prénom">
                                        {user.first_name}
                                    </td>
                                    <td className="data-email" data-label="Email">
                                        {user.email}
                                    </td>
                                    <td className="data-role" data-label="Rôle">
                                        {user.role}
                                    </td>
                                    <td className="data-phone" data-label="Téléphone">
                                        {user.phone}
                                    </td>
                                    <td className="data-region" data-label="Région">
                                        {user.region}
                                    </td>
                                    <td className="data-create" data-label="Inscrit le">
                                        {dateShort(user.created_at)}
                                    </td>
                                    <td className="data-actions" data-label="Action">
                                        {isOpenconfirmDelete === index
                                        ?   
                                            <div className="confirm-delete-user">
                                                {alertMessage.message 
                                                    && alertMessage.type === "error" 
                                                        ? <AlertMessage type="error">{alertMessage.message}</AlertMessage>
                                                        : <p>Supprimer l'utilisateur ?</p>
                                                }
                                                <div>
                                                    <Button className="confirm-yes" onClick={(e) => {deleteUser(user.id), e.stopPropagation()}}>
                                                        {isLoadingUserDelete
                                                            ? <SpinLoader/>
                                                            : "Oui"
                                                        }
                                                    </Button>
                                                    <Button className="confirm-no" onClick={(e) => {closeDelete(); e.stopPropagation()}}>Non</Button>
                                                </div>
                                            </div>
                                        : 
                                            <div className="btn-wrapper-user">
                                                <Button className="btn button-delete-user" onClick={(e) => {confirmDelete(index); e.stopPropagation()}}>
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </Button>
                                                <Button className="btn button-show-user">
                                                    <FontAwesomeIcon icon={faEye} />
                                                </Button>
                                            </div>
                                        }
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8}>
                                    {errorMessage 
                                    ? errorMessage
                                        : usersList && usersList.length === 0 
                                            ? "Aucun utilisateur n'est inscrit actuellement."
                                                : null}
                                </td>
                            </tr>
                        )
                    }
            </Table>

            {isModalOpen && (
                <ModalUser
                    isModalOpen={isModalOpen}
                    closeModal={closeModal} 
                    selectedUser={selectedUser}
                />
                )
            }
        </div>
    );
}

export default UsersTab;