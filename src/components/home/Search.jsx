import './Search.scss';

import axios from 'axios';
import { useEffect, useState } from "react";

import Button from "../Button.jsx";
import Input from "../form/Input.jsx";
import Select from "../form/Select.jsx";

function Search() {
    const apiBase = import.meta.env.VITE_MAIN_API_URI;
    const [jobs, setJobs] = useState([]);

    const fetchJobs = async () => {
        try {
            const response = await axios.get(apiBase + "/api/craftsman/jobs");
            if(response.status === 200){
                setJobs(response.data.jobs)
            }

        } catch (error) {
            console.log(error);
        }
    }
    
    useEffect(() => {
        fetchJobs();
    }, []);

    return ( 
        <section className="home-search">
            <form className="home-search-form">
                <h2>Votre projet commence ici.</h2>
                <div className="wrapper">

                    <Select 
                        label="Que recherchez-vous ?"
                        id="job"
                        placeholder="Sélectionnez une catégorie"
                        datas={jobs}
                    />

                    <Input
                        label="Location"
                        id="location"
                        type="text"
                        placeholder="Renseignez la ville ou le code postal"
                        autoComplete="off"
                    />
                </div>

                <Button className="btn-primary">Rechercher</Button>
            </form>
        </section>
    );
}

export default Search;