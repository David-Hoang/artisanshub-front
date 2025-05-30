import './PrestationsTab.scss';
import { useState, useContext, useEffect } from 'react';
import axios from "axios";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGears, faFileLines, faEuroSign, faCalendar, faUserCheck, faPhone, faEnvelope, faHourglassHalf, faListCheck, faCaretRight, faBolt, faUserClock, faCheck, faUserXmark } from '@fortawesome/free-solid-svg-icons'

import { AuthContext } from "../../../context/AuthContext";
import { dateLong, dateShort, firstCapitalize, dateFull } from "../../../utils/Helpers";
import Button from "../../ui/Button";
import Badge from "../../ui/Badge";
import Modal from "../../ui/Modal";
import SpinLoader from "../../ui/SpinLoader";
import AlertMessage from "../../AlertMessage";

import DefaultCraftsman from '../../../assets/img/default-craftsman.svg'

function PrestationsTab() {

    const apiBase = import.meta.env.VITE_MAIN_API_URI;
    const { userToken } = useContext(AuthContext);

    const [userPrestations, setUserPrestations] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPrestation, setSelectedPrestation] = useState(null);

    const defaultAlertMessage = {type : "", message : ""};
    const [alertMessage, setAlertMessage] = useState(defaultAlertMessage);
    
    const [isLoadingPrestations, setIsLoadingPrestations] = useState(false);
    const [isLoadingConfirm, setIsLoadingConfirm] = useState(false);
    const [isLoadingCancel, setIsLoadingCancel] = useState(false);
    
    const fetchUserPrestations = async () => { 

        setIsLoadingPrestations(true)

        try {
            const response = await axios.get(`${apiBase}/api/prestations`, {
                    headers: {
                        "Authorization": "Bearer " + userToken,
                    }
                })
            setUserPrestations(response.data);
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoadingPrestations(false)
        }
    }

    useEffect(() => {
        fetchUserPrestations();
    }, []);

    const fetchDetailPrestation = async (presId) => {
        try {
            const response = await axios.get(`${apiBase}/api/prestation/${presId}`, {
                    headers: {
                        "Authorization": "Bearer " + userToken,
                    }
                })
            setSelectedPrestation(response.data);
        } catch (error) {
            console.log(error)
        }
    }

    const openModal = (presId) => {
        setAlertMessage(defaultAlertMessage);
        setIsModalOpen(true);
        fetchDetailPrestation(presId);
    }

    const closeModal = () => {
        setAlertMessage(defaultAlertMessage);
        setIsModalOpen(false);
        setSelectedPrestation(null);
    }

    const clientAccept = async (presId) => {
        // Empty alert message
        setAlertMessage(defaultAlertMessage);
        setIsLoadingConfirm(true);

        try {
            const response = await axios.patch(`${apiBase}/api/prestation/${presId}/accept`,
                {},
                { headers: {"Authorization": "Bearer " + userToken} 
            })

            if(response.status === 200) {
                setAlertMessage({...AlertMessage, type : "success", message : "Votre modification a bien été pris en compte."});
                fetchDetailPrestation(presId);
                fetchUserPrestations();
            }

        } catch (error) {

            const { status } = error.response;

            if(status === 403){
                setAlertMessage({...AlertMessage, type : "error", message : "Cette prestation ne vous est pas assignée ou son état ne permet pas de répondre"});

            } else if (status === 404){
                setAlertMessage({...AlertMessage, type : "error", message : "Cette prestation n'existe pas."});
            } 
            else if(status === 500){
                setAlertMessage({...AlertMessage, type : "error", message : "Une erreur est survenue lors de l'acceptation de la prestation."});
            }
        } finally {
            setIsLoadingConfirm(false);
        }
    }

    const clientRefuse = async (presId) => {
        // Empty alert message
        setAlertMessage(defaultAlertMessage);
        setIsLoadingCancel(true);

        try {
            const response = await axios.patch(`${apiBase}/api/prestation/${presId}/client-refuse`,
                {},
                { headers: {"Authorization": "Bearer " + userToken} 
            })

            if(response.status === 200) {
                setAlertMessage({...AlertMessage, type : "success", message : "Vous avez refusé la proposition."});
                fetchDetailPrestation(presId);
                fetchUserPrestations();
            }

        } catch (error) {

            const { status } = error.response;

            if(status === 403){
                setAlertMessage({...AlertMessage, type : "error", message : "Cette prestation ne vous est pas assignée ou son état ne permet pas de répondre"});

            } else if (status === 404){
                setAlertMessage({...AlertMessage, type : "error", message : "Cette prestation n'existe pas."});
            } 
            else if(status === 500){
                setAlertMessage({...AlertMessage, type : "error", message : "Une erreur est survenue lors du refus de la prestation."});
            }
        } finally {
            setIsLoadingCancel(false);
        }
    }

    return ( 
        <div className="prestations-tab-client">
            {isLoadingPrestations 
            ? <SpinLoader className="loading-list"/>
            : userPrestations && userPrestations.length > 0 
            ? 
                <>
                    { userPrestations.map(pres => (
                            <article key={pres.id} className="prestation-card">
                                <div className="wrapper">
                                    <div className="prestation-header">
                                        <h3 className="prestation-title">{firstCapitalize(pres.title)}</h3>
                                        <p className="craftsman-name">Artisan : {firstCapitalize(pres.craftsman?.user?.last_name)} {firstCapitalize(pres.craftsman?.user?.first_name)}</p>
                                    </div>

                                    {pres.state === "await-craftsman" && <Badge color="pending">En attente artisan</Badge> }
                                    {pres.state === "await-client" && <Badge color="pending">En attente client</Badge> }
                                    {pres.state === "confirmed" && <Badge color="info">Prestation confirmé</Badge> }
                                    {pres.state === "completed" && <Badge color="success">Prestation complété</Badge> }
                                    {pres.state === "refused-by-client" && <Badge color="danger">Refusé par le client</Badge> }
                                    {pres.state === "refused-by-craftsman" && <Badge color="danger">Refusé par l'artisan</Badge> }
                                </div>
                                <p className="prestation-date">Date de demande : {dateShort(pres.created_at)}</p>
                                <Button className="btn-primary" onClick={() => openModal(pres.id)}>Voir les détails</Button>
                            </article>
                        ))
                    }
                    { isModalOpen &&
                        <Modal isOpen={isModalOpen} closeModal={closeModal} className="prestation-details">
                            {selectedPrestation 
                                ? 
                                    <>
                                        <div className="modal-header">
                                            <div className="icon-bg">
                                                <FontAwesomeIcon icon={faGears}/>
                                            </div>
                                            <div className="modal-title">
                                                <h3>{firstCapitalize(selectedPrestation.title)}</h3>
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
                                                                <p className="suggestion-title">Date proposée par l'artisan</p>
                                                                <p className="suggestion-date">
                                                                    {selectedPrestation.date ?
                                                                        dateFull(selectedPrestation.date)
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
                                                        
                                                        {selectedPrestation.state === 'await-craftsman' &&
                                                            <>
                                                                <div className="state-card card pending">
                                                                    <div className="icon">
                                                                        <FontAwesomeIcon icon={faUserClock} />
                                                                    </div>
                                                                    <div className="state-content">
                                                                        <h4>
                                                                            En attente de l'artisan
                                                                        </h4>
                                                                        <p className="state-description">Votre demande est en attente de traitement par {firstCapitalize(selectedPrestation.craftsman.user.first_name)}</p>
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
                                                                            <li><FontAwesomeIcon icon={faCaretRight} /> {firstCapitalize(selectedPrestation.craftsman.user.first_name)} étudie votre demande</li>
                                                                            <li><FontAwesomeIcon icon={faCaretRight} /> Il vous fait une proposition ou la refuse</li>
                                                                            <li><FontAwesomeIcon icon={faCaretRight} /> Vous choisissez d'accepter ou non sa proposition</li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        }
                                                        
                                                        {selectedPrestation.state === 'await-client' &&
                                                            <>
                                                                <div className="state-card card pending">
                                                                    <div className="icon">
                                                                        <FontAwesomeIcon icon={faUserClock} />
                                                                    </div>
                                                                    <div className="state-content">
                                                                        <h4>
                                                                            En attente de votre réponse
                                                                        </h4>
                                                                        <p className="state-description">{firstCapitalize(selectedPrestation.craftsman.user.first_name)} vous a fait une proposition ! À vous de choisir la suite</p>
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
                                                                            <li><FontAwesomeIcon icon={faCaretRight} /> Examiner sa proposition</li>
                                                                            <li><FontAwesomeIcon icon={faCaretRight} /> Échanger avec {firstCapitalize(selectedPrestation.craftsman.user.first_name)} si vous avez des questions</li>
                                                                            <li><FontAwesomeIcon icon={faCaretRight} /> Accepter ou refuser sa proposition</li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        }
                                                        
                                                        {selectedPrestation.state === 'confirmed' &&
                                                            <>
                                                                <div className="state-card card confirmed">
                                                                    <div className="icon">
                                                                        <FontAwesomeIcon icon={faUserCheck} />
                                                                    </div>
                                                                    <div className="state-content">
                                                                        <h4>
                                                                            Proposition confirmé
                                                                        </h4>
                                                                        <p className="state-description">Vous avez confirmé la proposition de {firstCapitalize(selectedPrestation.craftsman.user.first_name)}</p>
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
                                                                            <li><FontAwesomeIcon icon={faCaretRight} /> L'artisan va vous contacter pour les travaux</li>
                                                                            <li><FontAwesomeIcon icon={faCaretRight} /> Restez disponible pour toute information</li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        }
                                                        
                                                        {selectedPrestation.state === 'completed' &&
                                                            <div className="state-card card completed">
                                                                <div className="icon">
                                                                    <FontAwesomeIcon icon={faCheck} />
                                                                </div>
                                                                <div className="state-content">
                                                                    <h4>
                                                                        Projet terminé
                                                                    </h4>
                                                                    <p className="state-description">Le projet a été achevé avec succès</p>
                                                                </div>
                                                            </div>
                                                        }
                                                        
                                                        {selectedPrestation.state === 'refused-by-client' &&
                                                            <>
                                                                <div className="state-card card refused">
                                                                    <div className="icon">
                                                                    <FontAwesomeIcon icon={faUserXmark} />
                                                                    </div>
                                                                    <div className="state-content">
                                                                        <h4>
                                                                            Refusé par vous
                                                                        </h4>
                                                                        <p className="state-description">Vous avez décliné la proposition de {firstCapitalize(selectedPrestation.craftsman.user.first_name)}</p>
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
                                                                            <li><FontAwesomeIcon icon={faCaretRight} /> Projet annulé suite à votre refus</li>
                                                                            <li><FontAwesomeIcon icon={faCaretRight} /> Vous pouvez créer une nouvelle demande</li>
                                                                            <li><FontAwesomeIcon icon={faCaretRight} /> Cherchez un autre artisan pour votre projet</li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        }
                                                        
                                                        {selectedPrestation.state === 'refused-by-craftsman' &&
                                                            <>
                                                                <div className="state-card card refused">
                                                                    <div className="icon">
                                                                        <FontAwesomeIcon icon={faUserXmark} />
                                                                    </div>
                                                                    <div className="state-content">
                                                                        <h4>
                                                                            Refusé par l'artisan
                                                                        </h4>
                                                                        <p className="state-description">Votre demande a été décliné par {firstCapitalize(selectedPrestation.craftsman.user.first_name)}</p>
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
                                                                            <li><FontAwesomeIcon icon={faCaretRight} /> L'artisan ne peut pas réaliser votre demande</li>
                                                                            <li><FontAwesomeIcon icon={faCaretRight} /> Recontacter en modifiant votre demande</li>
                                                                            <li><FontAwesomeIcon icon={faCaretRight} /> Recherchez un autre artisan</li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        }

                                                        <div className="creating-prestation-date">
                                                            <div className="created-card">
                                                                <p>Créer le </p>
                                                                <p>{dateLong(selectedPrestation.created_at)}</p>
                                                            </div>
                                                            <div className="updated-card">
                                                                <p>Mis à jour le</p>
                                                                <p>{dateFull(selectedPrestation.updated_at)}</p>
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
                                                                <h4>
                                                                    {firstCapitalize(selectedPrestation.craftsman.user.first_name)}
                                                                    {' '}
                                                                    {firstCapitalize(selectedPrestation.craftsman.user.last_name)}
                                                                </h4>
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
                                                            {selectedPrestation.craftsman?.user?.phone
                                                                ? <>
                                                                    <a href={`tel:+${selectedPrestation.craftsman.user.phone}`} className="contact craftsman-phone">
                                                                        <FontAwesomeIcon icon={faPhone} />
                                                                    </a>
                                                                    <p>{selectedPrestation.craftsman.user.phone}</p>
                                                                </>     
                                                                : <>
                                                                    <p>Non renseigné</p>
                                                                </>
                                                            }
                                                        </div>

                                                        <div className="contact-wrapper">
                                                        {selectedPrestation.craftsman?.user?.email 
                                                            ? <>
                                                                <a href={`mailto:${selectedPrestation.craftsman.user.email}`} className="contact craftsman-email">
                                                                    <FontAwesomeIcon icon={faEnvelope} />
                                                                </a>
                                                                <p>{selectedPrestation.craftsman.user.email}</p>
                                                            </>
                                                            : <>
                                                                <p>Non renseigné</p>
                                                            </>
                                                        }
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
                                                            <p className="prestation-info pending">En attente de la réponse de l'artisan&nbsp;...</p>
                                                        }
                                                        {selectedPrestation.state === "await-client" && 
                                                            <>
                                                                <Button className="action-accept" onClick={() => clientAccept(selectedPrestation.id)}> 
                                                                    {isLoadingConfirm ? (
                                                                        <SpinLoader />
                                                                    ) : (
                                                                        <>
                                                                            Accepter la proposition
                                                                        </>
                                                                    )}
                                                                </Button> 
                                                                <Button className="action-refuse" onClick={() => clientRefuse(selectedPrestation.id)}>
                                                                    {isLoadingCancel ? (
                                                                        <SpinLoader />
                                                                    ) : (
                                                                        <>
                                                                            Refuser la proposition
                                                                        </>
                                                                    )}
                                                                </Button>
                                                            </>
                                                        }

                                                        {selectedPrestation.state === "confirmed" && 
                                                            <p className="prestation-info info">Vous avez accepté la proposition, l'artisan va intervenir sous peu.</p>
                                                        }
                                                        {selectedPrestation.state === "completed" && 
                                                            <p className="prestation-info success">Votre projet est terminé succès.</p>
                                                        }
                                                        {selectedPrestation.state === "refused-by-client" &&
                                                            <p className="prestation-info cancel">Vous avez refusé la proposition.</p>
                                                        }
                                                        {selectedPrestation.state === "refused-by-craftsman" &&
                                                            <p className="prestation-info cancel">L'artisan a refusé votre demande.</p>
                                                        }

                                                        <Button className="btn-primary" onClick={closeModal}>Fermer</Button>
                                                        {alertMessage && alertMessage.type === "success" && <AlertMessage type="success">{alertMessage.message}</AlertMessage>}
                                                        {alertMessage && alertMessage.type === "error" && <AlertMessage type="error">{alertMessage.message}</AlertMessage>}
                                                    </div>
                                                </div>
                                            </aside>

                                        </div>
                                    </>
                                :   
                                    <SpinLoader/>
                            }
                        </Modal>
                    }
                </>
            : <p>Vous n'avez actuellement aucune prestation.</p>
            }
        </div>
    );
}

export default PrestationsTab;