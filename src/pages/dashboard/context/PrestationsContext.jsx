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

    useEffect(() => {
        fetchUserPrestations();
    }, []);

    return (
        <PrestationsContext.Provider value={{
                quoteForm, 
                setQuoteForm,
                alertMessage, 
                setAlertMessage,
                quoteErrorForm, 
                setQuoteErrorForm,

                isLoadingPrestations,
                userPrestations,
                fetchUserPrestations,
                }}>
                    
            {children}
        </PrestationsContext.Provider>
    );
}
