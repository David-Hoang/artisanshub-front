import "./ModalEditJob.scss";
import { useState, useEffect, useContext, useRef } from 'react';
import axios from "axios";
import { AuthContext } from "../../../../../../context/AuthContext";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';

import Input from "../../../../../../components/ui/Input";
import TextArea from "../../../../../../components/ui/TextArea";
import Modal from "../../../../../../components/ui/Modal";
import Button from "../../../../../../components/ui/Button";
import SpinLoader from "../../../../../../components/ui/SpinLoader";
import AlertMessage from "../../../../../../components/AlertMessage";
import { JobsContext } from "../../../../context/JobsContext";

function ModalEditJob({isModalOpen, closeModal, selectedJob}) {
    
    const apiBase = import.meta.env.VITE_MAIN_API_URI;
    const { userToken } = useContext(AuthContext);
    const { fetchJobs } = useContext(JobsContext);

    const fileInputRef = useRef(null);
    
    const [isLoadingJobDatas, setIsLoadingJobDatas] = useState(false);
    const [isLoadingEdit, setIsLoadingEdit] = useState(false);
    const [editJobForm, setEditJobForm] = useState({});

    const fetchSingleJob = async (jobId) => {
        setIsLoadingJobDatas(true);
        try {
            const response = await axios.get(`${apiBase}/api/admin/jobs/${jobId}`, {
                headers: {
                    "Authorization": "Bearer " + userToken,
                }
            })
            const {data} = response;
            
            setEditJobForm({
                name : data.name,
                img_path : data.img_path,
                img_title : data.img_title,
                description : data.description,
                job_picture: null,
                remove_img : 0 // to know if user want to delete img
            });

        } catch (error) {
            console.log(error);
        } finally {
            setIsLoadingJobDatas(false)
        }
    }
    
    useEffect(() => {
        fetchSingleJob(selectedJob);
    }, []);

    const defaultAlertMessage = {type : "", message : ""};
    const [alertMessage, setAlertMessage] = useState(defaultAlertMessage);

    const defaultErrorEditJobForm = {
        name : "",
        description : "",
        img_path : "",
        img_title: ""
    };

    const [errorEditJobForm, setErrorEditJobForm] = useState(defaultErrorEditJobForm);

    const handleEditJob = async (e) => {
        e.preventDefault();
        
        setIsLoadingEdit(true);
        setAlertMessage(defaultAlertMessage);
        setErrorEditJobForm(defaultErrorEditJobForm);

        //Validation : Get userClientForm and return object of error if no value in input
        const validateEditJob = Object.entries(editJobForm).reduce((acc, [key, value]) => {
            if (!value) {
                if(key === 'name'){
                    acc[key] = "Veuillez renseigner le nom du métier.";
                }
            }

            if (value?.length > 255) {
                switch (key) {
                case "name":
                    acc[key] = "Le nom du métier ne doit pas dépasser 255 caractères.";
                    break;
                case "img_title":
                    acc[key] = "Le nom de l'image ne doit pas dépasser 255 caractères.";
                    break;
                default:
                    break;
                }
            }

            if (key === "description") { 
                if(value?.length > 65535) { //longText type in database
                    acc[key] = "La description ne doit pas dépasser 65 535 caractères.";
                }
            }

            if(key === "job_picture" && value?.type ) {
                const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
                const maxSize = 3 * 1024 * 1024; // 3Mo

                if(value.size > maxSize) {
                    acc[key] = "Le volume du fichier est trop grand, maximum 3 Mo.";
                }

                if(!allowedTypes.includes(value.type)){
                    acc[key] = "L'extension du fichier ne peut être autre que du PNG, JPEG, JPG ou WEBP";
                }
            }

            return acc;
        }, {});

        // Check if there is at least 1 error
        if(Object.keys(validateEditJob).length > 0){
            setErrorEditJobForm(validateEditJob);
            setIsLoadingEdit(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', editJobForm.name);
            formData.append('remove_img', editJobForm.remove_img);

            if (editJobForm.description) formData.append('description', editJobForm.description);
            if (editJobForm.img_title) formData.append('img_title', editJobForm.img_title);
            if (editJobForm.job_picture) formData.append('image', editJobForm.job_picture);
            
            formData.append('_method', 'PATCH');
        
            const updateJob = await axios.post(`${apiBase}/api/admin/job/${selectedJob}/update`,
                formData,
                { headers: {
                    "Authorization": "Bearer " + userToken,
                }});

            if(updateJob.status === 200) {
                setAlertMessage({...alertMessage, type : "success", message : "Le métier a été mise à jour avec succès !"});
                fetchSingleJob(selectedJob);
                fetchJobs();
            }
                
        } catch (error) {
            const { status, data } = error.response;

            if(status === 422){
                // Convert the error into an object
                const getErrors = Object.entries(data.errors).reduce((validateError, validate) => {
                    validateError[validate[0]] = validate[1][0];
                    return validateError;
                }, {})

                setErrorEditJobForm(getErrors);
            } else {
                setAlertMessage({...alertMessage, type : "error", message : "Une erreur est survenue durant la mise à jour de vos informations."})
            }
        } finally {
            setIsLoadingEdit(false);
        }
    }

        // If admin upload a picture, he can remove and it will back to the old picture
    const removePicture = () => {
        setErrorEditJobForm(defaultErrorEditJobForm);
        setEditJobForm({
            ...editJobForm,
            img_path : undefined,
            job_picture : null,
            remove_img: 1
        })
    }
    
    return ( 
        <Modal isOpen={isModalOpen} closeModal={closeModal} className="edit-job">
            <div className="modal-header">
                <div className="icon-edit-job">
                    <FontAwesomeIcon icon={faPenToSquare} />
                </div>
                <h3>
                    Modifier le métier
                </h3>
            </div>

            {isLoadingJobDatas
            ? <SpinLoader className="loading-job" />
            : 
                <>
                    <form onSubmit={handleEditJob} className="edit-job-form">
                        <div className="wrapper">

                            <Input label="Nom du métier *" id="name" placeholder="Plombier" type="text" autoComplete="off"
                                value={editJobForm.name ?? ""} onChange={(e) => setEditJobForm({...editJobForm, name : e.target.value})}
                                />

                            {errorEditJobForm.name && <AlertMessage type="error">{errorEditJobForm.name}</AlertMessage>}
                        </div>

                        <div className="wrapper">  
                            <TextArea
                                id="description"
                                label="Description" 
                                placeholder="Un petit paragraphe présentant le métier..."
                                rows="6"
                                value={editJobForm.description ?? ""}
                                onChange={(e) => setEditJobForm({...editJobForm, description : e.target.value})}
                            />
                            {errorEditJobForm.description && <AlertMessage type="error">{errorEditJobForm.description}</AlertMessage>}
                        </div>

                        <div className="job-picture-wrapper">
                            <div className="picture-wrapper">
                                {editJobForm.img_path && 
                                    <img src={editJobForm.job_picture ? editJobForm.img_path : `${apiBase}/storage/${editJobForm.img_path}`} alt={editJobForm.img_title ?? ""} className="job-picture"/>
                                }

                                <input ref={fileInputRef}
                                    type="file" name="job_picture" id="job_picture" 
                                    accept="image/png, image/jpeg, image/jpg, image/webp"
                                    onChange={(e) => setEditJobForm({
                                                ...editJobForm,
                                                img_path : URL.createObjectURL(e.target.files[0]),
                                                job_picture : e.target.files[0],
                                                remove_img : 0
                                            })}
                                />
                            </div>
                            <div className="picture-buttons">
                                <Button type="button" className="btn btn-secondary button-add-job-picture"
                                    onClick={() => fileInputRef.current.click()}>
                                    {editJobForm.img_path 
                                        ? "Changer de photo"
                                        : "Ajouter une photo"
                                    }
                                </Button>

                                {editJobForm.img_path &&
                                    <Button type="button" className="btn button-delete-picture"
                                        onClick={removePicture}>
                                        Supprimer
                                    </Button>
                                }
                            </div>
                        </div>
                        
                        {errorEditJobForm.job_picture && 
                            <div>
                                <AlertMessage type="error">{errorEditJobForm.job_picture}</AlertMessage>
                            </div>
                        }

                        <div className="wrapper">
                            <Input label="Nom de l'image" id="img_title" placeholder="Personne réparant un tuyau" type="text" autoComplete="off"
                                value={editJobForm.img_title ?? ""} onChange={(e) => setEditJobForm({...editJobForm, img_title : e.target.value})}
                                />

                            {errorEditJobForm.img_title && <AlertMessage type="error">{errorEditJobForm.img_title}</AlertMessage>}
                        </div>

                        <div className="btn-wrapper">
                            <Button type="button" className="btn btn-secondary"
                                onClick={() => closeModal()}>
                                Fermer
                            </Button>
                            <Button type="submit" className="btn btn-primary">
                                {isLoadingEdit ? (
                                    <SpinLoader />
                                ): (
                                    <>
                                        Sauvegarder
                                    </>
                                )}
                            </Button>
                        </div>
                        
                        {alertMessage.message && alertMessage.type === "success" &&
                            <AlertMessage type="success">{alertMessage.message}</AlertMessage>
                        }
                        {alertMessage.message && alertMessage.type === "error" &&
                            <AlertMessage type="error">{alertMessage.message}</AlertMessage>
                        }
                    </form>
                </>
            }
        </Modal>
    );
}

export default ModalEditJob;