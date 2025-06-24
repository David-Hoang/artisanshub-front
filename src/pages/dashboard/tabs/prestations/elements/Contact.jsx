import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGears, faFileLines, faEuroSign, faCalendar, faUserCheck, faPhone, faEnvelope, faHourglassHalf, faListCheck, faCaretRight, faBolt, faUserClock, faCheck, faUserXmark } from '@fortawesome/free-solid-svg-icons'

import { firstCapitalize, dateLong, dateFull } from "../../../../../utils/Helpers.jsx";


function Contact({detailsPrestation}) {

    const apiBase = import.meta.env.VITE_MAIN_API_URI;

    return ( 
        <div className="modal-craftsman-info">
            <div className="wrapper">
                <div className="icon">
                    <FontAwesomeIcon icon={faUserCheck} />
                </div>
                <h3>Artisan désigné</h3>
            </div>

            <div className="craftsman-infos">
                <div className="wrapper">
                    <div className="craftsman-picture">
                        <img src={detailsPrestation.craftsman?.user?.profile_img?.img_path ? `${apiBase}/storage/${detailsPrestation.craftsman.user.profile_img.img_path}` : DefaultCraftsman}
                            alt={detailsPrestation.craftsman?.user?.profile_img?.img_title ? detailsPrestation.craftsman?.user?.profile_img?.img_title : ''}
                        />
                    </div>
                    <div className="craftsman-name-job">
                        <h4>
                            {firstCapitalize(detailsPrestation.craftsman.user.first_name)}
                            {' '}
                            {firstCapitalize(detailsPrestation.craftsman.user.last_name)}
                        </h4>
                        <p className="job">Expertise : {detailsPrestation.craftsman.job.name}</p>
                    </div>
                </div>

                <div className="craftsman-pricing card">
                    <p>Tarif horaire</p>
                    <p className={`craftsman-infos ${detailsPrestation.craftsman?.price ? 'price' : ''}`}>
                        {detailsPrestation.craftsman?.price ? `${detailsPrestation.craftsman?.price} €/h` : "Tarif non renseigné"}
                    </p>
                </div>

                <div className="craftsman-available card">
                    <p>Disponibilité</p>
                    <div className="wrapper">
                        <div className={detailsPrestation.craftsman?.available ? 'available' : 'not-available'}></div>
                        <p>{detailsPrestation.craftsman?.available ? 'Disponible' : 'Non disponible'}</p>
                    </div>
                </div>
            </div>

            <div className="craftsman-contact">
                <div className="contact-wrapper">
                    {detailsPrestation.craftsman?.user?.phone
                        ? <>
                            <a href={`tel:+${detailsPrestation.craftsman.user.phone}`} className="contact craftsman-phone">
                                <FontAwesomeIcon icon={faPhone} />
                            </a>
                            <p>{detailsPrestation.craftsman.user.phone}</p>
                        </>     
                        : <>
                            <p>Non renseigné</p>
                        </>
                    }
                </div>

                <div className="contact-wrapper">
                    {detailsPrestation.craftsman?.user?.email 
                        ? <>
                            <a href={`mailto:${detailsPrestation.craftsman.user.email}`} className="contact craftsman-email">
                                <FontAwesomeIcon icon={faEnvelope} />
                            </a>
                            <p>{detailsPrestation.craftsman.user.email}</p>
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

export default Contact;