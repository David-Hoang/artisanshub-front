import { createContext, useState, useEffect } from "react";
import axios from 'axios';

export const JobsCatContext = createContext();

export const JobsCatController = ({children}) => {
    
    const apiBase = import.meta.env.VITE_MAIN_API_URI;
    const [controllerLoading, setControllerLoading] = useState(true);
    const [jobsCategories, setJobsCategories] = useState([]);


    const fetchJobsCat = async () => {
        try {
            const response = await axios.get(apiBase + "/api/jobs");
            if(response.status === 200){
                setJobsCategories(response.data.jobs);
            }
        } catch (error) {
            console.log(error);
        }finally{
            setControllerLoading(false);
        }
    }

    useEffect(() => {
        fetchJobsCat()
    }, [])

    return (
        <JobsCatContext.Provider value={{jobsCategories}}>
            {!controllerLoading && children}
        </JobsCatContext.Provider>
    );
}
