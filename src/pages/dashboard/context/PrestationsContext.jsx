import { createContext, useContext, useState, useEffect } from "react";
import axios from 'axios';
import { AuthContext } from "../../../context/AuthContext";

export const PrestationsContext = createContext();

export const PrestationsProvider = ({children}) => {
    
    const apiBase = import.meta.env.VITE_MAIN_API_URI;
    const {userToken, userRole} = useContext(AuthContext)

    const [isLoadingPrestations, setIsLoadingPrestations] = useState(true);
    const [userPrestations, setUserPrestations] = useState(null);

    const defaultQuoteForm = { price : "",date : "" }
    const [quoteForm, setQuoteForm] = useState(defaultQuoteForm);

    const defaultAlertMessage = {type : "", message : ""};
    const [alertMessage, setAlertMessage] = useState(defaultAlertMessage);

    const defaultQuoteError = {price : "", date : ""}
    const [quoteErrorForm, setQuoteErrorForm] = useState(defaultQuoteError);

    const [errorMessage, setErrorMessage] = useState("");


    //admin prestation
    const [prestationsList, setPrestationsList] = useState(null);

    const fetchUserPrestations = async () => { 

        setIsLoadingPrestations(true)

        try {
            const response = await axios.get(`${apiBase}/api/prestations`, {
                    headers: {
                        "Authorization": "Bearer " + userToken,
                    }
                })
            loadUserPrestations(response.data);
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoadingPrestations(false)
        }
    }

    const loadUserPrestations = (userPrestationList) => {

        if(userPrestationList && userPrestationList.length > 0){

            const prestationsList = userPrestationList.map(prestation => ({
                id: prestation.id,
                title: prestation.title,
                state: prestation.state,
                user_last_name: 
                    userRole === "client" 
                    ? prestation.craftsman?.user?.last_name 
                    : userRole === "craftsman" 
                        ? prestation.client?.user?.last_name
                        : null,
                user_first_name: userRole === "client" 
                    ? prestation.craftsman?.user?.first_name 
                    : userRole === "craftsman" 
                        ? prestation.client?.user?.first_name
                        : null,
                created_at: prestation.created_at,
            }));

            setUserPrestations(prestationsList);
        }else{
            setUserPrestations(null)
        }
    }

    const fetchAdminPrestations = async () => {
        setIsLoadingPrestations(true);
        try {
            const response = await axios.get(`${apiBase}/api/admin/prestations`, {
                    headers: {
                        "Authorization": "Bearer " + userToken,
                    }
                })
            
                if(response.status === 200) setPrestationsList(response.data);
        } catch (error) {
            setErrorMessage("Une erreur est survenu, veuillez reessayer plus tard.");
        } finally {
            setIsLoadingPrestations(false)
        }
    }

    useEffect(() => {
        if(userRole !== 'admin'){
            fetchUserPrestations();
        } else {
            fetchAdminPrestations();
        }
    }, []);

    const [isLoadingPrestationDelete, setIsLoadingPrestationDelete] = useState(false);
    const [isOpenconfirmDelete , setisOpenConfirmDelete] = useState(false);

    const deletePrestation = async (presId) => {
        setAlertMessage(defaultAlertMessage);
        setIsLoadingPrestationDelete(true);

        try{
            const response = await axios.delete(`${apiBase}/api/admin/prestation/${presId}`,
                { headers: 
                    {"Authorization": `Bearer ${userToken}`
                }
            })

            if(response.status === 200){
                setisOpenConfirmDelete(null);
                fetchAdminPrestations();
            } 

        } catch(error) {
            const { status, data } = error.response;

            if(status === 404){
                setAlertMessage({type : "error", message : data.message})
            } else {
                setAlertMessage({type : "error", message : "Une erreur est survenue durant la suppression de la prestation."})
            }
        } finally {
            setIsLoadingPrestationDelete(false);
        }
    }

    const confirmDelete = (index) => {
        setisOpenConfirmDelete(index);
    }

    const closeDelete = () => {
        setAlertMessage(defaultAlertMessage);
        setisOpenConfirmDelete(null);
    }


    const [isLoadingPrestationUpdate, setIsLoadingPrestationUpdate] = useState(false);
    
    // admin update state
    const updatePrestationState = async (prestationState ,presId, fetchSelectedDetailsPrestation) => {
            setErrorMessage("")
            setAlertMessage(defaultAlertMessage);
            setIsLoadingPrestationUpdate(true);

            if (prestationState.state === "") {
                setErrorMessage("Veuillez sélectionner un état pour cette prestation")
                setIsLoadingPrestationUpdate(false);
                return; 
            } 
            
            try{
                const response = await axios.patch(`${apiBase}/api/admin/prestation/state/${presId}`,
                    prestationState,
                    { headers: 
                        {"Authorization": `Bearer ${userToken}`
                    }
                })
    
                if(response.status === 200){
                    setAlertMessage({type : "success", message : "Le status à bien été mise à jour."});              
                    fetchSelectedDetailsPrestation();
                    fetchAdminPrestations();
                } 
    
            } catch(error) {
                
                const { status, data } = error.response;
    
                if(status === 404){
                    setAlertMessage({type : "error", message : data.message})
                } else if (status === 422) {
                    setAlertMessage({type : "error", message : "Veuillez sélectionner un status valide."})
                }else if (status === 500){
                    setAlertMessage({type : "error", message : "Une erreur est survenue durant la mise à jour de la prestation."})
                }
            } finally {
                setIsLoadingPrestationUpdate(false);
            }
        }

    return (
        <PrestationsContext.Provider value={{
                quoteForm, 
                setQuoteForm,
                alertMessage, 
                setAlertMessage,
                quoteErrorForm, 
                setQuoteErrorForm,

                errorMessage,

                confirmDelete,
                closeDelete,
                isLoadingPrestationDelete,
                isOpenconfirmDelete,
                deletePrestation,

                isLoadingPrestationUpdate,
                updatePrestationState,

                isLoadingPrestations,
                userPrestations,
                prestationsList,
                fetchUserPrestations,
                fetchAdminPrestations
                }}>
                    
            {children}
        </PrestationsContext.Provider>
    );
}
