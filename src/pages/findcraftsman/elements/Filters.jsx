import './Filters.scss';
import { useContext } from 'react';
import { ApiServicesContext } from "../../../context/ApiServicesContext";

import SelectJobs from "../../../components/ui/SelectJobs.jsx";
import Select from "../../../components/ui/Select.jsx";

function Filters({setSearchParams, searchParams, ...props}) {

    const { jobsCategories, regions } = useContext(ApiServicesContext);

    const handleJobSelect = (e) => {
        if(e.target.value === ""){
            searchParams.delete('catId');
            return setSearchParams(searchParams)
        }

        setSearchParams({...Object.fromEntries(searchParams), catId : e.target.value});
    }

    const handleRegionSelect = (e) => {
        if(e.target.value === ""){
            searchParams.delete('region');
            return setSearchParams(searchParams)
        }

        setSearchParams({...Object.fromEntries(searchParams), region : e.target.value});
    }

    return ( 
        <section className="filters">
            <div className="filters-card">

                {/* Select cat job */}
                <SelectJobs
                    label="Catégorie"
                    id="cat-job"
                    placeholder="Toutes les catégories"
                    datas={
                        jobsCategories.length > 1 ?
                        jobsCategories : 
                        null
                    }
                    value={searchParams.get('catId') ?? ""}
                    onChange={(e) => handleJobSelect(e)}
                />
                
                {/* Select region */}
                <Select
                    id="region"
                    label="Région"
                    datas={regions}
                    selectPlaceholder="Toutes les régions"
                    value={searchParams.get('region') ?? ""}
                    onChange={(e) => handleRegionSelect(e)}
                />
            </div>
        </section>
    );
}

export default Filters;