import './JobCard.scss';
import { Link } from "react-router-dom";

import {randomCraftsmanCover} from "../../../utils/Helpers.jsx"

import SpinLoader from "../../../components/ui/SpinLoader.jsx";
import Button from "../../../components/ui/Button.jsx";


function JobCard({jobsCategories, ...props}) {
    const randomJobs = [...jobsCategories].sort(() => .5 - Math.random()).splice(0,4)
    const apiBase = import.meta.env.VITE_MAIN_API_URI;
    
    return ( 
        <section className="home-jobs-categories">
            <div className="jobs-category-title">
                <h2>Quelques catégories</h2>
                <h3>Un aperçu des domaines d'expertise disponibles.</h3>
            </div>
            
            {randomJobs.length > 1 ? (
                <>
                    <div className="jobs-categories-list">
                        {randomJobs.map(job => (
                        <Link to='/' key={job.id} className="job-category-card">
                            <div className="image-container">
                                <div className="filter-brightness"></div>
                                <img
                                src={job?.img_path ? `${apiBase}/storage/${job.img_path}` : randomCraftsmanCover()} alt={`${job.name ?? "Métier"} : ${job.img_title}`} 
                                className="image-artisan"
                                />
                            </div>
                            <div className="infos-container">
                                <h4>{job.name}</h4>
                            </div>
                        </Link>

                        ))}
                    </div>
                    <Button className="btn-primary">
                        Voir les catégories
                    </Button>
                </>
            ) : (
                <SpinLoader/>
            )}
        </section>
    );
}

export default JobCard;