import "./Actions.scss";

import { useContext } from "react";
import { PrestationsContext } from "../../../context/PrestationsContext.jsx";

import { usePrestationClientActions } from "../../../../../hooks/usePrestationClientActions.jsx";
import { usePrestationCraftsmanActions } from "../../../../../hooks/usePrestationCraftsmanActions.jsx";

import { firstCapitalize } from "../../../../../utils/Helpers.jsx";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileInvoice, faBolt} from '@fortawesome/free-solid-svg-icons'

import Button from "../../../../../components/ui/Button";
import Input from "../../../../../components/ui/Input.jsx";
import AlertMessage from "../../../../../components/AlertMessage";
import SpinLoader from "../../../../../components/ui/SpinLoader";

function Actions({detailsPrestation, closeModal, fetchDetailsPrestation, user}) {

    const { quoteErrorForm, alertMessage, quoteForm, setQuoteForm } = useContext(PrestationsContext);

    const { isLoadingClientAccept, isLoadingClientRefuse, clientAccept, clientRefuse } = usePrestationClientActions(user.userToken, fetchDetailsPrestation);
    const { isLoadingCraftsmanAccept, isLoadingCraftsmanRefuse, isLoadingCraftsmanComplete, craftsmanAccept, craftsmanRefuse, craftsmanComplete } = usePrestationCraftsmanActions(user.userToken, fetchDetailsPrestation);

    return (
        <>
            {user.userRole === "craftsman" && detailsPrestation.state === "await-craftsman" && 
                <div className="craftsman-quote-prestation">
                    <div className="wrapper">
                        <div className="icon">
                            <FontAwesomeIcon icon={faFileInvoice} />
                        </div>
                        <h3>Faire une proposition (devis)</h3>
                    </div>
                    <form className="quote">
                        <Input label="Prix proposé" symbol="€" id="quote-price" placeholder="199.99" 
                            type="number" autoComplete="off"
                            value={quoteForm.price}
                            onChange={(e) => setQuoteForm({...quoteForm, price : e.target.value})}
                        />
                        {quoteErrorForm.price && <AlertMessage type="error">{quoteErrorForm.price}</AlertMessage>}

                        <Input label="Date proposé" id="quote-date" 
                            type="datetime-local"
                            min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, -8)}
                            value={quoteForm.date}
                            onChange={(e) => setQuoteForm({...quoteForm, date : e.target.value})}
                        />
                        {quoteErrorForm.date && <AlertMessage type="error">{quoteErrorForm.date}</AlertMessage>}
                    </form>
                </div>
            }

            <div className="actions-btn">
                <div className="wrapper">
                    <div className="icon">
                        <FontAwesomeIcon icon={faBolt} />
                    </div>
                    <h3>Actions</h3>
                </div>
                <div className="info-card card">

                    {user.userRole === "client" && 
                        <>
                            {detailsPrestation.state === "await-craftsman" && 
                                <p className="prestation-info pending">En attente de la réponse de l'artisan&nbsp;...</p>
                            }
                            {detailsPrestation.state === "await-client" && 
                                <>
                                    <Button className="action-accept" onClick={() => clientAccept(detailsPrestation.id)}> 
                                        {isLoadingClientAccept ? (
                                            <SpinLoader />
                                        ) : (
                                            <>
                                                Accepter la proposition
                                            </>
                                        )}
                                    </Button> 
                                    <Button className="action-refuse" onClick={() => clientRefuse(detailsPrestation.id)}>
                                        {isLoadingClientRefuse ? (
                                            <SpinLoader />
                                        ) : (
                                            <>
                                                Refuser la proposition
                                            </>
                                        )}
                                    </Button>
                                </>
                            }

                            {detailsPrestation.state === "confirmed" && 
                                <p className="prestation-info info">Vous avez accepté la proposition, l'artisan va intervenir sous peu.</p>
                            }
                            {detailsPrestation.state === "completed" && 
                                <p className="prestation-info success">Votre projet est terminé succès.</p>
                            }
                            {detailsPrestation.state === "refused-by-client" &&
                                <p className="prestation-info cancel">Vous avez refusé la proposition.</p>
                            }
                            {detailsPrestation.state === "refused-by-craftsman" &&
                                <p className="prestation-info cancel">L'artisan a refusé votre demande.</p>
                            }
                        </>
                    }

                    {user.userRole === "craftsman" &&
                        <>
                            {detailsPrestation.state === "await-craftsman" && 
                                <>
                                    <Button className="action-accept" onClick={() => craftsmanAccept(detailsPrestation.id, quoteForm)}> 
                                        {isLoadingCraftsmanAccept ? (
                                            <SpinLoader />
                                        ) : (
                                            <>
                                                Faire une proposition
                                            </>
                                        )}
                                    </Button> 
                                    <Button className="action-refuse" onClick={() => craftsmanRefuse(detailsPrestation.id)}>
                                        {isLoadingCraftsmanRefuse ? (
                                            <SpinLoader />
                                        ) : (
                                            <>
                                                Refuser la demande de {firstCapitalize(detailsPrestation.client.user.first_name)}
                                            </>
                                        )}
                                    </Button>
                                </>
                            }
                        
                            {detailsPrestation.state === "await-client" && 
                                <p className="prestation-info pending">En attente de la réponse du client&nbsp;...</p>
                            }

                            {detailsPrestation.state === "confirmed" && 
                                <>
                                    <Button className="action-accept" onClick={() => craftsmanComplete(detailsPrestation.id)}> 
                                        {isLoadingCraftsmanComplete ? (
                                            <SpinLoader />
                                        ) : (
                                            <>
                                                Clôturer la prestation
                                            </>
                                        )}
                                    </Button> 
                                </>
                            }
                            {detailsPrestation.state === "completed" && 
                                <p className="prestation-info success">Votre projet est terminé succès.</p>
                            }
                            {detailsPrestation.state === "refused-by-client" &&
                                <p className="prestation-info cancel">Le client a refusé votre proposition.</p>
                            }
                            {detailsPrestation.state === "refused-by-craftsman" &&
                                <p className="prestation-info cancel">Vous avez refusé la demande.</p>
                            }
                        </>
                    }

                    <Button className="btn-primary" onClick={closeModal}>Fermer</Button>
                    {alertMessage && alertMessage.type === "success" && <AlertMessage type="success">{alertMessage.message}</AlertMessage>}
                    {alertMessage && alertMessage.type === "error" && <AlertMessage type="error">{alertMessage.message}</AlertMessage>}
                </div>
            </div>
        </>
    );
}

export default Actions;