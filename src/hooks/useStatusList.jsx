import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

export const useStatusList = () => {
    const apiBase = import.meta.env.VITE_MAIN_API_URI;
    const { userToken } = useContext(AuthContext);

    const [statusList, setStatusList] = useState([]);
    const [isLoadingStatus, setIsLoadingStatus] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const fetchStates = async () => {

        setErrorMessage("");
        setIsLoadingStatus(true);

        try {
            const response = await axios.get(`${apiBase}/api/admin/prestations/states`, {
                headers: {
                    "Authorization": "Bearer " + userToken,
                }
            })
            setStatusList(response.data);
        } catch (error) {
            if(error.status === 500) {
                setErrorMessage("Une erreur s'est produite lors de la récupération des status.");
            } else if (error) {
                setErrorMessage("Une erreur s'est produite lors de la récupération des status.");
            }
        } finally {
            setIsLoadingStatus(false);
        }
    }

    useEffect(() => {
        if (userToken) {
            fetchStates();
        }
    }, [userToken]);

    return {
        isLoadingStatus,
        statusList,
        errorMessage,
    }
}