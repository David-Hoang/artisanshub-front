import "./ModalAddJob.scss";
import { useContext, useRef, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../../../../../context/AuthContext";
import { JobsContext } from "../../../../context/JobsContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import Modal from "../../../../../../components/ui/Modal";
import Input from "../../../../../../components/ui/Input";
import Button from "../../../../../../components/ui/Button";
import TextArea from "../../../../../../components/ui/TextArea";
import AlertMessage from "../../../../../../components/AlertMessage";
import SpinLoader from "../../../../../../components/ui/SpinLoader";

function ModalAddJob({ isModalOpen, closeModal }) {

    const apiBase = import.meta.env.VITE_MAIN_API_URI;
    const { userToken } = useContext(AuthContext);
    const { fetchJobs } = useContext(JobsContext);

    const fileInputRef = useRef(null);

    const [isLoadingAdd, setIsLoadingAdd] = useState(false);
    const [addJobForm, setAddJobForm] = useState({
        name : "",
        description : "",
        img_path : undefined,
        img_title : "",
        job_picture : ""
    })

    const defaultAlertMessage = {type : "", message : ""};
    const [alertMessage, setAlertMessage] = useState(defaultAlertMessage);
    
    const defaultErrorAddJobForm = {
        name : "",
        description : "",
        img_title : "",
        job_picture : "",
    }
    const [errorAddJobForm, setErrorAddJobForm] = useState(defaultErrorAddJobForm)

    const handleNewJob = async (e) => {
        e.preventDefault();

        setIsLoadingAdd(true);
        setAlertMessage(defaultAlertMessage);
        setErrorAddJobForm(defaultErrorAddJobForm);
        
        //Validation : Get userInfosForm and return object of error if no value in input
        const validateAddJob = Object.entries(addJobForm).reduce((acc, [key, value]) => {

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
        if(Object.keys(validateAddJob).length > 0){
            setErrorAddJobForm(validateAddJob);
            setIsLoadingAdd(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', addJobForm.name);
            formData.append('description', addJobForm.description);
            formData.append('image', addJobForm.job_picture);
            formData.append('img_title', addJobForm.img_title);

            const response = await axios.post(`${apiBase}/api/admin/jobs/new-job`,
                formData,
                { headers: {
                    "Authorization": "Bearer " + userToken,
                }});

                if(response.status === 201) {
                    setAlertMessage({...alertMessage, type : "success", message : "Nouveau métier ajouté !"});
                    
                    //refresh jobs list
                    fetchJobs();

                    //refresh inputs
                    setAddJobForm ({
                        name : "",
                        description : "",
                        img_path : undefined,
                        img_title : "",
                        job_picture : ""
                    })
                }
        } catch (error) {

            const { status, data } = error.response;

            if(status === 422){
                // Convert the error into an object
                const getErrors = Object.entries(data.errors).reduce((validateError, validate) => {
                    validateError[validate[0]] = validate[1][0];
                    return validateError;
                }, {})

                setErrorAddJobForm(getErrors);
            } else {
                setAlertMessage({...alertMessage, type : "error", message : "Une erreur est survenue durant l'ajout du métier."})
            }
        } finally {
            setIsLoadingAdd(false);
        }
    }

    // If admin upload a picture, he can remove and it will back to the old picture
    const removePicture = () => {
        setErrorAddJobForm(defaultErrorAddJobForm);
        setAddJobForm({
            ...addJobForm,
            img_path : undefined,
            job_picture : null
        })
    }

    return (
        <Modal isOpen={isModalOpen} closeModal={closeModal} className="add-job">
            <h3>
                <FontAwesomeIcon icon={faPlus} />
                Ajouter un nouveau métier
            </h3>
            <form onSubmit={handleNewJob} className="add-job-form">

                <div className="wrapper">

                    <Input label="Nom du métier *" id="name" placeholder="Plombier" type="text" autoComplete="off"
                        value={addJobForm.name} onChange={(e) => setAddJobForm({...addJobForm, name : e.target.value})}
                        />

                    {errorAddJobForm.name && <AlertMessage type="error">{errorAddJobForm.name}</AlertMessage>}
                </div>

                <div className="wrapper">
                    <TextArea
                        id="description"
                        label="Description" 
                        placeholder="Un petit paragraphe présentant le métier..."
                        rows="5"
                        autoComplete="off"
                        value={addJobForm.description}
                        onChange={(e) => setAddJobForm({...addJobForm, description : e.target.value})}
                    />
                    {errorAddJobForm.description && <AlertMessage type="error">{errorAddJobForm.description}</AlertMessage>}
                </div>

                <div className="job-picture-wrapper">
                    <div className="picture-wrapper">
                        {addJobForm.img_path && 
                            <>
                                <h4>Prévisualisation</h4>
                                <img src={addJobForm.img_path} alt={addJobForm.img_title ?? ""} className="job-picture"/>
                            </>
                        }

                        <input ref={fileInputRef}
                            type="file" name="job_picture" id="job_picture" 
                            accept="image/png, image/jpeg, image/jpg, image/webp"
                            onChange={(e) => setAddJobForm({
                                        ...addJobForm,
                                        img_path : URL.createObjectURL(e.target.files[0]),
                                        job_picture : e.target.files[0]
                                    })}
                        />
                    </div>
                    <div className="picture-buttons">
                        <Button type="button" className="btn btn-secondary button-add-job-picture"
                            onClick={() => fileInputRef.current.click()}>
                            Ajouter une photo
                        </Button>

                        {addJobForm.img_path &&
                            <Button type="button" className="btn button-delete-picture"
                                onClick={removePicture}>
                                Supprimer
                            </Button>
                        }
                    </div>
                </div>
                
                {errorAddJobForm.job_picture && 
                    <div>
                        <AlertMessage type="error">{errorAddJobForm.job_picture}</AlertMessage>
                    </div>
                }

                <div className="wrapper">
                    <Input label="Nom de l'image" id="img_title" placeholder="Personne réparant un tuyau" type="text" autoComplete="off"
                        value={addJobForm.img_title} onChange={(e) => setAddJobForm({...addJobForm, img_title : e.target.value})}
                        />

                    {errorAddJobForm.img_title && <AlertMessage type="error">{errorAddJobForm.img_title}</AlertMessage>}
                </div>

            
                
                <div className="btn-wrapper">
                    <Button type="button" className="btn btn-secondary"
                        onClick={() => closeModal()}>
                        Fermer
                    </Button>
                    <Button type="submit" className="btn-primary">
                        {isLoadingAdd ? (
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
        </Modal>
    );
}

export default ModalAddJob;
