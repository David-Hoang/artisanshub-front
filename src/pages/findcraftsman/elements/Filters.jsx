import './Filters.scss';
import { useContext } from 'react';
import { ApiServicesContext } from "../../../context/ApiServicesContext";

import SelectJobs from "../../../components/ui/SelectJobs.jsx";
import Select from "../../../components/ui/Select.jsx";

function Filters({setSearchParams, searchParams, ...props}) {

    const { jobsCategories, regions } = useContext(ApiServicesContext);

    return ( 
        <section className="filters">
            <div className="filters-card">
                <SelectJobs
                    label="Catégorie"
                    id="cat-job"
                    placeholder="Toutes les catégories"
                    datas={
                        jobsCategories.length > 1 ?
                        jobsCategories : 
                        null
                    }
                    value={searchParams.get('catId')}
                    onChange={(e) => setSearchParams({...Object.fromEntries(searchParams), catId : e.target.value})}
                />

                <Select
                    label="Région"
                    datas={regions}
                    placeholder="Toutes les régions"
                    value={searchParams.get('region')}
                    onChange={(e) => setSearchParams({...Object.fromEntries(searchParams), region : e.target.value})}
                />
            </div>
        </section>
    );
}

export default Filters;