import "./StatePrestationClient.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCheck, faHourglassHalf, faListCheck, faCaretRight, faUserClock, faCheck, faUserXmark } from '@fortawesome/free-solid-svg-icons';

import { firstCapitalize, dateLong, dateFull } from "../../../../../utils/Helpers.jsx";

function StatePrestationClient({detailsPrestation}) {
    return ( 
        <div className="state-prestation-client">
            <div className="wrapper">
                <div className="icon">
                    <FontAwesomeIcon icon={faHourglassHalf} />
                </div>
                <h3>État du projet</h3>
            </div>
            
            <div className="wrapper-card">
                
                {detailsPrestation.state === 'await-craftsman' &&
                    <>
                        <div className="state-card card pending">
                            <div className="icon">
                                <FontAwesomeIcon icon={faUserClock} />
                            </div>
                            <div className="state-content">
                                <h4>
                                    En attente de l'artisan
                                </h4>
                                <p className="state-description">Votre demande est en attente de traitement par {firstCapitalize(detailsPrestation.craftsman.user.first_name)}</p>
                            </div>
                        </div>

                        <div className="info-card card">
                            <div className="icon">
                                <FontAwesomeIcon icon={faListCheck} />
                            </div>
                            <div className="info-content">
                                <h4>
                                    Prochaines étapes
                                </h4>
                                <ul className="info-list">
                                    <li><FontAwesomeIcon icon={faCaretRight} /> {firstCapitalize(detailsPrestation.craftsman.user.first_name)} étudie votre demande</li>
                                    <li><FontAwesomeIcon icon={faCaretRight} /> Il vous fait une proposition ou la refuse</li>
                                    <li><FontAwesomeIcon icon={faCaretRight} /> Vous choisissez d'accepter ou non sa proposition</li>
                                </ul>
                            </div>
                        </div>
                    </>
                }
                
                {detailsPrestation.state === 'await-client' &&
                    <>
                        <div className="state-card card pending">
                            <div className="icon">
                                <FontAwesomeIcon icon={faUserClock} />
                            </div>
                            <div className="state-content">
                                <h4>
                                    En attente de votre réponse
                                </h4>
                                <p className="state-description">{firstCapitalize(detailsPrestation.craftsman.user.first_name)} vous a fait une proposition ! À vous de choisir la suite</p>
                            </div>
                        </div>

                        <div className="info-card card">
                            <div className="icon">
                                <FontAwesomeIcon icon={faListCheck} />
                            </div>
                            <div className="info-content">
                                <h4>
                                    Prochaines étapes
                                </h4>
                                <ul className="info-list">
                                    <li><FontAwesomeIcon icon={faCaretRight} /> Examiner sa proposition</li>
                                    <li><FontAwesomeIcon icon={faCaretRight} /> Échanger avec {firstCapitalize(detailsPrestation.craftsman.user.first_name)} si vous avez des questions</li>
                                    <li><FontAwesomeIcon icon={faCaretRight} /> Accepter ou refuser sa proposition</li>
                                </ul>
                            </div>
                        </div>
                    </>
                }
                
                {detailsPrestation.state === 'confirmed' &&
                    <>
                        <div className="state-card card confirmed">
                            <div className="icon">
                                <FontAwesomeIcon icon={faUserCheck} />
                            </div>
                            <div className="state-content">
                                <h4>
                                    Proposition confirmé
                                </h4>
                                <p className="state-description">Vous avez confirmé la proposition de {firstCapitalize(detailsPrestation.craftsman.user.first_name)}</p>
                            </div>
                        </div>

                        <div className="info-card card">
                            <div className="icon">
                                <FontAwesomeIcon icon={faListCheck} />
                            </div>
                            <div className="info-content">
                                <h4>
                                    Prochaines étapes
                                </h4>
                                <ul className="info-list">
                                    <li><FontAwesomeIcon icon={faCaretRight} /> L'artisan va vous contacter pour les travaux</li>
                                    <li><FontAwesomeIcon icon={faCaretRight} /> Restez disponible pour toute information</li>
                                </ul>
                            </div>
                        </div>
                    </>
                }
                
                {detailsPrestation.state === 'completed' &&
                    <div className="state-card card completed">
                        <div className="icon">
                            <FontAwesomeIcon icon={faCheck} />
                        </div>
                        <div className="state-content">
                            <h4>
                                Projet terminé
                            </h4>
                            <p className="state-description">Le projet a été achevé avec succès</p>
                        </div>
                    </div>
                }
                
                {detailsPrestation.state === 'refused-by-client' &&
                    <>
                        <div className="state-card card refused">
                            <div className="icon">
                            <FontAwesomeIcon icon={faUserXmark} />
                            </div>
                            <div className="state-content">
                                <h4>
                                    Refusé par vous
                                </h4>
                                <p className="state-description">Vous avez décliné la proposition de {firstCapitalize(detailsPrestation.craftsman.user.first_name)}</p>
                            </div>
                        </div>

                        <div className="info-card card">
                            <div className="icon">
                                <FontAwesomeIcon icon={faListCheck} />
                            </div>
                            <div className="info-content">
                                <h4>
                                    Prochaines étapes
                                </h4>
                                <ul className="info-list">
                                    <li><FontAwesomeIcon icon={faCaretRight} /> Projet annulé suite à votre refus</li>
                                    <li><FontAwesomeIcon icon={faCaretRight} /> Vous pouvez créer une nouvelle demande</li>
                                    <li><FontAwesomeIcon icon={faCaretRight} /> Cherchez un autre artisan pour votre projet</li>
                                </ul>
                            </div>
                        </div>
                    </>
                }
                
                {detailsPrestation.state === 'refused-by-craftsman' &&
                    <>
                        <div className="state-card card refused">
                            <div className="icon">
                                <FontAwesomeIcon icon={faUserXmark} />
                            </div>
                            <div className="state-content">
                                <h4>
                                    Refusé par l'artisan
                                </h4>
                                <p className="state-description">Votre demande a été décliné par {firstCapitalize(detailsPrestation.craftsman.user.first_name)}</p>
                            </div>
                        </div>

                        <div className="info-card card">
                            <div className="icon">
                                <FontAwesomeIcon icon={faListCheck} />
                            </div>
                            <div className="info-content">
                                <h4>
                                    Prochaines étapes
                                </h4>
                                <ul className="info-list">
                                    <li><FontAwesomeIcon icon={faCaretRight} /> L'artisan ne peut pas réaliser votre demande</li>
                                    <li><FontAwesomeIcon icon={faCaretRight} /> Recontacter en modifiant votre demande</li>
                                    <li><FontAwesomeIcon icon={faCaretRight} /> Recherchez un autre artisan</li>
                                </ul>
                            </div>
                        </div>
                    </>
                }

                <div className="creating-prestation-date">
                    <div className="created-card">
                        <p>Créer le </p>
                        <p>{dateLong(detailsPrestation.created_at)}</p>
                    </div>
                    <div className="updated-card">
                        <p>Mis à jour le</p>
                        <p>{dateFull(detailsPrestation.updated_at)}</p>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default StatePrestationClient;