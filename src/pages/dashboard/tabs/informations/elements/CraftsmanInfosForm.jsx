import "./CraftsmanInfosForm.scss"
import {useContext, useState} from 'react';
import axios from 'axios'

import { ApiServicesContext } from "../../../../../context/ApiServicesContext";

import SelectJobs from "../../../../../components/ui/SelectJobs";
import Input from "../../../../../components/ui/Input";
import Switch from "../../../../../components/ui/Switch";
import TextArea from "../../../../../components/ui/TextArea";
import Button from "../../../../../components/ui/Button";
import AlertMessage from "../../../../../components/AlertMessage";
import SpinLoader from "../../../../../components/ui/SpinLoader";

function CraftsmanInfosForm({userDatas, userToken}) {

    const apiBase = import.meta.env.VITE_MAIN_API_URI;
    const {jobsCategories} = useContext(ApiServicesContext);
    
    const [userCraftsmanForm, setUserCraftsmanForm] = useState({
        price : userDatas.craftsman?.price ?? "",
        description : userDatas.craftsman?.description ?? "",
        available : userDatas.craftsman?.available ?? false,
        craftsman_job_id : userDatas.craftsman?.craftsman_job_id,
        gallery : userDatas.craftsman?.gallery ?? []
    });

    const defaultErrorForm = {
        price : "",
        description : "",
        available : "",
        craftsman_job_id : "",
        gallery : "",
    };
    const [errorInfosForm, setErrorInfosForm] = useState(defaultErrorForm);
    const [isLoadingCraftsman, setIsLoadingCraftsman] = useState(false);

    const defaultAlertMessage = {type : "", message : ""};
    const [alertMessage, setAlertMessage] = useState(defaultAlertMessage);

    const handleSubmitUserCraftsmanInfos = async (e) => {
        e.preventDefault();

        setAlertMessage(defaultAlertMessage);
        setErrorInfosForm(defaultErrorForm);

        setIsLoadingCraftsman(true);

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

        try {
            const updateCraftsmanInfos = await axios.post(apiBase + "/api/craftsman-infos", 
                userCraftsmanForm,
                { headers: {
                    "Authorization": "Bearer " + userToken,
                }
            });

            if(updateCraftsmanInfos.status === 200) {
                setAlertMessage({...alertMessage, type : "success", message : "Vos informations ont été mises à jour avec succès."});
            }else if (updateCraftsmanInfos.status === 201) {
                setAlertMessage({...alertMessage, type : "success", message : "Vos informations ont été ajouté avec succès."});
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

            <div className="craftsman-gallery">
                <label htmlFor="gallery">Galerie de photo</label>
                <input id="gallery" type="file" multiple 
                    accept="image/png, image/jpeg, image/jpg, image/webp"/>
                {userCraftsmanForm.gallery &&
                    userCraftsmanForm.gallery.map((img, key) => 
                        <p key={key}>{img.img_path}</p>
                    )
                }
            </div>

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