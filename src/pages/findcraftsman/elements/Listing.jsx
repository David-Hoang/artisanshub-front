import './Listing.scss';

import { Link } from "react-router-dom";
import { firstCapitalize } from "../../../utils/Helpers";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot, faBriefcase} from '@fortawesome/free-solid-svg-icons'

import SpinLoader from "../../../components/ui/SpinLoader";

import DefaultCraftsman from '../../../assets/img/default-craftsman.svg';

function Listing({isLoadingList, listing , ...props}) {
    return ( 
        <section className="craftsmen-content">
            { isLoadingList && <SpinLoader /> }

            {listing && listing.length > 0 
            ?
                <ul className="craftsmen-list">
                    {listing.map(craftsman => (
                        <li key={craftsman.id} className="craftsman-card">
                            <Link to={`/artisan/${craftsman.id}`} className="craftsman-link">

                                <img className="image-craftsman"
                                    src={`https://picsum.photos/500/300?random=${craftsman.id}`}
                                    alt=""
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

                                        <p className="price-craftsman">{craftsman.price ? `${craftsman.price}€/h` : "Non renseigné"}</p>
                                    </div>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
                
            : <p>Nous n'avons trouvé aucun artisan correspondant à vos critères</p>
            }
        </section>
    );
}

export default Listing;