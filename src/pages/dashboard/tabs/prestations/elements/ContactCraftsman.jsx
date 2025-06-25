import "./ContactCraftsman.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCheck, faPhone, faEnvelope, faLocationDot} from '@fortawesome/free-solid-svg-icons'

import { firstCapitalize } from "../../../../../utils/Helpers.jsx";

import DefaultClient from '../../../../../assets/img/default-client.svg';

function ContactCraftsman({detailsPrestation}) {

    // If user is craftsman, then show client infos
    const apiBase = import.meta.env.VITE_MAIN_API_URI;

    return ( 
        <div className="modal-client-info">
            <div className="wrapper">
                <div className="icon">
                    <FontAwesomeIcon icon={faUserCheck} />
                </div>
                <h3>Informations client</h3>
            </div>

            <div className="client-infos">
                <div className="wrapper">
                    <div className="client-picture">
                        <img src={detailsPrestation.client?.user?.profile_img?.img_path ? `${apiBase}/storage/${detailsPrestation.client.user.profile_img.img_path}` : DefaultClient}
                            alt={detailsPrestation.client?.user?.profile_img?.img_title ? detailsPrestation.client?.user?.profile_img?.img_title : ''}
                        />
                    </div>
                    <h4 className="client-name">
                        {firstCapitalize(detailsPrestation.client.user.first_name)}
                        {' '}
                        {firstCapitalize(detailsPrestation.client.user.last_name)}
                    </h4>
                </div>
            </div>

            <div className="client-contact">
                <div className="contact-wrapper">
                    {detailsPrestation.client?.full_address
                        ? <>
                            <div className="contact client-address">
                                <FontAwesomeIcon icon={faLocationDot} />
                            </div>
                            <p>{detailsPrestation.client.full_address}</p>
                        </>     
                        : <>
                            <p>Non renseigné</p>
                        </>
                    }
                </div>
                
                <div className="contact-wrapper">
                    {detailsPrestation.client?.user?.phone
                        ? <>
                            <a href={`tel:+${detailsPrestation.client.user.phone}`} className="contact client-phone">
                                <FontAwesomeIcon icon={faPhone} />
                            </a>
                            <p>{detailsPrestation.client.user.phone}</p>
                        </>     
                        : <>
                            <p>Non renseigné</p>
                        </>
                    }
                </div>

                <div className="contact-wrapper">
                    {detailsPrestation.client?.user?.email 
                        ? <>
                            <a href={`mailto:${detailsPrestation.client.user.email}`} className="contact client-email">
                                <FontAwesomeIcon icon={faEnvelope} />
                            </a>
                            <p>{detailsPrestation.client.user.email}</p>
                        </>
                        : <>
                            <p>Non renseigné</p>
                        </>
                    }
                </div>
            </div>
        </div>
    );
}

export default ContactCraftsman;