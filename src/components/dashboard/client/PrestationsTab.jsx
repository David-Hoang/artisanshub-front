import './PrestationsTab.scss';
import { useState, useContext, useEffect } from 'react';
import axios from "axios";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGears, faFileLines, faEuroSign, faCalendar, faUserCheck, faPhone, faEnvelope, faHourglassHalf, faClock, faListCheck, faCaretRight, faBolt, faXmark } from '@fortawesome/free-solid-svg-icons'

import { AuthContext } from "../../../context/AuthContext";
import Button from "../../ui/Button";
import Badge from "../../ui/Badge";
import Modal from "../../ui/Modal";
import SpinLoader from "../../ui/SpinLoader";

import DefaultCraftsman from '../../../assets/img/default-craftsman.svg'

function PrestationsTab() {

    const apiBase = import.meta.env.VITE_MAIN_API_URI;
    const { userToken } = useContext(AuthContext);

    const [userPrestations, setUserPrestations] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPrestation, setSelectedPrestation] = useState(null);

    const fetchUserPrestations = async () => { 
        try {
            const response = await axios.get(`${apiBase}/api/prestations`, {
                    headers: {
                        "Authorization": "Bearer " + userToken,
                    }
                })
            setUserPrestations(response.data);
            console.log(response.data);
            
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchUserPrestations();
    }, []);

    const openModal = (prestation) => {
        setSelectedPrestation(prestation)
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setSelectedPrestation(null)
        setIsModalOpen(false);
    }

    return ( 
        <div className="prestations-tab-client">
                {userPrestations ? 
                    <>
                        { userPrestations.map(pres => (
                                <article key={pres.id} className="prestation-card">
                                    <div className="wrapper">
                                        <div className="prestation-header">
                                            <h3 className="prestation-title">{pres.title.charAt(0).toUpperCase() + pres.title.slice(1)}</h3>
                                            <p className="craftsman-name">Artisan : {pres.craftsman?.user?.last_name} {pres.craftsman?.user?.first_name}</p>
                                        </div>

                                        {pres.state === "await-craftsman" && <Badge color="pending">En attente artisan</Badge> }
                                        {pres.state === "await-client" && <Badge color="pending">En attente client</Badge> }
                                        {pres.state === "confirmed" && <Badge color="info">Prestation confirmé</Badge> }
                                        {pres.state === "completed" && <Badge color="success">Prestation complété</Badge> }
                                        {pres.state === "refused-by-client" && <Badge color="danger">Refusé par le client</Badge> }
                                        {pres.state === "refused-by-craftsman" && <Badge color="danger">Refusé par l'artisan</Badge> }
                                    </div>
                                    <p className="prestation-date">Date de demande : {pres.created_at}</p>

                                    <Button className="btn-primary" onClick={() => openModal(pres)}>Voir les détails</Button>
                                </article>
                            ))
                        }
                        { isModalOpen &&
                            <Modal isOpen={isModalOpen} closeModal={closeModal} className="prestation-details">
                                {selectedPrestation ? 
                                    <>
                                        <div className="modal-header">
                                            <div className="icon-bg">
                                                <FontAwesomeIcon icon={faGears} />
                                            </div>
                                            <div className="modal-title">
                                                <h3>{selectedPrestation.title.charAt(0).toUpperCase() + selectedPrestation.title.slice(1)}</h3>
                                                <h4>Détails de la prestation</h4>
                                            </div>
                                        </div>
                                        <div className="modal-main">

                                            <div className="modal-client-prestation">

                                                <div className="resume-client-prestation">
                                                    <div className="wrapper">
                                                        <div className="icon">
                                                            <FontAwesomeIcon icon={faFileLines} />
                                                        </div>
                                                        <h3>Aperçu du projet</h3>
                                                    </div>

                                                    <div className="description-client-prestation">
                                                        <p>Description</p>
                                                        {selectedPrestation.description && 
                                                            <p>{selectedPrestation.description}</p>
                                                        }
                                                    </div>

                                                    <div className="craftsman-suggestion-prestation">

                                                        <div className="price-card">
                                                            <div className="icon">
                                                                <FontAwesomeIcon icon={faEuroSign} />
                                                            </div>
                                                            <div className="suggestion-content">
                                                                <p className="suggestion-title">Prix proposé par l'artisan</p>
                                                                <p className={`suggestion ${selectedPrestation.price ? 'price': ''}`}>
                                                                    {selectedPrestation.price ?
                                                                        selectedPrestation.price + ' €'
                                                                    : "Tarif non défini"}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="date-card">
                                                            <div className="icon">
                                                                <FontAwesomeIcon icon={faCalendar} />
                                                            </div>
                                                            <div className="suggestion-content">
                                                                <p className="suggestion-title">Date proposé par l'artisan</p>
                                                                <p className="suggestion-date">
                                                                    {selectedPrestation.date ?
                                                                        selectedPrestation.date
                                                                    : "Date non définie"}
                                                                </p>
                                                            </div>
                                                        </div>

                                                    </div>

                                                </div>
                                                
                                                <div className="state-prestation">
                                                    <div className="wrapper">
                                                        <div className="icon">
                                                            <FontAwesomeIcon icon={faHourglassHalf} />
                                                        </div>
                                                        <h3>État du projet</h3>
                                                    </div>
                                                    
                                                    <div className="wrapper-card">

                                                        <div className="state-card card pending">
                                                            <div className="icon">
                                                                <FontAwesomeIcon icon={faClock} /> 
                                                            </div>
                                                            <div className="state-content">
                                                                <h4>
                                                                    En attente de l'artisan
                                                                </h4>
                                                                <p className="state-description">L'artisan doit examiner et répondre à votre demande</p>
                                                            </div>
                                                        </div>

                                                        <div className="info-card card">
                                                            <div className="icon">
                                                                <FontAwesomeIcon icon={faListCheck} />
                                                            </div>
                                                            <div className="info-content">
                                                                <h4>
                                                                    Prochaines étapes
                                                                </h4>
                                                                <ul className="info-list">
                                                                    <li><FontAwesomeIcon icon={faCaretRight} /> L'artisan va examiner votre demande</li>
                                                                    <li><FontAwesomeIcon icon={faCaretRight} /> Il pourra refuser ou accepter</li>
                                                                    <li><FontAwesomeIcon icon={faCaretRight} /> Vous pourriez acepter ou non sa proposition</li>
                                                                </ul>
                                                            </div>
                                                        </div>

                                                        <div className="creating-prestation-date">
                                                            <div className="created-card">
                                                                <p>Créer le </p>
                                                                <p>{selectedPrestation.created_at}</p>
                                                            </div>
                                                            <div className="updated-card">
                                                                <p>Mis à jour le</p>
                                                                <p>{selectedPrestation.updated_at}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                            
                                            <aside>
                                                <div className="modal-craftsman-info">
                                                    <div className="wrapper">
                                                        <div className="icon">
                                                            <FontAwesomeIcon icon={faUserCheck} />
                                                        </div>
                                                        <h3>Artisan désigné</h3>
                                                    </div>

                                                    <div className="craftsman-infos">
                                                        <div className="wrapper">
                                                            <div className="craftsman-picture">
                                                                <img src={selectedPrestation.craftsman?.user?.profile_img?.img_path ? `${apiBase}/storage/${selectedPrestation.craftsman.user.profile_img.img_path}` : DefaultCraftsman}
                                                                    alt={selectedPrestation.craftsman?.user?.profile_img?.img_title ? selectedPrestation.craftsman?.user?.profile_img?.img_title : ''}
                                                                />
                                                            </div>
                                                            <div className="craftsman-name-job">
                                                                <h4>{selectedPrestation.craftsman.user.last_name.charAt(0).toUpperCase() + selectedPrestation.craftsman.user.last_name.slice(1)}
                                                                    {' '}
                                                                    {selectedPrestation.craftsman.user.first_name.charAt(0).toUpperCase() + selectedPrestation.craftsman.user.first_name.slice(1)}</h4>
                                                                <p className="job">Expertise : {selectedPrestation.craftsman.job.name}</p>
                                                            </div>
                                                        </div>

                                                        <div className="craftsman-pricing card">
                                                            <p>Tarif horaire</p>
                                                            <p className={`craftsman-infos ${selectedPrestation.craftsman?.price ? 'price' : ''}`}>
                                                                {selectedPrestation.craftsman?.price ? `${selectedPrestation.craftsman?.price} €/h` : "Tarif non renseigné"}
                                                            </p>
                                                        </div>

                                                        <div className="craftsman-available card">
                                                            <p>Disponibilité</p>
                                                            <div className="wrapper">
                                                                <div className={selectedPrestation.craftsman?.available ? 'available' : 'not-available'}></div>
                                                                <p>{selectedPrestation.craftsman?.available ? 'Disponible' : 'Non disponible'}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="craftsman-contact">
                                                        <div className="contact-wrapper">
                                                            <a href="#" className="contact craftsman-phone">
                                                                <FontAwesomeIcon icon={faPhone} />
                                                            </a>
                                                            <p>{selectedPrestation.craftsman?.user?.phone}</p>
                                                        </div>

                                                        <div className="contact-wrapper">
                                                            <a href="#" className="contact craftsman-email">
                                                                <FontAwesomeIcon icon={faEnvelope} />
                                                            </a>
                                                            <p>{selectedPrestation.craftsman?.user?.email}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="actions-btn">
                                                    <div className="wrapper">
                                                        <div className="icon">
                                                            <FontAwesomeIcon icon={faBolt} />
                                                        </div>
                                                        <h3>Actions</h3>
                                                    </div>
                                                    <div className="info-card card">
                                                        {selectedPrestation.state === "await-craftsman" && 
                                                            <Button className="action-cancel">
                                                                <FontAwesomeIcon icon={faXmark} />
                                                                Annuler la demande
                                                            </Button>
                                                        }
                                                        {selectedPrestation.state === "await-client" && 
                                                            <>
                                                                <Button className="action-accept">Accepter la proposition</Button> 
                                                                <Button className="action-refuse">Refuser la proposition</Button>
                                                            </>
                                                        }

                                                        {selectedPrestation.state === "confirmed" && 
                                                            <p></p>
                                                        }
                                                        {selectedPrestation.state === "completed" && 
                                                            <p></p>
                                                        }
                                                        {selectedPrestation.state === "refused-by-client" &&
                                                            <p></p>
                                                        }
                                                        {selectedPrestation.state === "refused-by-craftsman" &&
                                                            <p></p>
                                                        }

                                                        <Button className="btn-primary" onClick={closeModal}>Fermer</Button>
                                                    </div>
                                                </div>
                                            </aside>

                                        </div>
                                    </>
                                    : <SpinLoader/>
                                }
                            </Modal>
                        }
                    </>
                    : <p>Vous n'avez pas de prestations en cours.</p>
                }
        </div>
    );
}

export default PrestationsTab;