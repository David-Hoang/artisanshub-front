import "./StatePrestationCraftsman.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCheck, faHourglassHalf, faListCheck, faCaretRight, faUserClock, faCheck, faUserXmark } from '@fortawesome/free-solid-svg-icons';

import { firstCapitalize, dateLong, dateFull } from "../../../../../utils/Helpers.jsx";

function StatePrestationCraftsman({detailsPrestation}) {
    return ( 
        <div className="state-prestation-craftsman">
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
                                    Vous avez une nouvelle demande de la part d'un client
                                </h4>
                                <p className="state-description">{firstCapitalize(detailsPrestation.client.user.first_name)} attend une proposition de votre part</p>
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
                                    <li><FontAwesomeIcon icon={faCaretRight} /> Étudiez la demande de {firstCapitalize(detailsPrestation.client.user.first_name)} puis répondez</li>
                                    <li><FontAwesomeIcon icon={faCaretRight} /> Soumettez votre proposition à {firstCapitalize(detailsPrestation.client.user.first_name)}</li>
                                    <li><FontAwesomeIcon icon={faCaretRight} /> {firstCapitalize(detailsPrestation.client.user.first_name)} acceptera ou déclinera votre proposition</li>
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
                                    En attente du client
                                </h4>
                                <p className="state-description">Vous avez envoyé une proposition à {firstCapitalize(detailsPrestation.client.user.first_name)}, attendez sa réponse</p>
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
                                    <li><FontAwesomeIcon icon={faCaretRight} /> Attendez la décision concernant votre proposition</li>
                                    <li><FontAwesomeIcon icon={faCaretRight} /> {firstCapitalize(detailsPrestation.client.user.first_name)} pourrait accepter ou décliner la proposition</li>
                                    <li><FontAwesomeIcon icon={faCaretRight} /> Restez disponible en cas de question ou d'échange</li>
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
                                    Proposition accepté
                                </h4>
                                <p className="state-description">{firstCapitalize(detailsPrestation.client.user.first_name)} a accepté votre proposition</p>
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
                                    <li><FontAwesomeIcon icon={faCaretRight} /> Prenez contact avec {firstCapitalize(detailsPrestation.client.user.first_name)} pour convenir des modalités</li>
                                    <li><FontAwesomeIcon icon={faCaretRight} /> Effectuez l'intervention chez {firstCapitalize(detailsPrestation.client.user.first_name)} à la date convenue</li>
                                    <li><FontAwesomeIcon icon={faCaretRight} /> Mettez à jour le statut du projet une fois les travaux terminés</li>
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
                                    Refusé par le client
                                </h4>
                                <p className="state-description">Votre proposition a été décliné par {firstCapitalize(detailsPrestation.client.user.first_name)}</p>
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
                                    <li><FontAwesomeIcon icon={faCaretRight} /> Mettez à jour votre disponibilité pour faciliter de futurs contacts</li>
                                    <li><FontAwesomeIcon icon={faCaretRight} /> Cette demande reste archivé dans votre espace</li>
                                    <li><FontAwesomeIcon icon={faCaretRight} /> Restez attentif, peut etre que {firstCapitalize(detailsPrestation.client.user.first_name)} vous sollictera à l'avenir</li>
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
                                    Refusé par vous
                                </h4>
                                <p className="state-description">Vous avez décliné la demande de {firstCapitalize(detailsPrestation.client.user.first_name)}</p>
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
                                    <li><FontAwesomeIcon icon={faCaretRight} /> {firstCapitalize(detailsPrestation.client.user.first_name)} est informé de votre décision</li>
                                    <li><FontAwesomeIcon icon={faCaretRight} /> Cette demande reste archivé dans votre espace</li>
                                    <li><FontAwesomeIcon icon={faCaretRight} /> Restez disponible si {firstCapitalize(detailsPrestation.client.user.first_name)} souhaite reprendre contact à l'avenir</li>
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

export default StatePrestationCraftsman;