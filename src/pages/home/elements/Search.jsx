import './Search.scss';
import { useContext, useState } from "react";
import { ApiServicesContext } from "../../../context/ApiServicesContext.jsx";

import Button from "../../../components/ui/Button.jsx";
import Input from "../../../components/ui/Input.jsx";
import Select from "../../../components/ui/Select.jsx";
import { useNavigate } from "react-router-dom";
import SelectJobs from "../../../components/ui/SelectJobs.jsx";

function Search({...props}) {

    const navigate = useNavigate();

    const { jobsCategories, regions } = useContext(ApiServicesContext)

    const [searchForm, setSearchForm] = useState({
        jobCatId : "",
        region : ""
    })

    return ( 
        <section className="home-search">
            <form className="home-search-form">
                <h2>Votre projet commence ici.</h2>
                <div className="wrapper">

                    {/* Select jobs */}
                    <SelectJobs
                        label="Que recherchez-vous ?"
                        id="job"
                        placeholder="Sélectionnez une catégorie"
                        value={searchForm.jobCatId}
                        datas={ 
                            jobsCategories.length > 1 ?
                            jobsCategories : 
                            null
                        }
                        onChange={(e) => setSearchForm({...searchForm, jobCatId : e.target.value})}
                    />

                    {/* Select region */}
                    <Select
                        id="region"
                        label="Région"
                        datas={regions}
                        selectPlaceholder="Toutes les régions"
                        value={searchForm.region}
                        onChange={(e) => setSearchForm({...searchForm, region : e.target.value})}
                    />
                </div>

                <Button className="btn-primary" onClick={() => navigate(`/trouver-artisan?${searchForm.jobCatId ? `catId=${searchForm.jobCatId}` : ''}&${searchForm.region ? `region=${searchForm.region}` : ''}`)}>Rechercher</Button>
            </form>
        </section>
    );
}

export default Search;