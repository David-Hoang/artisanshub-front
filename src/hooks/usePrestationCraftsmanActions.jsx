import { useState, useContext } from 'react';
import axios from "axios";

import { PrestationsContext } from "../pages/dashboard/context/PrestationsContext";

export const usePrestationCraftsmanActions = (userToken, fetchDetailsPrestation) => {
    const apiBase = import.meta.env.VITE_MAIN_API_URI;

    const {fetchUserPrestations, alertMessage, setAlertMessage, setQuoteErrorForm} = useContext(PrestationsContext);

    const [isLoadingCraftsmanAccept, setIsLoadingCraftsmanAccept] = useState(false);
    const [isLoadingCraftsmanRefuse, setIsLoadingCraftsmanRefuse] = useState(false);
    const [isLoadingCraftsmanComplete, setIsLoadingCraftsmanComplete] = useState(false);

    const defaultAlertMessage = {type : "", message : ""};
    const defaultQuoteError = {price : "", date : ""};

    const craftsmanAccept = async (presId, quoteForm) => {

        // Clear states
        setAlertMessage(defaultAlertMessage);
        setQuoteErrorForm(defaultQuoteError);
        setIsLoadingCraftsmanAccept(true);
        
        //Validation : Get craftsmanQuote and return object of error if no value in input
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
            setIsLoadingCraftsmanAccept(false);
            return;
        }
        try {

            const response = await axios.patch(`${apiBase}/api/prestation/${presId}/quote`,
                quoteForm,
                { headers: {"Authorization": "Bearer " + userToken} 
            })

            if(response.status === 200) {
                setAlertMessage({...alertMessage, type : "success", message : "Votre proposition a été transmise au client."});
                fetchDetailsPrestation(presId);
                // fetchUserPrestations();
            }

        } catch (error) {
            console.log(error);
            
            const { status } = error.response;

            if(status === 401){
                if(localStorage.getItem("artisansHubUserToken")){
                    localStorage.removeItem("artisansHubUserToken");
                }
                window.location.href = '/connexion';
            } else if(status === 403) {
                setAlertMessage({...alertMessage, type : "error", message : "Cette prestation ne vous est pas assignée ou son état ne permet pas de répondre"});
            } else if (status === 404) {
                setAlertMessage({...alertMessage, type : "error", message : "Cette prestation n'existe pas."});
            } 
            else if(status === 500) {
                setAlertMessage({...alertMessage, type : "error", message : "Une erreur est survenue lors de l'acceptation de la prestation."});
            }
        } finally {
            setIsLoadingCraftsmanAccept(false);
        }
    }

    const craftsmanRefuse = async (presId) => {
        // Empty alert message
        setAlertMessage(defaultAlertMessage);
        setIsLoadingCraftsmanRefuse(true);

        try {
            const response = await axios.patch(`${apiBase}/api/prestation/${presId}/craftsman-refuse`,
                {},
                { headers: {"Authorization": "Bearer " + userToken} 
            })

            if(response.status === 200) {
                setAlertMessage({...alertMessage, type : "success", message : "La demande a bien été refusée."});
                fetchDetailsPrestation(presId);
                // fetchUserPrestations();
            }

        } catch (error) {

            const { status } = error.response;

            if(status === 401){
                if(localStorage.getItem("artisansHubUserToken")){
                    localStorage.removeItem("artisansHubUserToken");
                }
                window.location.href = '/connexion';
            } else if(status === 403) {
                setAlertMessage({...alertMessage, type : "error", message : "Cette prestation ne vous est pas assignée ou son état ne permet pas de répondre"});
            } else if (status === 404) {
                setAlertMessage({...alertMessage, type : "error", message : "Cette prestation n'existe pas."});
            } 
            else if(status === 500) {
                setAlertMessage({...alertMessage, type : "error", message : "Une erreur est survenue lors du refus de la demande la prestation."});
            }
        } finally {
            setIsLoadingCraftsmanRefuse(false);
        }
    }

    const craftsmanComplete = async (presId) => {

        // Empty alert message
        setAlertMessage(defaultAlertMessage);
        setIsLoadingCraftsmanComplete(true);
        try {
            const response = await axios.patch(`${apiBase}/api/prestation/${presId}/completed`,
                {},
                { headers: {"Authorization": "Bearer " + userToken} 
            })

            if(response.status === 200) {
                setAlertMessage({...alertMessage, type : "success", message : "La prestation a été clôturée avec succès."});
                fetchDetailsPrestation(presId);
                // fetchUserPrestations();
            }

        } catch (error) {

            const { status } = error.response;

            if(status === 401){
                if(localStorage.getItem("artisansHubUserToken")){
                    localStorage.removeItem("artisansHubUserToken");
                }
                window.location.href = '/connexion';
            } else if(status === 403) {
                setAlertMessage({...alertMessage, type : "error", message : "Cette prestation ne vous est pas assignée ou son état ne permet pas de répondre"});
            } else if (status === 404) {
                setAlertMessage({...alertMessage, type : "error", message : "Cette prestation n'existe pas."});
            } 
            else if(status === 500) {
                setAlertMessage({...alertMessage, type : "error", message : "Une erreur est survenue lors de la clôture de la prestation."});
            }
        } finally {
            setIsLoadingCraftsmanComplete(false);
        }
    }

    return {
        craftsmanAccept,
        isLoadingCraftsmanAccept,

        craftsmanRefuse,
        isLoadingCraftsmanRefuse,

        craftsmanComplete,
        isLoadingCraftsmanComplete
    }
}