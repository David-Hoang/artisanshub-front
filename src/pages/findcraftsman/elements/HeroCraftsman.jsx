import './HeroCraftsman.scss';

import { firstCapitalize } from "../../../utils/Helpers.jsx";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot, faBriefcase} from '@fortawesome/free-solid-svg-icons'

import { randomCraftsmanCover } from "../../../utils/Helpers.jsx";

function HeroCraftsman({craftsmanInfos, ...props}) {

    const apiBase = import.meta.env.VITE_MAIN_API_URI;

    return ( 
        <section className="hero-craftsman">
            <div className="hero-content">
                <img 
                    className="hero-img-craftsman"
                    src={craftsmanInfos.cover ? `${apiBase}/storage/${craftsmanInfos.cover}` : randomCraftsmanCover()}
                    alt="Image bio de couverture pour l'artisan" 
                />
                <div className="filter-brightness"></div>

                <div className="hero-infos-craftsman">
                    <h1 className="hero-name">{firstCapitalize(craftsmanInfos.user.first_name)} {firstCapitalize(craftsmanInfos.user.last_name)}</h1>
                    <div className="hero-infos-wrapper">
                        <div className="craftsman-job">
                            <div className="icon">
                                <FontAwesomeIcon icon={faBriefcase} />
                            </div>
                            <p>
                                {craftsmanInfos.job.name}
                            </p>
                        </div>

                        <div className="craftsman-location">
                            <div className="icon">
                                <FontAwesomeIcon icon={faLocationDot} />
                            </div>
                            <p>{craftsmanInfos.user.region}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HeroCraftsman;