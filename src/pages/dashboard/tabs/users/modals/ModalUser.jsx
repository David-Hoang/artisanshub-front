import "./ModalUser.scss";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../../../../context/AuthContext";

import { firstCapitalize, dateShortTime } from "../../../../../utils/Helpers";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLocationDot, faAddressBook, faPhone, faEnvelope, faSliders, faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons';

import DefaultClient from "../../../../../assets/img/default-client.svg";
import DefaultCraftsman from "../../../../../assets/img/default-craftsman.svg";

import Modal from "../../../../../components/ui/Modal";
import SpinLoader from "../../../../../components/ui/SpinLoader";
import Badge from "../../../../../components/ui/Badge";
import Button from "../../../../../components/ui/Button";

function ModalUser({ isModalOpen, closeModal, selectedUser }) {
    
    const apiBase = import.meta.env.VITE_MAIN_API_URI;
    const [isLoadingDetailsUser, setIsLoadingDetailsUser] = useState(false);
    const [selectedUserDetails, setSelectedUserDetails] = useState(null);
    const { userToken } = useContext(AuthContext);

    const fetchSelectedDetailsUser = async () => {
        setIsLoadingDetailsUser(true);
        try {
            const response = await axios.get(`${apiBase}/api/admin/user/${selectedUser.id}`, {
                    headers: {
                        "Authorization": "Bearer " + userToken,
                    }
                })
            
                const { data } = response;

                if(response.status === 200) 
                    setSelectedUserDetails({
                ...data, 
                defaultImage : data.role === "client" 
                    ?  DefaultClient 
                    : data.role === "craftsman" 
                        ? DefaultCraftsman 
                        : DefaultClient});
            
        } catch (error) {
            
        } finally {
            setIsLoadingDetailsUser(false);
        }
    }

    useEffect(() => {
        fetchSelectedDetailsUser()
    }, []);
    
    return ( 
        <Modal isOpen={isModalOpen} closeModal={closeModal} className="details-user">
            {isLoadingDetailsUser
                ? <SpinLoader className="loading-user"/>
                : selectedUserDetails &&
                    <>
                        <div className="modal-header">
                            <div className="image-container">
                                <img className="image-user" 
                                    src={ selectedUserDetails.profile_img?.img_path ? `${apiBase}/storage/${selectedUserDetails.profile_img?.img_path}` : selectedUserDetails.defaultImage} 
                                    alt={ selectedUserDetails.profile_img?.img_title }
                                    />
                            </div>
                            <div className="user-name-role">
                                <h4 className="user-name">{firstCapitalize(selectedUserDetails.first_name)} {firstCapitalize(selectedUserDetails.last_name)}</h4>
                                <Badge color="info">{ selectedUserDetails.role === "client" ? 'Client' : selectedUserDetails.role === "craftsman" ? 'Artisan' : 'Inconnu'}</Badge>
                            </div>
                        </div>
                        <div className="modal-main">
                            {/* User infos */}
                            <div className="user-card user-name">

                                <div className="wrapper">
                                    <div className="icon">
                                        <FontAwesomeIcon icon={faUser} className="icon-user"/>
                                    </div>
                                    <h3>Informations personnelles</h3>
                                </div>

                                <div className="content-user">
                                    <div>
                                        <p className="label">Nom</p>
                                        <p>{ selectedUserDetails.first_name }</p>
                                    </div>
                                    <div>
                                        <p className="label">Prénom</p>
                                        <p>{ selectedUserDetails.last_name }</p>
                                    </div>
                                    <div>
                                        <p>Role</p>
                                        <Badge color="info">
                                            { selectedUserDetails.client 
                                                ? 'Client' 
                                                    : selectedUserDetails.craftsman 
                                                        ? 'Artisan' 
                                                            : 'Inconnu'
                                            }
                                        </Badge>
                                    </div>
                                </div>
                
                            </div>
                            
                            {/* User contact */}
                            <div className="user-card user-contact">

                                <div className="wrapper">
                                    <div className="icon">
                                        <FontAwesomeIcon icon={faAddressBook} className="icon-address"/>
                                    </div>
                                    <h3>Contact</h3>
                                </div>

                                <div className="content-contact">
                                    <div>
                                        <a href={`mailto:${selectedUserDetails.email}`} className="phone">
                                            <FontAwesomeIcon icon={faEnvelope} />
                                        </a>
                                        <p>{ selectedUserDetails.email }</p>
                                    </div>
                                    <div>
                                        <a href={`tel:+${selectedUserDetails.phone}`} className="email">
                                            <FontAwesomeIcon icon={faPhone} />
                                        </a>
                                        <p>{ selectedUserDetails.phone }</p>
                                    </div>
                                </div>

                            </div>
                                        
                            {/* Craftsman infos */}
                            {selectedUserDetails.role === "craftsman" &&
                                <div className="user-card craftsman-infos">

                                    <div className="wrapper">
                                        <div className="icon">
                                            <FontAwesomeIcon icon={faScrewdriverWrench} className="icon-craftsman"/>
                                        </div>
                                        <h3>Informations artisan</h3>
                                    </div>

                                    <div className="content-craftsman-infos">
                                        <div className="wrapper-infos">
                                            <div>
                                                <p className="label">Identifiant artisan</p>
                                                <p>#{selectedUserDetails.craftsman?.id}</p>
                                            </div>
                                            <div>
                                                <p className="label">Prix</p>
                                                <p>{selectedUserDetails.craftsman?.price ? `${selectedUserDetails.craftsman.price} €/h` : "Non renseigné"}</p>
                                            </div>
                                            <div>
                                                <p className="label">Disponibilité</p>
                                                <p>
                                                    {selectedUserDetails.craftsman?.available === true 
                                                    ? (<>
                                                            <span></span> Oui
                                                        </>
                                                    ) : ( <>
                                                            <span></span> Non
                                                        </>
                                                    )}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="label">Activité</p>
                                                <p>{selectedUserDetails.craftsman?.job?.name ?? "Non renseigné"}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="label">Description</p>
                                            <p>{selectedUserDetails.craftsman?.description ? selectedUserDetails.craftsman.description : "Non renseigné"}</p>
                                        </div>

                                    </div>
                                </div>
                            }

                            {/* User location */}
                            <div className="user-card user-location">
                                <div className="wrapper">
                                    <div className="icon">
                                        <FontAwesomeIcon icon={faLocationDot} className="icon-location"/>
                                    </div>
                                    <h3>Localisation</h3>
                                </div>

                                <div className="content-location">

                                    <div className="wrapper-city-zip">
                                        <div>
                                            <p className="label">Ville</p>
                                            <p>{ selectedUserDetails.city ?? "Non renseigné" }</p>
                                        </div>
                                        <div>
                                            <p className="label">Code postal</p>
                                            <p>{ selectedUserDetails.zipcode ?? "Non renseigné" }</p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="label">Région</p>
                                        <p>{ selectedUserDetails.region ?? "Non renseigné" }</p>
                                    </div>
                                    
                                    { selectedUserDetails.client &&
                                        <div>
                                            <p className="label">Adresse complète</p>
                                            <p>{ selectedUserDetails.client.full_address ?? "Non renseigné" }</p>
                                        </div>
                                    }
                                </div>
                            </div>
                            
                            {/* User account */}
                            <div className="user-card user-account">
                                <div className="wrapper">
                                    <div className="icon">
                                        <FontAwesomeIcon icon={faSliders} className="icon-account"/>
                                    </div>
                                    <h3>Informations compte</h3>
                                </div>
                                <div className="content-account">
                                    <div>
                                        <p className="label">Identifiant utilisateur</p>
                                        <p>#{selectedUserDetails.id}</p>
                                    </div>

                                    <div>
                                        <p className="label">Créer le :</p>
                                        <p>{ dateShortTime(selectedUserDetails.created_at) }</p>
                                    </div>

                                    <div>
                                        <p className="label">Dernière modification le :</p>
                                        <p>{ dateShortTime(selectedUserDetails.updated_at) }</p>
                                    </div>
                                
                                </div>
                            </div>
                        </div>
                        <div className="btn-wrapper">
                            <Button type="button" className="btn btn-primary"
                                onClick={() => closeModal()}>
                                Fermer
                            </Button>
                        </div>
                    </>
                }
        </Modal>
    );
}

export default ModalUser;