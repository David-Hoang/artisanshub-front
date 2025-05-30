import './PrestationsTab.scss';
import { useState, useContext, useEffect } from 'react';
import axios from "axios";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGears, faFileLines, faEuroSign, faCalendar, faUserCheck, faPhone, faEnvelope, faHourglassHalf, faListCheck, faCaretRight, faBolt, faUserClock, faLocationDot, faCheck, faUserXmark, faFileInvoice } from '@fortawesome/free-solid-svg-icons'

import { AuthContext } from "../../../context/AuthContext";
import { dateLong, dateShort, firstCapitalize, dateFull } from "../../../utils/Helpers";
import Button from "../../ui/Button";
import Badge from "../../ui/Badge";
import Modal from "../../ui/Modal";
import SpinLoader from "../../ui/SpinLoader";
import AlertMessage from "../../AlertMessage";
import Input from "../../ui/Input";

import DefaultClient from '../../../assets/img/default-client.svg'

function PrestationsTab() {

    const apiBase = import.meta.env.VITE_MAIN_API_URI;
    const { userToken } = useContext(AuthContext);

    const [userPrestations, setUserPrestations] = useState(null);
    const [isLoadingPrestations, setIsLoadingPrestations] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const defaultAlertMessage = {type : "", message : ""};
    const [alertMessage, setAlertMessage] = useState(defaultAlertMessage);

    const [selectedPrestation, setSelectedPrestation] = useState(null);

    const defaultQuoteForm = {
        price : "",
        date : ""
    }
    const [quoteForm, setQuoteForm] = useState(defaultQuoteForm);

    const [isLoadingConfirm, setIsLoadingConfirm] = useState(false);
    const [isLoadingCancel, setIsLoadingCancel] = useState(false);

    const defaultQuoteError = {
        price : "",
        date : ""
    }
    const [quoteErrorForm, setQuoteErrorForm] = useState(defaultQuoteError);

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
            console.log(response.data);
            
        } catch (error) {
            console.log(error)
        }
    }

    const openModal = (presId) => {
        setAlertMessage(defaultAlertMessage);
        setQuoteErrorForm(defaultQuoteError);
        setIsModalOpen(true);
        fetchDetailPrestation(presId);
    }

    const closeModal = () => {
        setAlertMessage(defaultAlertMessage);
        setQuoteErrorForm(defaultQuoteError);
        setIsModalOpen(false);
        setSelectedPrestation(null);
    }
    
    const craftsmanAccept = async (presId) => {
         // Empty alert message
        setAlertMessage(defaultAlertMessage);
        setQuoteErrorForm(defaultQuoteError);
        setIsLoadingConfirm(true);
        
        //Validation : Get userPasswordForm and return object of error if no value in input
        const validateQuoteInputs = Object.entries(quoteForm).reduce((acc, [key, value]) => {

            if (!value) {
                switch (key) {
                    case "price":
                        acc[key] = "Veuillez renseigner un prix.";
                        break;
                    case "date":
                        acc[key] = "Veuillez renseigner une date.";
                        break;
                    default:
                        break;
                }
            }else if (key === "date"){
                 const currentDateTime = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, -8);
                if (value < currentDateTime) {
                    acc[key] = "La date ne peut pas être antérieure à aujourd'hui.";
                }
            }
            return acc;
        }, {});

        // Check if there is at least 1 error
        if(Object.keys(validateQuoteInputs).length > 0){
            setQuoteErrorForm(validateQuoteInputs);
            setIsLoadingConfirm(false);
            return;
        }
        try {

            const response = await axios.patch(`${apiBase}/api/prestation/${presId}/quote`,
                quoteForm,
                { headers: {"Authorization": "Bearer " + userToken} 
            })

            if(response.status === 200) {
                setAlertMessage({...AlertMessage, type : "success", message : "Votre proposition a été transmise au client."});
                fetchDetailPrestation(presId);
                fetchUserPrestations();
            }

        } catch (error) {
            
            const { status } = error.response;

            if(status === 401){
                if(localStorage.getItem("artisansHubUserToken")){
                    localStorage.removeItem("artisansHubUserToken");
                }
                window.location.href = '/connexion';
            } else if(status === 403) {
                setAlertMessage({...AlertMessage, type : "error", message : "Cette prestation ne vous est pas assignée ou son état ne permet pas de répondre"});
            } else if (status === 404) {
                setAlertMessage({...AlertMessage, type : "error", message : "Cette prestation n'existe pas."});
            } 
            else if(status === 500) {
                setAlertMessage({...AlertMessage, type : "error", message : "Une erreur est survenue lors de l'acceptation de la prestation."});
            }
        } finally {
            setIsLoadingConfirm(false);
        }
    }

    const craftsmanRefuse = async (presId) => {
        // Empty alert message
        setAlertMessage(defaultAlertMessage);
        setIsLoadingCancel(true);

        try {
            const response = await axios.patch(`${apiBase}/api/prestation/${presId}/craftsman-refuse`,
                {},
                { headers: {"Authorization": "Bearer " + userToken} 
            })

            if(response.status === 200) {
                setAlertMessage({...AlertMessage, type : "success", message : "La demande a bien été refusée."});
                fetchDetailPrestation(presId);
                fetchUserPrestations();
            }

        } catch (error) {

            const { status } = error.response;

            if(status === 401){
                if(localStorage.getItem("artisansHubUserToken")){
                    localStorage.removeItem("artisansHubUserToken");
                }
                window.location.href = '/connexion';
            } else if(status === 403) {
                setAlertMessage({...AlertMessage, type : "error", message : "Cette prestation ne vous est pas assignée ou son état ne permet pas de répondre"});
            } else if (status === 404) {
                setAlertMessage({...AlertMessage, type : "error", message : "Cette prestation n'existe pas."});
            } 
            else if(status === 500) {
                setAlertMessage({...AlertMessage, type : "error", message : "Une erreur est survenue lors du refus de la demande la prestation."});
            }
        } finally {
            setIsLoadingCancel(false);
        }
    }
    
    const craftsmanComplete = async (presId) => {

        // Empty alert message
        setAlertMessage(defaultAlertMessage);
        setIsLoadingCancel(true);
        try {
            const response = await axios.patch(`${apiBase}/api/prestation/${presId}/completed`,
                {},
                { headers: {"Authorization": "Bearer " + userToken} 
            })

            if(response.status === 200) {
                setAlertMessage({...AlertMessage, type : "success", message : "La prestation a été clôturée avec succès."});
                fetchDetailPrestation(presId);
                fetchUserPrestations();
            }

        } catch (error) {

            const { status } = error.response;

            if(status === 401){
                if(localStorage.getItem("artisansHubUserToken")){
                    localStorage.removeItem("artisansHubUserToken");
                }
                window.location.href = '/connexion';
            } else if(status === 403) {
                setAlertMessage({...AlertMessage, type : "error", message : "Cette prestation ne vous est pas assignée ou son état ne permet pas de répondre"});
            } else if (status === 404) {
                setAlertMessage({...AlertMessage, type : "error", message : "Cette prestation n'existe pas."});
            } 
            else if(status === 500) {
                setAlertMessage({...AlertMessage, type : "error", message : "Une erreur est survenue lors de la clôture de la prestation."});
            }
        } finally {
            setIsLoadingCancel(false);
        }
    }

    return ( 
        <div className="prestations-tab-craftsman">
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
                                        <p className="client-name">Client : {firstCapitalize(pres.client?.user?.last_name)} {firstCapitalize(pres.client?.user?.first_name)}</p>
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
                                                                {!selectedPrestation.price && <p className="suggestion-title">Prix en attente de votre part</p>}

                                                                {selectedPrestation.price && 
                                                                    <>
                                                                        <p className="suggestion-title">Montant proposé</p>
                                                                        <p className="suggestion price">{selectedPrestation.price} €</p>
                                                                    </>
                                                                }
                                                            </div>
                                                        </div>

                                                        <div className="date-card">
                                                            <div className="icon">
                                                                <FontAwesomeIcon icon={faCalendar} />
                                                            </div>
                                                            <div className="suggestion-content">
                                                                {!selectedPrestation.date && <p className="suggestion-title">Date en attente de votre part</p>}
                                                                
                                                                {selectedPrestation.date && 
                                                                    <>
                                                                        <p className="suggestion-title">Date proposé</p>
                                                                        <p className="suggestion-date">
                                                                            {dateFull(selectedPrestation.date)}
                                                                        </p>
                                                                    </>
                                                                }
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
                                                                            Vous avez une nouvelle demande de la part d'un client
                                                                        </h4>
                                                                        <p className="state-description">{firstCapitalize(selectedPrestation.client.user.first_name)} attend une proposition de votre part</p>
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
                                                                            <li><FontAwesomeIcon icon={faCaretRight} /> Étudiez la demande de {firstCapitalize(selectedPrestation.client.user.first_name)} puis répondez</li>
                                                                            <li><FontAwesomeIcon icon={faCaretRight} /> Soumettez votre proposition à {firstCapitalize(selectedPrestation.client.user.first_name)}</li>
                                                                            <li><FontAwesomeIcon icon={faCaretRight} /> {firstCapitalize(selectedPrestation.client.user.first_name)} acceptera ou déclinera votre proposition</li>
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
                                                                            En attente du client
                                                                        </h4>
                                                                        <p className="state-description">Vous avez envoyé une proposition à {firstCapitalize(selectedPrestation.client.user.first_name)}, attendez sa réponse</p>
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
                                                                            <li><FontAwesomeIcon icon={faCaretRight} /> Attendez la décision concernant votre proposition</li>
                                                                            <li><FontAwesomeIcon icon={faCaretRight} /> {firstCapitalize(selectedPrestation.client.user.first_name)} pourrait accepter ou décliner la proposition</li>
                                                                            <li><FontAwesomeIcon icon={faCaretRight} /> Restez disponible en cas de question ou d'échange</li>
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
                                                                            Proposition accepté
                                                                        </h4>
                                                                        <p className="state-description">{firstCapitalize(selectedPrestation.client.user.first_name)} a accepté votre proposition</p>
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
                                                                            <li><FontAwesomeIcon icon={faCaretRight} /> Prenez contact avec {firstCapitalize(selectedPrestation.client.user.first_name)} pour convenir des modalités</li>
                                                                            <li><FontAwesomeIcon icon={faCaretRight} /> Effectuez l'intervention chez {firstCapitalize(selectedPrestation.client.user.first_name)} à la date convenue</li>
                                                                            <li><FontAwesomeIcon icon={faCaretRight} /> Mettez à jour le statut du projet une fois les travaux terminés</li>
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
                                                                            Refusé par le client
                                                                        </h4>
                                                                        <p className="state-description">Votre proposition a été décliné par {firstCapitalize(selectedPrestation.client.user.first_name)}</p>
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
                                                                            <li><FontAwesomeIcon icon={faCaretRight} /> Mettez à jour votre disponibilité pour faciliter de futurs contacts</li>
                                                                            <li><FontAwesomeIcon icon={faCaretRight} /> Cette demande reste archivé dans votre espace</li>
                                                                            <li><FontAwesomeIcon icon={faCaretRight} /> Restez attentif, peut etre que {firstCapitalize(selectedPrestation.client.user.first_name)} vous sollictera à l'avenir</li>
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
                                                                            Refusé par vous
                                                                        </h4>
                                                                        <p className="state-description">Vous avez décliné la demande de {firstCapitalize(selectedPrestation.client.user.first_name)}</p>
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
                                                                            <li><FontAwesomeIcon icon={faCaretRight} /> {firstCapitalize(selectedPrestation.client.user.first_name)} est informé de votre décision</li>
                                                                            <li><FontAwesomeIcon icon={faCaretRight} /> Cette demande reste archivé dans votre espace</li>
                                                                            <li><FontAwesomeIcon icon={faCaretRight} /> Restez disponible si {firstCapitalize(selectedPrestation.client.user.first_name)} souhaite reprendre contact à l'avenir</li>
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
                                                <div className="modal-client-info">
                                                    <div className="wrapper">
                                                        <div className="icon">
                                                            <FontAwesomeIcon icon={faUserCheck} />
                                                        </div>
                                                        <h3>Informations client</h3>
                                                    </div>

                                                    <div className="client-infos">
                                                        <div className="wrapper">
                                                            <div className="client-picture">
                                                                <img src={selectedPrestation.client?.user?.profile_img?.img_path ? `${apiBase}/storage/${selectedPrestation.client.user.profile_img.img_path}` : DefaultClient}
                                                                    alt={selectedPrestation.client?.user?.profile_img?.img_title ? selectedPrestation.client?.user?.profile_img?.img_title : ''}
                                                                />
                                                            </div>
                                                            <h4 className="client-name">
                                                                {firstCapitalize(selectedPrestation.client.user.first_name)}
                                                                {' '}
                                                                {firstCapitalize(selectedPrestation.client.user.last_name)}
                                                            </h4>
                                                        </div>
                                                    </div>

                                                    <div className="client-contact">
                                                        <div className="contact-wrapper">
                                                            {selectedPrestation.client?.full_address
                                                                ? <>
                                                                    <div className="contact client-address">
                                                                        <FontAwesomeIcon icon={faLocationDot} />
                                                                    </div>
                                                                    <p>{selectedPrestation.client.full_address}</p>
                                                                </>     
                                                                : <>
                                                                    <p>Non renseigné</p>
                                                                </>
                                                            }
                                                        </div>
                                                        
                                                        <div className="contact-wrapper">
                                                            {selectedPrestation.client?.user?.phone
                                                                ? <>
                                                                    <a href={`tel:+${selectedPrestation.client.user.phone}`} className="contact client-phone">
                                                                        <FontAwesomeIcon icon={faPhone} />
                                                                    </a>
                                                                    <p>{selectedPrestation.client.user.phone}</p>
                                                                </>     
                                                                : <>
                                                                    <p>Non renseigné</p>
                                                                </>
                                                            }
                                                        </div>

                                                        <div className="contact-wrapper">
                                                            {selectedPrestation.client?.user?.email 
                                                                ? <>
                                                                    <a href={`mailto:${selectedPrestation.client.user.email}`} className="contact client-email">
                                                                        <FontAwesomeIcon icon={faEnvelope} />
                                                                    </a>
                                                                    <p>{selectedPrestation.client.user.email}</p>
                                                                </>
                                                                : <>
                                                                    <p>Non renseigné</p>
                                                                </>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>

                                                {selectedPrestation.state === "await-craftsman" && 
                                                    <div className="craftsman-quote-prestation">
                                                        <div className="wrapper">
                                                            <div className="icon">
                                                                <FontAwesomeIcon icon={faFileInvoice} />
                                                            </div>
                                                            <h3>Faire une proposition (devis)</h3>
                                                        </div>
                                                        <form className="quote">
                                                            <Input label="Prix proposé" symbol="€" id="quote-price" placeholder="199.99" 
                                                                type="number" autoComplete="off"
                                                                value={quoteForm.price}
                                                                onChange={(e) => setQuoteForm({...quoteForm, price : e.target.value})}
                                                            />
                                                            {quoteErrorForm.price && <AlertMessage type="error">{quoteErrorForm.price}</AlertMessage>}

                                                            <Input label="Date proposé" id="quote-date" 
                                                                type="datetime-local"
                                                                min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, -8)}
                                                                value={quoteForm.date}
                                                                onChange={(e) => setQuoteForm({...quoteForm, date : e.target.value})}
                                                            />
                                                            {quoteErrorForm.date && <AlertMessage type="error">{quoteErrorForm.date}</AlertMessage>}
                                                        </form>
                                                    </div>
                                                }

                                                <div className="actions-btn">
                                                    <div className="wrapper">
                                                        <div className="icon">
                                                            <FontAwesomeIcon icon={faBolt} />
                                                        </div>
                                                        <h3>Actions</h3>
                                                    </div>
                                                    <div className="info-card card">
                                                        {selectedPrestation.state === "await-craftsman" && 
                                                            <>
                                                                <Button className="action-accept" onClick={() => craftsmanAccept(selectedPrestation.id)}> 
                                                                    {isLoadingConfirm ? (
                                                                        <SpinLoader />
                                                                    ) : (
                                                                        <>
                                                                            Faire une proposition
                                                                        </>
                                                                    )}
                                                                </Button> 
                                                                <Button className="action-refuse" onClick={() => craftsmanRefuse(selectedPrestation.id)}>
                                                                    {isLoadingCancel ? (
                                                                        <SpinLoader />
                                                                    ) : (
                                                                        <>
                                                                            Refuser la demande de {firstCapitalize(selectedPrestation.client.user.first_name)}
                                                                        </>
                                                                    )}
                                                                </Button>
                                                            </>
                                                        }
                                                        
                                                        {selectedPrestation.state === "await-client" && 
                                                            <p className="prestation-info pending">En attente de la réponse du client&nbsp;...</p>
                                                        }

                                                        {selectedPrestation.state === "confirmed" && 
                                                            <>
                                                                <Button className="action-accept" onClick={() => craftsmanComplete(selectedPrestation.id)}> 
                                                                    {isLoadingConfirm ? (
                                                                        <SpinLoader />
                                                                    ) : (
                                                                        <>
                                                                            Clôturer la prestation
                                                                        </>
                                                                    )}
                                                                </Button> 
                                                            </>
                                                        }
                                                        {selectedPrestation.state === "completed" && 
                                                            <p className="prestation-info success">Votre projet est terminé succès.</p>
                                                        }
                                                        {selectedPrestation.state === "refused-by-client" &&
                                                            <p className="prestation-info cancel">Le client a refusé votre proposition.</p>
                                                        }
                                                        {selectedPrestation.state === "refused-by-craftsman" &&
                                                            <p className="prestation-info cancel">Vous avez refusé la demande.</p>
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