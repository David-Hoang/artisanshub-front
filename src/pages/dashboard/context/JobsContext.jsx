import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";

export const JobsContext = createContext();

export const JobsProvider = ({children}) => {
    const apiBase = import.meta.env.VITE_MAIN_API_URI;
    const { userToken } = useContext(AuthContext);

    const [isLoadingJobs, setIsLoadingJobs] = useState(false);
    const [jobsList, setJobsList] = useState(false);

    const fetchJobs = async () => { 

        setIsLoadingJobs(true)

        try {
            const response = await axios.get(`${apiBase}/api/admin/jobs`, {
                    headers: {
                        "Authorization": "Bearer " + userToken,
                    }
                })
            setJobsList(response.data.jobs);
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoadingJobs(false)
        }
    }

    useEffect(() => {
        fetchJobs();
    }, []);

    return (
        <JobsContext.Provider value={{
                isLoadingJobs,
                jobsList,
                fetchJobs
            }}>

            {children}
        </JobsContext.Provider>
    )
}
