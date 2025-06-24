import { createContext, useContext, useState, useEffect } from "react";
import axios from 'axios';
import { AuthContext } from "../../../context/AuthContext";

export const PrestationsContext = createContext();

export const PrestationsProvider = ({children}) => {
    
    const apiBase = import.meta.env.VITE_MAIN_API_URI;
    const {userToken} = useContext(AuthContext)

    const [isLoadingPrestations, setIsLoadingPrestations] = useState(true);
    const [userPrestations, setUserPrestations] = useState(null);

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

    return (
        <PrestationsContext.Provider value={{
                isLoadingPrestations,
                userPrestations,
                fetchUserPrestations
                }}>
            {children}
        </PrestationsContext.Provider>
    );
}
