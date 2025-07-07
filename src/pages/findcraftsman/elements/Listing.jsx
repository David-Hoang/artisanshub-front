import './Listing.scss';
import { useContext, useEffect, useState } from "react";;
import { Link, useSearchParams } from "react-router-dom";
import { firstCapitalize } from "../../../utils/Helpers";
import { ApiServicesContext } from "../../../context/ApiServicesContext";
import { randomCraftsmanCover } from "../../../utils/Helpers";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot, faBriefcase} from '@fortawesome/free-solid-svg-icons'


import SpinLoader from "../../../components/ui/SpinLoader";

function Listing({isLoadingList, listing}) {
    const apiBase = import.meta.env.VITE_MAIN_API_URI;

    const { regions, jobsCategories } = useContext(ApiServicesContext);
    const [searchParams] = useSearchParams();

    const [messageResult, setMessageResult] = useState("");

    useEffect(() => {
        if (regions && jobsCategories) {
            setMessageResult(showResultMessage());
        }
    }, [searchParams]);

    const showResultMessage = () => {
        const jobIdParam = parseInt(searchParams.get('catId'));
        const regionParam = searchParams.get('region');

        let jobName = null;
        let regionName = null;
        let message = "";

        if (jobIdParam) {
            const job = jobsCategories.find(job => job.id === jobIdParam);
            jobName = job ? job.name : null;
        }

        if (regionParam && regions.length > 0) {
            const regionExist = regions.includes(regionParam);
            regionName = regionExist ? regionParam : null;
        }

        if (jobName && regionName) {
            message = `${jobName} à ${regionName}`;
        } else if (jobName && !regionName) {
            message = jobName;
        } else if (!jobName && regionName) {
            message = regionName;
        }

        return message;
    }

    return ( 
        <section className="craftsmen-content">
            
            { isLoadingList && <SpinLoader /> }

            {listing && listing.length > 0 
            ?
                <>
                    {messageResult && <p className="result-message">Résultats pour : <span>{messageResult}</span></p> }
                    <ul className="craftsmen-list">
                        {listing.map(craftsman => (
                            <li key={craftsman.id} className="craftsman-card">
                                <Link to={`/artisan/${craftsman.id}`} className="craftsman-link">

                                    <img className="image-craftsman"
                                        src={craftsman.cover ? `${apiBase}/storage/${craftsman.cover}` : randomCraftsmanCover()}
                                        alt={`Artisan ${craftsman.user?.first_name ?? ""}`}
                                    />
                                    <div className="filter-brightness"></div>
                                    <div className="infos-container">

                                        <h3>{firstCapitalize(craftsman.user.first_name)} {firstCapitalize(craftsman.user.last_name)}</h3>
                                        <div className="craftsman-job-container">
                                            <div className="icon">
                                                <FontAwesomeIcon icon={faBriefcase} />
                                            </div>
                                            <p>{craftsman.job.name}</p>
                                        </div>
                                        <div className="infos-craftsman">

                                            <div className="location-container">
                                                <div className="icon">
                                                    <FontAwesomeIcon icon={faLocationDot} />
                                                </div>
                                                <p>{craftsman.user.region}</p>
                                            </div>

                                            <p className="price-craftsman">{craftsman.price ? `${craftsman.price}€/h` : "Tarif non renseigné"}</p>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </>
            : <p className="result-message">Nous n'avons trouvé aucun artisan correspondant à vos critères : <span>{messageResult}</span>.</p>
            }
        </section>
    );
}

export default Listing;