import { createContext, useState, useEffect } from "react";
import axios from 'axios';

export const ApiServicesContext = createContext();

export const ApiServicesProvider = ({children}) => {
    
    const apiBase = import.meta.env.VITE_MAIN_API_URI;
    const [controllerLoading, setControllerLoading] = useState(true);
    const [jobsCategories, setJobsCategories] = useState([]);
    const [regions, setRegions] = useState([]);

    // const fetchJobsCat = async () => {
    //     try {
    //         const response = await axios.get(apiBase + "/api/jobs");
    //         if(response.status === 200){
    //             setJobsCategories(response.data.jobs);
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }finally{
    //         setControllerLoading(false);
    //     }
    // }

    const fetchEndPoints = async () => {

        try {
            let endPoints = [
                axios.get(`${apiBase}/api/jobs`),
                axios.get(`${apiBase}/api/enums/regions`)
            ];

            //destructuration
            const [jobsRes, regionsRes] = await Promise.all(endPoints);

            if (jobsRes.status === 200) {
                setJobsCategories(jobsRes.data.jobs);
            }
            if (regionsRes.status === 200) {
                setRegions(regionsRes.data.regions);
            }

        } catch (error) {
            console.log(error);
        }finally{
            setControllerLoading(false);
        }
    }

    useEffect(() => {
        fetchEndPoints()
    }, [])

    return (
        <ApiServicesContext.Provider value={{jobsCategories, regions}}>
            {!controllerLoading && children}
        </ApiServicesContext.Provider>
    );
}
