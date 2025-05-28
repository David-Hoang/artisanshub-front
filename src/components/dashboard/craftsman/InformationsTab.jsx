import './InformationsTab.scss';
import axios from 'axios'
import {useContext, useState} from 'react';

import DefaultCraftsman from '../../../assets/img/default-craftsman.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'

import { ApiServicesContext } from "../../../context/ApiServicesContext.jsx";

import Button from "../../ui/Button.jsx";
import Input from "../../ui/Input.jsx";
import TextArea from "../../ui/TextArea.jsx";
import Switch from "../../ui/Switch.jsx";
import Select from "../../ui/Select.jsx";
import SelectJobs from "../../ui/SelectJobs.jsx";
import AlertMessage from "../../AlertMessage.jsx";
import SpinLoader from "../../ui/SpinLoader.jsx";


function InformationsTab({userDatas, token}) {
    
    const apiBase = import.meta.env.VITE_MAIN_API_URI;
    
    const {jobsCategories, regions} = useContext(ApiServicesContext);

    //To manage loading spinner
    const [isLoadingUserInfos, setIsLoadingUserInfos] = useState(false);
    const [isLoadingUserPassword, setIsLoadingUserPassword] = useState(false);
    const [isLoadingCraftsman, setIsLoadingCraftsman] = useState(false);
    const [isLoadingUserPicture, setIsLoadingUserPicture] = useState(false);

    const defaultAlertMessage = {type : "", message : "", context : ""};
    const defaultErrorForm = {
        first_name : "",
        last_name : "",
        username : "",
        email : "",
        phone : "",
        city : "",
        region : "",
        zipcode : "",
        
        password : "",
        new_password : "",
        new_password_confirmation : "",

        price : "",
        description : "",
        available : "",
        craftsman_job_id : "",
        gallery : "",

        img_title : "",
        profile_picture : ""
    };

    const defaultPasswordForm = {
        password : "",
        new_password : "",
        new_password_confirmation : "",
    };

    const [alertMessage, setAlertMessage] = useState(defaultAlertMessage);
    const [errorInfosForm, setErrorInfosForm] = useState(defaultErrorForm);

    const [userInfosForm, setUserInfosForm] = useState({
        first_name : userDatas.first_name,
        last_name : userDatas.last_name,
        username : userDatas.username ?? "",
        phone : userDatas.phone,
        city : userDatas.city,
        region : userDatas.region,
        zipcode : userDatas.zipcode,
    })

    const [userPasswordForm, setUserPasswordForm] = useState(defaultPasswordForm);

    const [userCraftsmanForm, setUserCraftsmanForm] = useState({
        price : userDatas.craftsman?.price ?? "",
        description : userDatas.craftsman?.description ?? "",
        available : userDatas.craftsman?.available ?? false,
        craftsman_job_id : userDatas.craftsman?.craftsman_job_id,
        gallery : userDatas.craftsman?.gallery ?? []
    });

    const [userPictureForm, setUserPictureForm] = useState({
        img_path : userDatas.profile_img?.img_path ? `${apiBase}/storage/${userDatas.profile_img.img_path}` : DefaultCraftsman,
        img_title : userDatas.profile_img?.img_title ?? "",
        profile_picture : null,
    });

    const handleSubmitUserInfos = async (e) => {
        e.preventDefault();

        // Reset errors message
        setAlertMessage(defaultAlertMessage);
        setErrorInfosForm(defaultErrorForm);

        setIsLoadingUserInfos(true);

        //Validation : Get userInfosForm and return object of error if no value in input
        const validateUserInfosInputs = Object.entries(userInfosForm).reduce((acc, [key, value]) => {
            const phoneRegex = /^0\d{9}$/;
            const zipcodeRegex = /^\d{5}$/;

            if (!value) {
                switch (key) {
                    case "first_name":
                        acc[key] = "Veuillez renseigner votre prénom.";
                        break;
                    case "last_name":
                        acc[key] = "Veuillez renseigner votre nom.";
                        break;
                    case "phone":
                        acc[key] = "Veuillez renseigner votre téléphone.";
                        break;
                    case "city":
                        acc[key] = "Veuillez renseigner votre ville.";
                        break;
                    case "region":
                        acc[key] = "Veuillez sélectionner votre région.";
                        break;
                    case "zipcode":
                        acc[key] = "Veuillez renseigner votre code postal.";
                        break;
                    default:
                        break;
                }
            } else if (value.length > 255) {
                switch (key) {
                    case "first_name":
                        acc[key] = "Le prénom ne doit pas dépasser 255 caractères.";
                        break;
                    case "last_name":
                        acc[key] = "Le nom ne doit pas dépasser 255 caractères.";
                        break;
                    case "username":
                        acc[key] = "Votre pseudo ne doit pas dépasser les 255 caractères.";
                        break;
                    case "city":
                        acc[key] = "Votre nom de ville ne doit pas dépasser les 255 caractères.";
                        break;
                    default:
                        break;
                }
            } else {
                switch (key) {
                    case "phone":
                        if (!phoneRegex.test(value)) {
                            acc[key] = "Le numéro de téléphone doit commencer par 0 et contenir 10 chiffres.";
                        }
                        break;
                    case "zipcode":
                        if (!zipcodeRegex.test(value)) {
                            acc[key] = "Le code postal doit être composé de 5 chiffres.";
                        }
                        break;
                    default:
                        break;
                }
            }
            return acc;
        }, {});

        // Check if there is at least 1 error
        if(Object.keys(validateUserInfosInputs).length > 0){
            setErrorInfosForm(validateUserInfosInputs);
            setIsLoadingUserInfos(false);
            return;
        }

        try {
            const updateUserInfos = await axios.patch(apiBase + "/api/me/update", 
                userInfosForm,
                { headers: {
                    "Authorization": "Bearer " + token,
                }
            });

            if(updateUserInfos.status === 200) {
                setAlertMessage({...alertMessage, type : "success", message : "Vos informations ont été mises à jour.", context : "user-infos"});
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
                setAlertMessage({...alertMessage, type : "error", message : "Une erreur est survenue durant la mise à jour de vos informations.", context : "user-infos"})
            }
        } finally {
            setIsLoadingUserInfos(false);
        }
    }

    const handleSubmitUserPassword = async (e) => {
        e.preventDefault();

        // Reset errors message
        setAlertMessage(defaultAlertMessage);
        setErrorInfosForm(defaultErrorForm);

        setIsLoadingUserPassword(true);
        
        //Validation : Get userPasswordForm and return object of error if no value in input
        const validateUserPasswordInputs = Object.entries(userPasswordForm).reduce((acc, [key, value]) => {

            if (!value) {
                switch (key) {
                    case "password":
                        acc[key] = "Veuillez renseigner un mot de passe.";
                        break;
                    case "new_password":
                        acc[key] = "Veuillez renseigner le nouveau mot de passe.";
                        break;
                    case "new_password_confirmation":
                        acc[key] = "Veuillez confirmer votre nouveau mot de passe.";
                        break;
                    default:
                        break;
                }
            }
            return acc;
        }, {});

        // Check if there is at least 1 error
        if(Object.keys(validateUserPasswordInputs).length > 0){
            setErrorInfosForm(validateUserPasswordInputs);
            setIsLoadingUserPassword(false);
            return;
        }

        try {
            const updateUserPassword = await axios.patch(apiBase + "/api/me/update-password", 
                userPasswordForm,
                { headers: {
                    "Authorization": "Bearer " + token,
                }
            });

            if(updateUserPassword.status === 200) {
                setAlertMessage({...alertMessage, type : "success", message : "Le mot de passe a été mis à jour avec succès.", context : "user-password"});
                setUserPasswordForm(defaultPasswordForm);
            }
        } catch (error) {
            
            if (!error.response) return setAlertMessage({...alertMessage, type : "error", message : "Une erreur est survenue durant la mise à jour de votre mot de passe", context : "user-password"})
            
            const { status, data } = error.response;
            
            if(status === 401){
                setErrorInfosForm({...errorInfosForm, password : "Le mot de passe actuel est incorrect."})
            }else if(status === 422){

                // Convert the error into an object
                const getErrors = Object.entries(data.errors).reduce((validateError, validate) => {
                    validateError[validate[0]] = validate[1][0];
                    return validateError;
                }, {})

                setErrorInfosForm(getErrors);
            } else {
                setAlertMessage({...alertMessage, type : "error", message : "Une erreur est survenue durant la mise à jour de votre mot de passe", context : "user-password"})
            }
        } finally {
            setIsLoadingUserPassword(false);
        }
    }

    const handleSubmitUserCraftsmanInfos = async (e) => {
        e.preventDefault();

        console.log(userCraftsmanForm);
        
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
                    "Authorization": "Bearer " + token,
                }
            });

            if(updateCraftsmanInfos.status === 200) {
                setAlertMessage({...alertMessage, type : "success", message : "Vos informations ont été mises à jour avec succès.", context : "craftsman-infos"});
            }else if (updateCraftsmanInfos.status === 201) {
                setAlertMessage({...alertMessage, type : "success", message : "Vos informations ont été ajouté avec succès.", context : "craftsman-infos"});
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
                setAlertMessage({...alertMessage, type : "error", message : "Une erreur est survenue durant la mise à jour de vos informations.", context : "craftsman-infos"})
            }
        } finally {
            setIsLoadingCraftsman(false);
        }

    }

    const handleSubmitUserPicture = async (e) => {
        e.preventDefault()

        setAlertMessage(defaultAlertMessage);
        setErrorInfosForm(defaultErrorForm);

        setIsLoadingUserPicture(true);

        //Validation : Get userPasswordForm and return object of error if no value in input
        if(userPictureForm.img_title.length > 255){
            setErrorInfosForm({...errorInfosForm, img_title : "Le nom ne peut pas dépasser 255 caractères."});
        }

        if(userPictureForm.profile_picture){

        }

        //Validation : Get userPasswordForm and return object of error if no value in input
        const validateUserPictureInputs = Object.entries(userPictureForm).reduce((acc, [key, value]) => {

            if (key === "img_title" && value.length > 255) {
                acc[key] = "Le nom ne peut pas dépasser 255 caractères.";
            }

            if(key === "profile_picture" && value?.type ) {
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
        if(Object.keys(validateUserPictureInputs).length > 0){
            setErrorInfosForm(validateUserPictureInputs);
            setIsLoadingUserPicture(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('img_title', userPictureForm.img_title);
            
            if(userPictureForm.profile_picture){
                formData.append('profile_picture', userPictureForm.profile_picture);
            }

            const updateUserPicture = await axios.post(apiBase + "/api/user-profile-picture", 
                formData,
                { headers: {
                    "Authorization": "Bearer " + token,
                }
            });

            if(updateUserPicture.status === 200) { 
                setAlertMessage({...alertMessage, type : "success", message : "Votre photo de profil et son titre ont bien été enregistrés !", context : "user-picture"});
                setUserPictureForm({...userPictureForm, profile_picture : null});
            }else if (updateUserPicture.status === 201) {
                setAlertMessage({...alertMessage, type : "success", message : "Votre photo de profil et son titre ont bien été ajouté avec succès !", context : "user-picture"});
                setUserPictureForm({userPictureForm, profile_picture : null});
            }

        } catch (error) {
            
            if (!error.response) return setAlertMessage({...alertMessage, type : "error", message : "Une erreur est survenue durant la mise à jour de votre photo de profil et son titre.!", context : "user-picture"})
            
            const { status, data } = error.response;
            
            if(status === 422){
                // Convert the error into an object
                const getErrors = Object.entries(data.errors).reduce((validateError, validate) => {
                    validateError[validate[0]] = validate[1][0];
                    return validateError;
                }, {})
                setErrorInfosForm(getErrors);
            } else {
                setAlertMessage({...alertMessage, type : "error", message : "Une erreur est survenue durant la mise à jour de votre photo de profil et son titre.", context : "user-picture"})
            }
        } finally {
            setIsLoadingUserPicture(false);
        }
    }
    
    // If user upload a picture, he can remove and it will back to the old picture
    const removePicture = () => {
        setUserPictureForm({
            ...userPictureForm,
            img_path : userDatas.profile_img?.img_path ? `${apiBase}/storage/${userDatas.profile_img.img_path}` : DefaultCraftsman,
            profile_picture : null
        })
    }

    return ( 
        <div className="informations-tab-craftsman">

            <form onSubmit={handleSubmitUserInfos} className="user-infos-form">
                <h2>Informations utilisateur</h2>
                <div className="user-infos-input">

                    <div className="wrapper">
                        <Input label="Nom*" id="last_name" placeholder="Doe" type="text" autoComplete="off" maxLength={255}
                            value={userInfosForm.last_name}
                            onChange={(e) => setUserInfosForm({...userInfosForm, last_name : e.target.value})}
                            />
                        {errorInfosForm.last_name && <AlertMessage type="error">{errorInfosForm.last_name}</AlertMessage>}
                    </div>
                    
                    <div className="wrapper">
                        <Input label="Prénom*" id="first_name" placeholder="John" type="text" autoComplete="off" maxLength={255}
                            value={userInfosForm.first_name}
                            onChange={(e) => setUserInfosForm({...userInfosForm, first_name : e.target.value})}
                            />
                        {errorInfosForm.first_name && <AlertMessage type="error">{errorInfosForm.first_name}</AlertMessage>}
                    </div>

                    <div className="wrapper">
                        <Input label="Pseudo" id="username" placeholder="johndoe123" type="text" autoComplete="off" maxLength={255}
                            value={userInfosForm.username}
                            onChange={(e) => setUserInfosForm({...userInfosForm, username : e.target.value})}
                        />
                        {errorInfosForm.username && <AlertMessage type="error">{errorInfosForm.username}</AlertMessage>}
                    </div>
        
                    <div className="wrapper">
                        <Input label="Téléphone*" id="phone" type="phone" pattern="^0\d{9}$" maxLength={10} placeholder="0612345678"
                            value={userInfosForm.phone}
                            onChange={(e) => setUserInfosForm({...userInfosForm, phone : e.target.value})}
                            />
                        {errorInfosForm.phone && <AlertMessage type="error">{errorInfosForm.phone}</AlertMessage>}
                    </div>

                    <div className="wrapper">
                        <Input label="Ville*" id="city" placeholder="Bordeaux" type="text" maxLength={255}
                            value={userInfosForm.city}
                            onChange={(e) => setUserInfosForm({...userInfosForm, city : e.target.value})}
                            />
                        {errorInfosForm.city && <AlertMessage type="error">{errorInfosForm.city}</AlertMessage>}
                    </div>
                    
                    <div className="wrapper">
                        <Input label="Code postal*" id="zipcode" type="text" pattern="^\d{5}$" placeholder="33000" maxLength={5}
                            value={userInfosForm.zipcode}
                            onChange={(e) => setUserInfosForm({...userInfosForm, zipcode : e.target.value})}
                            />
                        {errorInfosForm.zipcode && <AlertMessage type="error">{errorInfosForm.zipcode}</AlertMessage>}
                    </div>
                </div>
                <div>
                    <Select 
                        label="Region*"
                        id="region"
                        placeholder="Sélectionnez votre région"
                        datas={regions}
                        value={userInfosForm.region}
                        onChange={(e) => { setUserInfosForm({...userInfosForm, region : e.target.value}) }}/>
                    {errorInfosForm.region && <AlertMessage type="error">{errorInfosForm.region}</AlertMessage>}
                </div>
                
                <Button type="submit" className="btn-primary">
                    {isLoadingUserInfos ? (
                        <SpinLoader />
                    ): (
                        <>
                            Sauvegarder
                        </>
                    )}
                </Button>

                {(alertMessage.context === "user-infos" && alertMessage.message) && alertMessage.type === "success" &&
                    <AlertMessage type="success">{alertMessage.message}</AlertMessage>
                }
                {(alertMessage.context === "user-infos" && alertMessage.message) && alertMessage.type === "error" &&
                    <AlertMessage type="error">{alertMessage.message}</AlertMessage>
                }
            </form>

            <form onSubmit={handleSubmitUserPassword} className="user-password-form">
                <h2>Mot de passe</h2>
                <div className="user-password-input">

                    <div className="wrapper">
                        <Input label="Mot de passe actuel*" id="password" type="password" autoComplete="off" minLength={8}
                            value={userPasswordForm.password}
                            onChange={(e) => setUserPasswordForm({...userPasswordForm, password : e.target.value})}
                            />
                        {errorInfosForm.password && <AlertMessage type="error">{errorInfosForm.password}</AlertMessage>}
                    </div>
                    <div className="wrapper">
                        <Input label="Nouveau mot de passe*" id="new_password" type="password" autoComplete="off" minLength={8}
                            value={userPasswordForm.new_password}
                            onChange={(e) => setUserPasswordForm({...userPasswordForm, new_password : e.target.value})}
                            />
                        {errorInfosForm.new_password && <AlertMessage type="error">{errorInfosForm.new_password}</AlertMessage>}
                    </div>
                    <div className="wrapper">
                        <Input label="Confirmer nouveau mot de passe*" id="new_password_confirmation" type="password" autoComplete="off" minLength={8}
                            value={userPasswordForm.new_password_confirmation}
                            onChange={(e) => setUserPasswordForm({...userPasswordForm, new_password_confirmation : e.target.value})}
                            />
                        {errorInfosForm.new_password_confirmation && <AlertMessage type="error">{errorInfosForm.new_password_confirmation}</AlertMessage>}
                    </div>
                </div>

                <Button type="submit" className="btn-primary">
                    {isLoadingUserPassword ? (
                        <SpinLoader />
                    ): (
                        <>
                            Sauvegarder
                        </>
                    )}
                </Button>

                {(alertMessage.context === "user-password" && alertMessage.message) && alertMessage.type === "success" &&
                    <AlertMessage type="success">{alertMessage.message}</AlertMessage>
                }
                {(alertMessage.context === "user-password" && alertMessage.message) && alertMessage.type === "error" &&
                    <AlertMessage type="error">{alertMessage.message}</AlertMessage>
                }
            </form>

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

                {(alertMessage.context === "craftsman-infos" && alertMessage.message) && alertMessage.type === "success" &&
                    <AlertMessage type="success">{alertMessage.message}</AlertMessage>
                }
                {(alertMessage.context === "craftsman-infos" && alertMessage.message) && alertMessage.type === "error" &&
                    <AlertMessage type="error">{alertMessage.message}</AlertMessage>
                }
            </form>
            
            <form onSubmit={handleSubmitUserPicture} className="user-picture-form">
                <h2>Photo de profil</h2>
                <div className="user-picture-wrapper">
                    <div className="picture-wrapper">
                        <div className="input-file-wrapper">
                            <label htmlFor="profile_picture">
                                <FontAwesomeIcon icon={faPlus} />
                            </label>
                            <input type="file" name="profile_picture" id="profile_picture"
                                accept="image/png, image/jpeg, image/jpg, image/webp"
                                onChange={(e) => setUserPictureForm({
                                            ...userPictureForm,
                                            img_path : URL.createObjectURL(e.target.files[0]),
                                            profile_picture : e.target.files[0]
                                        })
                                    }/>
                            <img src={userPictureForm.img_path} alt={userPictureForm.img_title ?? ""} className="profile-picture"/>
                        </div>
                        {userPictureForm.profile_picture &&
                            <button type="button" className="button-delete-picture"
                                onClick={removePicture}>
                                <FontAwesomeIcon icon={faTrash}/>
                            </button>
                        }
                    </div>
                    
                    
                    {errorInfosForm.profile_picture && 
                        <div>
                            <AlertMessage type="error">{errorInfosForm.profile_picture}</AlertMessage>
                        </div>
                    }

                    <div className="wrapper">
                        <Input label="Nom de l'image (facultatif)" id="img_title" type="text"
                            value={userPictureForm.img_title}
                            onChange={(e) => setUserPictureForm({...userPictureForm, img_title : e.target.value})}
                            />
                        {errorInfosForm.img_title && <AlertMessage type="error">{errorInfosForm.img_title}</AlertMessage>}
                    </div>
                </div>

                <Button type="submit" className="btn-primary">
                    {isLoadingUserPicture ? (
                        <SpinLoader />
                    ): (
                        <>
                            Sauvegarder
                        </>
                    )}
                </Button>
                
                {(alertMessage.context === "user-picture" && alertMessage.message) && alertMessage.type === "success" &&
                    <AlertMessage type="success">{alertMessage.message}</AlertMessage>
                }
                {(alertMessage.context === "user-picture" && alertMessage.message) && alertMessage.type === "error" &&
                    <AlertMessage type="error">{alertMessage.message}</AlertMessage>
                }
            </form>
        </div>
    );
}

export default InformationsTab;