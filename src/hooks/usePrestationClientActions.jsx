import { useState, useContext } from 'react';
import axios from "axios";

import { PrestationsContext } from "../pages/dashboard/context/PrestationsContext";

export const usePrestationClientActions = (userToken, fetchDetailsPrestation) => {

    const apiBase = import.meta.env.VITE_MAIN_API_URI;
    const {fetchUserPrestations, alertMessage, setAlertMessage} = useContext(PrestationsContext);


    const defaultAlertMessage = {type : "", message : ""};

    const [isLoadingClientAccept, setIsLoadingClientAccept] = useState(false);
    const [isLoadingClientRefuse, setIsLoadingClientRefuse] = useState(false);
    
    const clientAccept = async (presId) => {
        setAlertMessage(defaultAlertMessage);
        setIsLoadingClientAccept(true);

        try {
            const response = await axios.patch(`${apiBase}/api/prestation/${presId}/accept`,
                {},
                { headers: {"Authorization": "Bearer " + userToken} 
            })

            if(response.status === 200) {
                setAlertMessage({...alertMessage, type : "success", message : "Votre modification a bien été pris en compte."});
                fetchDetailsPrestation(presId);
                // fetchUserPrestations();
            }

        } catch (error) {
            console.log(error);
            
            const { status } = error.response;

            if(status === 403){
                setAlertMessage({...alertMessage, type : "error", message : "Cette prestation ne vous est pas assignée ou son état ne permet pas de répondre"});

            } else if (status === 404){
                setAlertMessage({...alertMessage, type : "error", message : "Cette prestation n'existe pas."});
            } 
            else if(status === 500){
                setAlertMessage({...alertMessage, type : "error", message : "Une erreur est survenue lors de l'acceptation de la prestation."});
            }
        } finally {
            setIsLoadingClientAccept(false);
        }

    }

    const clientRefuse = async (presId) => {
        setAlertMessage(defaultAlertMessage);
        setIsLoadingClientRefuse(true);

        try {
            const response = await axios.patch(`${apiBase}/api/prestation/${presId}/client-refuse`,
                {},
                { headers: {"Authorization": "Bearer " + userToken} 
            })

            if(response.status === 200) {
                setAlertMessage({...alertMessage, type : "success", message : "Vous avez refusé la proposition."});
                fetchDetailsPrestation(presId);
                // fetchUserPrestations();
            }

        } catch (error) {

            const { status } = error.response;

            if(status === 403){
                setAlertMessage({...alertMessage, type : "error", message : "Cette prestation ne vous est pas assignée ou son état ne permet pas de répondre"});

            } else if (status === 404){
                setAlertMessage({...alertMessage, type : "error", message : "Cette prestation n'existe pas."});
            } 
            else if(status === 500){
                setAlertMessage({...alertMessage, type : "error", message : "Une erreur est survenue lors du refus de la prestation."});
            }
        } finally {
            setIsLoadingClientRefuse(false);
        }
    }

    return {
        clientAccept,
        clientRefuse,
        isLoadingClientAccept,
        isLoadingClientRefuse,
    }
}