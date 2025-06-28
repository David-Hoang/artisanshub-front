import "./CraftsmanInfosForm.scss"
import {useContext, useState} from 'react';
import axios from 'axios'

import { ApiServicesContext } from "../../../../../context/ApiServicesContext.jsx";
import { AuthContext } from "../../../../../context/AuthContext.jsx";

import SelectJobs from "../../../../../components/ui/SelectJobs.jsx";
import Input from "../../../../../components/ui/Input.jsx";
import Switch from "../../../../../components/ui/Switch.jsx";
import TextArea from "../../../../../components/ui/TextArea.jsx";
import Button from "../../../../../components/ui/Button.jsx";
import AlertMessage from "../../../../../components/AlertMessage.jsx";
import SpinLoader from "../../../../../components/ui/SpinLoader.jsx";

import CraftsmanGallery from "./CraftsmanGallery.jsx";

function CraftsmanInfosForm() {

    const apiBase = import.meta.env.VITE_MAIN_API_URI;
    const {jobsCategories} = useContext(ApiServicesContext);
    const {userDatas, userToken, reFetchUserDatas} = useContext(AuthContext)

    const [userCraftsmanForm, setUserCraftsmanForm] = useState({
        price : userDatas.craftsman?.price ?? "",
        description : userDatas.craftsman?.description ?? "",
        available : userDatas.craftsman?.available ?? 0,
        craftsman_job_id : userDatas.craftsman?.craftsman_job_id,
        gallery : userDatas.craftsman?.gallery ?? []
    });

    const [galleryToForm, setGalleryToForm] = useState([]); //state for gallery to send 
    
    const [resetPreview, setResetPreview] = useState(0);

    const defaultErrorForm = {
        price : "",
        description : "",
        available : "",
        craftsman_job_id : "",
        preview_gallery : "",
        craftsman_gallery : ""
    };
    const [errorInfosForm, setErrorInfosForm] = useState(defaultErrorForm);
    const [isLoadingCraftsman, setIsLoadingCraftsman] = useState(false);

    const defaultAlertMessage = {type : "", message : ""};
    const [alertMessage, setAlertMessage] = useState(defaultAlertMessage);

    // alert message for gallery
    const [alertGallery, setAlertGallery] = useState(defaultAlertMessage);

    const handleSubmitUserCraftsmanInfos = async (e) => {
        e.preventDefault();

        //using same variable to reset error
        setAlertMessage(defaultAlertMessage);
        setAlertGallery(defaultAlertMessage);

        setErrorInfosForm(defaultErrorForm);

        setIsLoadingCraftsman(true);

        //validate gallery
        let validateImgFile;
        const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
        const maxSize = 3 * 1024 * 1024; // 3Mo


        for(let i = 0; i < galleryToForm.length; i++){

            if (!allowedTypes.includes(galleryToForm[i].type)) {
                validateImgFile = {type: "error",message: "Veuillez téléverser uniquement des images aux formats autorisés (JPG, PNG, WEBP)."};
                break;
            }
            if (galleryToForm[i].size > maxSize) {
                validateImgFile = {type: "error",message: "Un des fichiers est trop grand, maximum par fichier : 3 Mo."};
                break;
            }
        }

         //Validation : Get userInfosForm and return object of error if no value in input
        const validateUserCraftsmanInputs = Object.entries(userCraftsmanForm).reduce((acc, [key, value]) => {

            if(key === "craftsman_job_id"){
                if(!value){
                    acc[key] = "Veuillez sélectionner votre activité.";
                    return acc ;
                }
            }

            if(key === "available"){
                if(value === undefined){
                    acc[key] = "Veuillez sélectionner votre activité.";
                    return acc;
                }
            }

            if (key === "price") {
                if (value !== '' && (isNaN(parseFloat(value)) || parseFloat(value) < 0 || parseFloat(value) > 99999999.99)) {
                    acc[key] = "Le prix doit être un nombre entre 0 et 99 999 999,99.";
                    return acc;
                }
            }

            if (key === "description") { 
                if(value.length > 65535) { //longText type in database
                    acc[key] = "La description ne doit pas dépasser 65 535 caractères.";
                    return acc;
                }
            }
            return acc;
        }, {});

        // Check if there is at least 1 error
        if(Object.keys(validateUserCraftsmanInputs).length > 0){
            setErrorInfosForm(validateUserCraftsmanInputs);
            setIsLoadingCraftsman(false);
            return;
        }

        // Check if there is at least 1 error in array gallery
        if(validateImgFile) {
            setAlertMessage(validateImgFile);
            setIsLoadingCraftsman(false);
            return;
        }

        try {
            const formData = new FormData();

            formData.append('price',userCraftsmanForm.price);
            formData.append('description',userCraftsmanForm.description);
            formData.append('available',userCraftsmanForm.available == true ? 1 : 0);
            formData.append('craftsman_job_id',userCraftsmanForm.craftsman_job_id);

            if(galleryToForm.length > 0){
                galleryToForm.forEach(file =>{
                    formData.append('gallery[]', file)}
                )
            }

            const updateCraftsmanInfos = await axios.post(apiBase + "/api/craftsman-infos", 
                formData,
                { headers: {
                    "Authorization": "Bearer " + userToken,
                }
            });

            if (updateCraftsmanInfos.status === 200 || updateCraftsmanInfos.status === 201) {
                setAlertMessage({ 
                    type: "success", 
                    message: updateCraftsmanInfos.status === 200 
                        ? "Vos informations ont été mises à jour avec succès." 
                        : "Vos informations ont été ajoutées avec succès." 
                });

                // trigger gallery component render
                setResetPreview(prev => prev + 1);
                setGalleryToForm([]);

                reFetchUserDatas()
            }

        } catch (error) {

            const { status, data } = error.response;

            if(status === 422){

                // Convert the error into an object
                const getErrors = Object.entries(data.errors).reduce((validateError, validate) => {
                    validateError[validate[0]] = validate[1][0];
                    return validateError;
                }, {})

                setErrorInfosForm(getErrors);
            } else if (status === 413) {
                setAlertMessage({...alertMessage, type : "error", message : "Le volume total de toutes les photos est trop grand, veuillez en supprimer."})

            } else {
                setAlertMessage({...alertMessage, type : "error", message : "Une erreur est survenue durant la mise à jour de vos informations."})
            }
        } finally {
            setIsLoadingCraftsman(false);
        }

    }

    return ( 
        <form onSubmit={handleSubmitUserCraftsmanInfos} className="craftsman-infos-form">
            <div className="craftsman-infos-header">
                <h2>Informations sur votre activité</h2>
                <h3>Renseignez les détails de votre activité. Ces informations seront visibles sur votre profil d'artisan.</h3>
            </div>

            <div className="craftsman-infos-input">

                <div className="wrapper">
                    <SelectJobs
                        label="Votre activité"
                        id="job"
                        placeholder="Sélectionnez votre activité"
                        datas={
                            jobsCategories.length > 1 ?
                            jobsCategories : 
                            null
                        }
                        value={userCraftsmanForm.craftsman_job_id}
                        onChange={(e) => setUserCraftsmanForm({...userCraftsmanForm, craftsman_job_id : parseInt(e.target.value)})}
                    />
                    {errorInfosForm.craftsman_job_id && <AlertMessage type="error">{errorInfosForm.craftsman_job_id}</AlertMessage>}
                </div>

                <div className="wrapper">
                    <Input label="Tarifs" symbol="€" id="price" placeholder="199.99" type="number" autoComplete="off"
                        value={userCraftsmanForm.price}
                        onChange={(e) => setUserCraftsmanForm({...userCraftsmanForm, price : e.target.value})}
                        />
                    {errorInfosForm.price && <AlertMessage type="error">{errorInfosForm.price}</AlertMessage>}
                </div>
                
                <div className="wrapper">
                    <Switch label="Disponibilité" id="available"
                        checked={userCraftsmanForm.available}
                        onChange={() => setUserCraftsmanForm({...userCraftsmanForm, available : !userCraftsmanForm.available})}
                        />
                    {errorInfosForm.available && <AlertMessage type="error">{errorInfosForm.available}</AlertMessage>}
                </div>
            </div>

            <div className="craftsman-description">
                <TextArea
                    label="Description"
                    id="description"
                    placeholder="Décrivez votre activité..."
                    rows="8"
                    value={userCraftsmanForm.description}
                    onChange={(e) => setUserCraftsmanForm({...userCraftsmanForm, description : e.target.value})}
                />
                {errorInfosForm.description && <AlertMessage type="error">{errorInfosForm.description}</AlertMessage>}
            </div>
            
            {/* Craftsman gallery */}
            <CraftsmanGallery
                galleryToForm={galleryToForm}
                setGalleryToForm={setGalleryToForm}
                alertGallery={alertGallery}
                setAlertGallery={setAlertGallery}
                resetPreview={resetPreview}
            />

            <Button type="submit" className="btn-primary">
                {isLoadingCraftsman ? (
                    <SpinLoader />
                ): (
                    <>
                        Sauvegarder
                    </>
                )}
            </Button>

            {alertMessage.message && alertMessage.type === "success" &&
                <AlertMessage type="success">{alertMessage.message}</AlertMessage>
            }
            {alertMessage.message && alertMessage.type === "error" &&
                <AlertMessage type="error">{alertMessage.message}</AlertMessage>
            }
        </form>
    );
}

export default CraftsmanInfosForm;