import "./AdminPrestationsTab.scss";
import { useContext, useState } from "react";
import { PrestationsContext } from "../../context/PrestationsContext";

import { dateShort, firstCapitalize } from "../../../../utils/Helpers";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrash } from '@fortawesome/free-solid-svg-icons';

import Table from "../../../../components/ui/Table";
import SpinLoader from "../../../../components/ui/SpinLoader";
import Button from "../../../../components/ui/Button";
import AlertMessage from "../../../../components/AlertMessage";
import Badge from "../../../../components/ui/Badge";
import ModalAdminPrestation from "./admin-elements/modals/ModalAdminPrestation";
import { useStatusList } from "../../../../hooks/useStatusList";

function AdminPrestationsTab() {

    const {isLoadingPrestations, 
        errorMessage, 
        prestationsList, 
        deletePrestation, 
        alertMessage, 
        isLoadingPrestationDelete, 
        isOpenconfirmDelete,
        confirmDelete,
        closeDelete} = useContext(PrestationsContext);

    const { statusList } = useStatusList();
    
    const titleCol = [ "Identifiant" ,"Client", "Artisan", "Titre", "État", "Créer le", "Actions" ];
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPrestation, setSelectedPrestation] = useState(null);

    const openModal = (pres) => {
        setIsModalOpen(true);
        setSelectedPrestation(pres);
    }

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedPrestation(null);
    }

    return ( 
        <div id="admin-prestations-tab" onClick={() => isOpenconfirmDelete !== false && closeDelete()}>
            <Table thead={titleCol}>
                {isLoadingPrestations
                    ?  ( <tr>
                            <td colSpan={7}>
                                <SpinLoader className="loading-admin-prestations" />
                            </td>
                        </tr>
                    ) : prestationsList && prestationsList.length > 0
                        ?  prestationsList.map((pres, index) => (
                            <tr key={pres.id} onClick={() => openModal(pres)}>
                                <td data-label={titleCol[0]}>#{pres.id}</td>
                                <td data-label={titleCol[1]}>{firstCapitalize(pres.client_first_name ?? "inconnu")} {firstCapitalize(pres.client_last_name ?? "inconnu")}</td>
                                <td data-label={titleCol[2]}>{firstCapitalize(pres.craftsman_first_name ?? "inconnu")} {firstCapitalize(pres.craftsman_last_name ?? "inconnu")}</td>
                                <td data-label={titleCol[3]}>{pres.title}</td>
                                <td data-label={titleCol[4]}>
                                    {pres.state === "await-craftsman" && <Badge color="pending">En attente artisan</Badge> }
                                    {pres.state === "await-client" && <Badge color="pending">En attente client</Badge> }
                                    {pres.state === "confirmed" && <Badge color="info">Prestation confirmé</Badge> }
                                    {pres.state === "completed" && <Badge color="success">Prestation complété</Badge> }
                                    {pres.state === "refused-by-client" && <Badge color="danger">Refusé par le client</Badge> }
                                    {pres.state === "refused-by-craftsman" && <Badge color="danger">Refusé par l'artisan</Badge> }
                                </td>
                                <td data-label={titleCol[5]}>{dateShort(pres.created_at)}</td>
                                <td className="data-actions" data-label={titleCol[6]}>
                                        {isOpenconfirmDelete === index
                                        ?   
                                            <div className="confirm-delete-prestation">
                                                {alertMessage.message 
                                                    && alertMessage.type === "error" 
                                                        ? <AlertMessage type="error">{alertMessage.message}</AlertMessage>
                                                        : <p>Supprimer cette prestation ?</p>
                                                }
                                                <div>
                                                    <Button className="confirm-yes" onClick={(e) => {deletePrestation(pres.id), e.stopPropagation()}}>
                                                        {isLoadingPrestationDelete
                                                            ? <SpinLoader/>
                                                            : "Oui"
                                                        }
                                                    </Button>
                                                    <Button className="confirm-no" onClick={(e) => {closeDelete(); e.stopPropagation()}}>Non</Button>
                                                </div>
                                            </div>
                                        : 
                                            <div className="btn-wrapper-prestation">
                                                <Button className="btn button-delete-prestation" onClick={(e) => {confirmDelete(index); e.stopPropagation()}}>
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </Button>
                                                <Button className="btn button-show-prestation">
                                                    <FontAwesomeIcon icon={faEye} />
                                                </Button>
                                            </div>
                                        }
                                    </td>
                            </tr>
                    )) : (
                        <tr>
                            <td colSpan={8}>
                                {errorMessage 
                                ? errorMessage
                                    : prestationsList && prestationsList.length === 0 
                                        ? "Aucun utilisateur n'est inscrit actuellement."
                                            : null}
                            </td>
                        </tr>
                    )
                }
            </Table>

            {isModalOpen && (
                    <ModalAdminPrestation
                        isModalOpen={isModalOpen}
                        closeModal={closeModal} 
                        selectedPrestation={selectedPrestation}
                        statusList={statusList}
                    />
                    )
                }
        </div>
    );
}

export default AdminPrestationsTab;