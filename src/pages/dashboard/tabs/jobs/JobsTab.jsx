import "./JobsTab.scss";
import { useState, useContext } from 'react';
import axios from "axios";
import { JobsContext } from "../../context/JobsContext";
import { AuthContext } from "../../../../context/AuthContext";

import { dateShortTime } from "../../../../utils/Helpers";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import SpinLoader from "../../../../components/ui/SpinLoader";
import Button from "../../../../components/ui/Button";

import ModalEditJob from "./elements/modals/ModalEditJob";
import ModalAddJob from "./elements/modals/ModalAddJob";
import AlertMessage from "../../../../components/AlertMessage";

function JobsTab() {
    const apiBase = import.meta.env.VITE_MAIN_API_URI;
    const { isLoadingJobs, jobsList, fetchJobs } = useContext(JobsContext);
    const { userToken } = useContext(AuthContext);
    const [isModalEditJobOpen, setIsModalEditJobOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);

    const openEditJob = (selectedJob) => {
        setIsModalEditJobOpen(true);
        setSelectedJob(selectedJob);
    }

    const closeEditJob = () => {
        setIsModalEditJobOpen(false);
        setSelectedJob(null);
    }

    const [isModalAddJobOpen, setIsModalAddJobOpen] = useState(false);

    const openAddJob = () => {
        setIsModalAddJobOpen(true);
    }

    const closeAddJob = () => {
        setIsModalAddJobOpen(false);
    }

    const [isOpenconfirmDelete , setisOpenConfirmDelete] = useState(false);

    const confirmDelete = (index) => {
        setisOpenConfirmDelete(index);
    }

    const closeDelete = () => {
        setAlertMessage(defaultAlertMessage);
        setisOpenConfirmDelete(null);
    }
    const defaultAlertMessage = {type : "", message : ""};
    const [alertMessage, setAlertMessage] = useState(defaultAlertMessage);
    const [isLoadingJobDelete, setIsLoadingJobDelete] = useState(false);

    const deleteJob = async (jobId) => {
        setAlertMessage(defaultAlertMessage);
        setIsLoadingJobDelete(true);

        try{
            const response = await axios.delete(`${apiBase}/api/admin/job/${jobId}`,
                { headers: 
                    {"Authorization": `Bearer ${userToken}`
                } 
            })

            if(response.status === 200){
                fetchJobs();
            } 

        } catch(error) {
            const { status, data } = error.response;

            if(status === 404){
                setAlertMessage({...setAlertMessage, type : "error", message : data.message})
            } else {
                setAlertMessage({...setAlertMessage, type : "error", message : "Une erreur est survenue durant la suppression du métier."})
            }
        } finally {
            setIsLoadingJobDelete(false);
        }
    }

    return (
        <div id="jobs-tab" onClick={() => isOpenconfirmDelete !== false && closeDelete()}>
        <Button className="btn-primary add-job" onClick={() => openAddJob()}> <FontAwesomeIcon icon={faPlus} /> Ajouter un métier</Button>

            {isLoadingJobs 
                ? <SpinLoader className="loading-list" />
                : jobsList && jobsList.length > 0 
                ?
                    <section className="job-list">
                        {jobsList.map((job, index) => (
                            <article key={job.id} className="admin-job-card">
                                <h3 className="job-name">{job.name}</h3>
                        
                                <p className="job-description">{job.description}</p>

                                <div className="job-dates">
                                    <p className="job-created">Créer le : {dateShortTime(job.created_at)}</p>
                                    <p className="job-updated">Modifié le : {dateShortTime(job.updated_at)}</p>
                                </div>
                                <div className="btn-wrapper">
                                    { isOpenconfirmDelete === index 
                                        ?
                                            <>  
                                                <div>
                                                    <p>Voulez-vous supprimer ce métier ?</p>
                                                    {alertMessage.message && alertMessage.type === "error" &&
                                                        <AlertMessage type="error">{alertMessage.message}</AlertMessage>
                                                    }
                                                </div>
                                                <div className="btn-wrapper">
                                                    <Button className="confirm-yes" onClick={(e) => {deleteJob(job.id), e.stopPropagation()}}>
                                                        {isLoadingJobDelete
                                                            ? <SpinLoader/>
                                                            : "Oui"
                                                        }
                                                    </Button>
                                                    <Button className="confirm-no" onClick={() => closeDelete()}>Non</Button>
                                                </div>
                                            </>
                                        : 
                                            <>
                                                <Button className="confirm-delete" onClick={(e) => {confirmDelete(index); e.stopPropagation()}}>Supprimer</Button>
                                                <Button className="btn-primary" onClick={() => openEditJob(job.id)}>Modifier</Button>
                                            </>
                                    }
                                </div>
                            </article>
                            ))}
                    </section>
                : <p>Il n'y à actuellement aucun métier en ligne.</p>
            }

            { isModalEditJobOpen && 
                <ModalEditJob
                    isModalOpen={isModalEditJobOpen}
                    closeModal={closeEditJob} 
                    selectedJob={selectedJob}
                />
            }
            { isModalAddJobOpen && 
                <ModalAddJob
                    isModalOpen={isModalAddJobOpen}
                    closeModal={closeAddJob} 
                />
            }
        </div>
    );
}

export default JobsTab;