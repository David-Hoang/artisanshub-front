import './Listing.scss';

import { Link } from "react-router-dom";


import SpinLoader from "../../../components/ui/SpinLoader";

function Listing({isLoadingList, listing , ...props}) {
    
    return ( 
        <section className="craftsmen">
            <div className="craftsmen-content">
                { isLoadingList && <SpinLoader /> }

                {listing && listing.length > 0 
                ?
                    <ul className="craftsmen-list">
                        {listing.map(craftsman => (
                            <li key={craftsman.id} className="craftsman-card">
                                <Link to={`/artisan/${craftsman.id}`}>
                                    {craftsman.user.first_name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    
                : <p>Nous n'avons trouvé aucun artisan correspondant à vos critères</p>
                }
            </div>
        </section>
    );
}

export default Listing;