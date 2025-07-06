import "./ModalAdminPrestation.scss";
import { useContext, useState, useEffect } from "react";
import axios from "axios";

import { AuthContext } from "../../../../../../context/AuthContext";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReceipt } from '@fortawesome/free-solid-svg-icons';

import Modal from "../../../../../../components/ui/Modal";
import SpinLoader from "../../../../../../components/ui/SpinLoader";
import Resumes from "../Resumes";
import Parties from "../Parties";
import Traceability from "../Traceability";
import Actions from "../Actions";

function ModalAdminPrestation({ isModalOpen, closeModal, selectedPrestation, statusList }) {

    const apiBase = import.meta.env.VITE_MAIN_API_URI;
    const [isLoadingPresDetails, setIsLoadingPresDetails] = useState(false);
    const [selectedPresDetails, setSelectedPresDetails] = useState(null);
    const { userToken } = useContext(AuthContext);

    const fetchSelectedDetailsPrestation = async () => {
        setIsLoadingPresDetails(true);

        try {
            const response = await axios.get(`${apiBase}/api/admin/prestation/${selectedPrestation.id}`, {
                    headers: {
                        "Authorization": "Bearer " + userToken,
                    }
                })

            const { data } = response;
            if(response.status === 200) setSelectedPresDetails(data);
            
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoadingPresDetails(false);
        }
    }

    useEffect(() => {
        fetchSelectedDetailsPrestation()
    }, []);

    return ( 
        <Modal isOpen={isModalOpen} closeModal={closeModal} className="admin-prestation">

            <div className="modal-header">
                <div className="icon-bg">
                    <FontAwesomeIcon icon={faReceipt} />
                </div>
                <h3>Détails de la prestation</h3>
            </div>
            
            {isLoadingPresDetails
                ? <SpinLoader className="loading-admin-prestations"/>
                : selectedPresDetails &&
                    <>
                    <div className="modal-main">
                        <div className="content-prestation">
                            <Resumes selectedPresDetails={selectedPresDetails} />
                            <Parties selectedPresDetails={selectedPresDetails} />
                        </div>

                        <aside className="aside">
                            <Traceability selectedPresDetails={selectedPresDetails} />
                            <Actions 
                                selectedPresDetails={selectedPresDetails} 
                                closeModal={closeModal} 
                                statusList={statusList} 
                                fetchSelectedDetailsPrestation={fetchSelectedDetailsPrestation}
                            />
                        </aside>
                    </div>
                    </>
                }
        </Modal>
    );
}

export default ModalAdminPrestation;