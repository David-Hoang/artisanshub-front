import "./ModalAskPrestation.scss";
import { useState, useContext } from 'react';
import axios from "axios";
import { AuthContext } from "../../../../context/AuthContext";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faCircleCheck } from '@fortawesome/free-solid-svg-icons';

import Modal from "../../../../components/ui/Modal";
import Button from "../../../../components/ui/Button.jsx";
import Input from "../../../../components/ui/Input";
import TextArea from "../../../../components/ui/TextArea";
import SpinLoader from "../../../../components/ui/SpinLoader.jsx";
import AlertMessage from "../../../../components/AlertMessage.jsx";

function ModalAskPrestation({isOpen, closeModal, craftsmanInfos}) {

    const apiBase = import.meta.env.VITE_MAIN_API_URI;
    const {userToken} = useContext(AuthContext);

    const [isLoadingNewPrestation, setIsLoadingNewPrestation] = useState(false);
    const [asked, setAsked] = useState(false);

    const defaultNewPrestationForm = {
        title : "",
        description : ""
    }
    const defaultAlertMessage = {type : "", message : ""};

    const defaultPrestationErrorForm = {
        title : "",
        description : ""
    }

    const [prestationForm, setPrestationForm] = useState(defaultNewPrestationForm);
    const [alertMessage, setAlertMessage] = useState(defaultAlertMessage);
    const [prestationErrorForm, setPrestationErrorForm] = useState(defaultPrestationErrorForm);
    
    const handleNewPrestation = async (e) => {
        e.preventDefault();

        setAlertMessage(defaultAlertMessage);
        setPrestationErrorForm(defaultPrestationErrorForm);

        setIsLoadingNewPrestation(true);

         //Validation : Get prestationForm and return object of error if no value in input
        const validatePrestationInputs = Object.entries(prestationForm).reduce((acc, [key, value]) => {
            if (!value) {
                switch (key) {
                    case "title":
                        acc[key] = "Veuillez renseigner le titre de votre demande.";
                        break;
                    case "description":
                        acc[key] = "Veuillez détailler votre demande.";
                        break;
                    default:
                        break;
                }
            } else if (key === "title" && value.length > 255) {
                acc[key] = "Le titre ne doit pas dépasser 255 caractères.";
            } else if (key === "description" && value.length > 65535) {
                acc[key] = "Votre message est trop long, maximum de caractère par message : 65535.";
            }
            return acc;
        }, {});

        // Check if there is at least 1 error
        if(Object.keys(validatePrestationInputs).length > 0){
            setPrestationErrorForm(validatePrestationInputs);
            setIsLoadingNewPrestation(false);
            return;
        }

        try {
            const response = await axios.post(`${apiBase}/api/prestation/${craftsmanInfos.id}`,
                prestationForm,
                {
                    headers: {
                        "Authorization": "Bearer " + userToken,
                    }
                })
            
            if(response.status === 201) {
                setAsked(true);
                setPrestationForm(defaultNewPrestationForm);
            }

        } catch (error) {

            const { status, data } = error.response;

            if(status === 404) {
                setAlertMessage({type : "error", message : "L'artisan spécifié est introuvable."});
            } else if(status === 422) {
                // Convert the error into an object
                const getErrors = Object.entries(data.errors).reduce((validateError, validate) => {
                    validateError[validate[0]] = validate[1][0];
                    return validateError;
                }, {})
                setPrestationErrorForm(getErrors);
            } else {
                setAlertMessage({...alertMessage, type : "error", message : "Une erreur est survenue durant l'envoie la de prestation."})
            }

        } finally {
            setIsLoadingNewPrestation(false)
        }
    }
    
    return ( 
        <Modal isOpen={isOpen} closeModal={closeModal} className="modal-ask-prestation">
            { asked && 
                <>
                    <p className="prestation-asked"> 
                        <FontAwesomeIcon icon={faCircleCheck} />
                        Votre demande à bien été transmis à {craftsmanInfos.user.first_name}, vous pouvez trouver votre demande de prestation dans votre tableau de bord.
                    </p>
                    <Button className="btn btn-primary btn-prestation-asked" onClick={closeModal}>
                        Fermer
                    </Button>
                </>
            }

            { !asked &&
                <>
                    <div className="modal-header">
                        <h4>Faire ma demande de prestation à {craftsmanInfos.user.first_name}</h4>
                    </div>
                    <form onSubmit={handleNewPrestation} className="new-prestation">
                        <div className="new-prestation-inputs">
                            <div className="wrapper">
                                <Input label="Objet*" id="title" 
                                    placeholder="Rénovation circuit élctrique"
                                    type="text" autoComplete="off"
                                    value={prestationForm.title}
                                    onChange={(e) => setPrestationForm({...prestationForm, title : e.target.value})}
                                />
                                {prestationErrorForm.title && <AlertMessage type="error">{prestationErrorForm.title}</AlertMessage>}
                            </div>

                            <div className="wrapper">
                                <p>Votre message*</p>
                                <TextArea placeholder="Votre message ..."
                                    rows="3"
                                    value={prestationForm.description}
                                    onChange={(e) => setPrestationForm({...prestationForm, description : e.target.value})} 
                                />
                                {prestationErrorForm.description && <AlertMessage type="error">{prestationErrorForm.description}</AlertMessage>}
                            </div>

                        </div>

                        <div className="btn-wrapper">
                            <Button className="btn btn-secondary" onClick={closeModal}>
                                Fermer
                            </Button>

                            <Button type="submit" className="btn-primary">
                                { isLoadingNewPrestation 
                                    ? <SpinLoader />
                                    : <>
                                        Envoyer ma demande
                                        <FontAwesomeIcon icon={faPaperPlane} />
                                    </>
                                }
                            </Button>
                        </div>
                        
                        {alertMessage.message && alertMessage.type === "error" &&
                            <AlertMessage type="error">{alertMessage.message}</AlertMessage>
                        }
                    </form>
                </>
            }
        </Modal>
    );
}

export default ModalAskPrestation;