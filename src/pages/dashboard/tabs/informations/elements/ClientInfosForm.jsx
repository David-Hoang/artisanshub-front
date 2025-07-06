import "./ClientInfosForm.scss";
import { useState, useContext } from "react";
import axios from "axios";

import { AuthContext } from "../../../../../context/AuthContext.jsx";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

import Input from "../../../../../components/ui/Input.jsx";
import Button from "../../../../../components/ui/Button.jsx";
import AlertMessage from "../../../../../components/AlertMessage.jsx";
import SpinLoader from "../../../../../components/ui/SpinLoader.jsx";

function ClientInfosForm() {

    const apiBase = import.meta.env.VITE_MAIN_API_URI;
    const {userDatas, userToken, reFetchUserDatas, hasCompletedProfile} = useContext(AuthContext)

    const defaultErrorForm = {
        street_number : "",
        street_name : "",
        complement : "",
    };
    const [errorInfosForm, setErrorInfosForm] = useState(defaultErrorForm);
    const [isLoadingClient, setIsLoadingClient] = useState(false);

    const defaultAlertMessage = {type : "", message : ""};
    const [alertMessage, setAlertMessage] = useState(defaultAlertMessage);

    const [userClientForm, setUserClientForm] = useState({
        street_number : userDatas.client?.street_number ?? "",
        street_name : userDatas.client?.street_name ?? "",
        complement : userDatas.client?.complement ?? "",
    });

    const handleSubmitUserClientInfos = async (e) => {
        e.preventDefault();

        setAlertMessage(defaultAlertMessage);
        setErrorInfosForm(defaultErrorForm);

        setIsLoadingClient(true);

        //Validation : Get userClientForm and return object of error if no value in input
        const validateClientInputs = Object.entries(userClientForm).reduce((acc, [key, value]) => {
            if (!value) {
                switch (key) {
                    case "street_number":
                        acc[key] = "Le numéro de rue est requis.";
                        break;
                    case "street_name":
                        acc[key] = "Le nom de la rue est requis.";
                        break;
                    default:
                        break;
                }
            } else if (value.length > 255) {
                switch (key) {
                    case "street_name":
                        acc[key] = "Le nom de la rue ne peut pas dépasser 255 caractères.";
                        break;
                    case "complement":
                        acc[key] = "Le complément d'adresse ne peut pas dépasser 255 caractères.";
                        break;
                    default:
                        break;
                }
            } else if (value < 0){

                if(key === "street_number"){
                    acc[key] = "Le numéro de rue ne peut pas être négatif.";
                }
            }
            return acc;
        }, {});

        // Check if there is at least 1 error
        if(Object.keys(validateClientInputs).length > 0){
            setErrorInfosForm(validateClientInputs);
            setIsLoadingClient(false);
            return;
        }

        try {
            const updateClientInfos = await axios.post(apiBase + "/api/client-infos", 
                userClientForm,
                { headers: {
                    "Authorization": "Bearer " + userToken,
                }
            });

            if(updateClientInfos.status === 200 || updateClientInfos.status === 201) {
                setAlertMessage({
                    ...alertMessage, 
                    type : "success", 
                    message : updateClientInfos.status === 200 
                    ? "Votre adresse a été mis à jour avec succès."
                    : "Votre adresse a été ajouté avec succès."
                });

                reFetchUserDatas()
            }
        } catch (error) {
            
            if (!error.response) return setAlertMessage({...alertMessage, type : "error", message : "Une erreur est survenue durant la mise à jour de votre addresse"})
            
            const { status, data } = error.response;
            
            if(status === 422){
                // Convert the error into an object
                const getErrors = Object.entries(data.errors).reduce((validateError, validate) => {
                    validateError[validate[0]] = validate[1][0];
                    return validateError;
                }, {})

                setErrorInfosForm(getErrors);
            } else {
                setAlertMessage({...alertMessage, type : "error", message : "Une erreur est survenue durant la mise à jour de votre adresse"})
            }
        } finally {
            setIsLoadingClient(false);
        }
    }
    
    return ( 
        <form onSubmit={handleSubmitUserClientInfos} className={hasCompletedProfile ? "client-infos-form" : "client-infos-form need-to-complete"}>
            <div className="client-infos-header">
                <h2>Adresse</h2>
                <h3>Indiquez votre adresse complète pour que l'artisan puisse se déplacer facilement.</h3>
                {!hasCompletedProfile &&
                    <h3 className="important-informations">
                        <FontAwesomeIcon icon={faCircleInfo} />
                        Veuillez compléter ces informations pour accéder à toutes les fonctionnalités.
                    </h3>
                }
            </div>
            <div className="client-address-input">
                <div className="wrapper">
                    <Input label="Numéro de rue *" id="street_number" type="number" min="0" placeholder="12"
                        value={userClientForm.street_number}
                        onChange={(e) => setUserClientForm({...userClientForm, street_number : parseInt(e.target.value)})}
                        />
                    {errorInfosForm.street_number && <AlertMessage type="error">{errorInfosForm.street_number}</AlertMessage>}
                </div>
                <div className="wrapper">
                    <Input label="Nom de la rue *" id="street_name" type="text" placeholder="rue Verdun"
                        value={userClientForm.street_name}
                        onChange={(e) => setUserClientForm({...userClientForm, street_name : e.target.value})}
                        />
                    {errorInfosForm.street_name && <AlertMessage type="error">{errorInfosForm.street_name}</AlertMessage>}
                </div>
                <div className="wrapper">
                    <Input label="Compléments" id="complement" type="text" autoComplete="off" placeholder="Résidence Blue, Bâtiment A"
                        value={userClientForm.complement}
                        onChange={(e) => setUserClientForm({...userClientForm, complement : e.target.value})}
                        />
                    {errorInfosForm.complement && <AlertMessage type="error">{errorInfosForm.complement}</AlertMessage>}
                </div>
            </div>

            <Button type="submit" className="btn-primary">
                {isLoadingClient ? (
                    <SpinLoader />
                ): (
                    <>
                        Sauvegarder
                    </>
                )}
            </Button>

            {alertMessage.message && alertMessage.type === "success" &&
                <AlertMessage type="success">{alertMessage.message}</AlertMessage>
            }
            {alertMessage.message && alertMessage.type === "error" &&
                <AlertMessage type="error">{alertMessage.message}</AlertMessage>
            }
        </form>
    );
}

export default ClientInfosForm;