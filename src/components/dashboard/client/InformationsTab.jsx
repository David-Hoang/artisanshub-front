import './InformationsTab.scss';
import axios from 'axios'
import {useContext, useState} from 'react';
import { useNavigate } from "react-router-dom";

import DefaultClient from '../../../assets/img/default-client.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'

import { ApiServicesContext } from "../../../context/ApiServicesContext.jsx";

import Button from "../../ui/Button.jsx";
import Input from "../../ui/Input.jsx";
import Select from "../../ui/Select.jsx";
import AlertMessage from "../../AlertMessage.jsx";
import SpinLoader from "../../ui/SpinLoader.jsx";


function InformationsTab({userDatas, token}) {
    
    const apiBase = import.meta.env.VITE_MAIN_API_URI;
    let navigate = useNavigate();

    const {regions} = useContext(ApiServicesContext);

    //To manage loading spinner
    const [isLoading, setIsLoading] = useState(false);

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

        street_number : "",
        street_name : "",
        complement : "",

        img_title : "",
        profile_picture : ""
    };

    const defaultPasswordForm = {
        password : "",
        new_password : "",
        new_password_confirmation : "",
    };
    
    const defaultUserClientForm = {
        street_number : userDatas.client?.street_number ?? "",
        street_name : userDatas.client?.street_name ?? "",
        complement : userDatas.client?.complement ?? "",
    };

    const defaultUserPicture = {
        img_path : userDatas.profile_img.img_path ? `${apiBase}/storage/${userDatas.profile_img.img_path}` : DefaultClient,
        img_title : userDatas.profile_img.img_title ?? "",
        profile_picture : null,
    }

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

    const [userClientForm, setUserClientForm] = useState(defaultUserClientForm);

    const [userPictureForm, setUserPictureForm] = useState(defaultUserPicture);

    const handleSubmitUserInfos = async (e) => {
        e.preventDefault();

        // Reset errors message
        setAlertMessage(defaultAlertMessage);
        setErrorInfosForm(defaultErrorForm);

        setIsLoading(true);

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
            setIsLoading(false);
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
            setIsLoading(false);
        }
    }

    const handleSubmitUserPassword = async (e) => {
        e.preventDefault();

        // Reset errors message
        setAlertMessage(defaultAlertMessage);
        setErrorInfosForm(defaultErrorForm);

        setIsLoading(true);
        
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
            setIsLoading(false);
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
            setIsLoading(false);
        }
    }

    const handleSubmitUserClientInfos = async (e) => {
        e.preventDefault();

        setAlertMessage(defaultAlertMessage);
        setErrorInfosForm(defaultErrorForm);

        setIsLoading(true);

        //Validation : Get userClientForm and return object of error if no value in input
        const validateClientInputs = Object.entries(userClientForm).reduce((acc, [key, value]) => {
            if (!value) {
                switch (key) {
                    case "street_number":
                        acc[key] = "Le numéro de rue est requis.";
                        break;
                    case "street_name":
                        acc[key] = "Le nom de la rue est requis.";
                        break;
                    default:
                        break;
                }
            } else if (value.length > 255) {
                switch (key) {
                    case "street_name":
                        acc[key] = "Le nom de la rue ne peut pas dépasser 255 caractères.";
                        break;
                    case "complement":
                        acc[key] = "Le complément d'adresse ne peut pas dépasser 255 caractères.";
                        break;
                    default:
                        break;
                }
            } else if (value < 0){

                if(key === "street_number"){
                    acc[key] = "Le numéro de rue ne peut pas être négatif.";
                }
            }
            return acc;
        }, {});

        // Check if there is at least 1 error
        if(Object.keys(validateClientInputs).length > 0){
            setErrorInfosForm(validateClientInputs);
            setIsLoading(false);
            return;
        }

        try {
            const updateClientInfos = await axios.post(apiBase + "/api/client-infos", 
                userClientForm,
                { headers: {
                    "Authorization": "Bearer " + token,
                }
            });

            if(updateClientInfos.status === 200) {
                setAlertMessage({...alertMessage, type : "success", message : "Votre adresse a été mis à jour avec succès.", context : "client-infos"});
            }else if (updateClientInfos.status === 201) {
                setAlertMessage({...alertMessage, type : "success", message : "Votre adresse a été ajouté avec succès.", context : "client-infos"});
            }
        } catch (error) {
            
            if (!error.response) return setAlertMessage({...alertMessage, type : "error", message : "Une erreur est survenue durant la mise à jour de votre addresse", context : "client-infos"})
            
            const { status, data } = error.response;
            
            if(status === 422){
                // Convert the error into an object
                const getErrors = Object.entries(data.errors).reduce((validateError, validate) => {
                    validateError[validate[0]] = validate[1][0];
                    return validateError;
                }, {})

                setErrorInfosForm(getErrors);
            } else {
                setAlertMessage({...alertMessage, type : "error", message : "Une erreur est survenue durant la mise à jour de votre adresse", context : "client-infos"})
            }
        } finally {
            setIsLoading(false);
        }
    }

    const handleSubmitUserPicture = async (e) => {
        e.preventDefault()
        // return console.log(userPictureForm.profile_picture);

        setAlertMessage(defaultAlertMessage);
        setErrorInfosForm(defaultErrorForm);

        setIsLoading(true);

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
            setIsLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('img_title', userPictureForm.img_title);
            formData.append('profile_picture', userPictureForm.profile_picture);

            const updateUserPicture = await axios.post(apiBase + "/api/user-profile-picture", 
                formData,
                { headers: {
                    "Authorization": "Bearer " + token,
                }
            });

            if(updateUserPicture.status === 200) {
                setAlertMessage({...alertMessage, type : "success", message : "Votre photo de profil et son titre ont bien été enregistrés !", context : "user-picture"});
                setUserPictureForm(defaultUserPicture);
            }

            if(updateClientInfos.status === 200) {
                setAlertMessage({...alertMessage, type : "success", message : "Votre photo de profil et son titre ont bien été enregistrés !", context : "user-picture"});
                setUserPictureForm(defaultUserPicture);
            }else if (updateClientInfos.status === 201) {
                setAlertMessage({...alertMessage, type : "success", message : "Votre photo de profil et son titre ont bien été ajouté avec succès !", context : "user-picture"});
                setUserPictureForm(defaultUserPicture);
            }

        } catch (error) {
            
            if (!error.response) return setAlertMessage({...alertMessage, type : "error", message : "Une erreur est survenue durant la mise à jour de votre photo de profil et son titre.", context : "user-picture"})
            
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
            setIsLoading(false);
        }
    }
    
    // If user upload a picture, he can remove and it will back to the old picture
    const removePicture = () => {
        setUserPictureForm({
            ...userPictureForm,
            img_path : userDatas.profile_img.img_path ? `${apiBase}/storage/${userDatas.profile_img.img_path}` : DefaultClient,
            profile_picture : null
        })
    }

    return ( 
        <div className="informations-tab">

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
                        <Input label="Téléphone*" id="phone" type="phone" maxLength={10} placeholder="0612345678"
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
                        <Input label="Code postal*" id="zipcode" placeholder="33000" maxLength={5}
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
                    {isLoading ? (
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
                    {isLoading ? (
                        <SpinLoader />
                    ): (
                        <>
                            Sauvegarder
                        </>
                    )}
                </Button>

                {alertMessage.context === "user-password" && alertMessage.message &&
                    <AlertMessage type={alertMessage.type}>{alertMessage.message}</AlertMessage>
                }
            </form>

            <form onSubmit={handleSubmitUserClientInfos} className="client-infos-form">
                <div className="client-infos-header">
                    <h2>Adresse</h2>
                    <h3>Indiquez votre adresse complète pour que l'artisan puisse se déplacer facilement.</h3>
                </div>
                <div className="client-address-input">
                    <div className="wrapper">
                        <Input label="Numéro de rue*" id="street_number" type="number" min="0" placeholder="12"
                            value={userClientForm.street_number}
                            onChange={(e) => setUserClientForm({...userClientForm, street_number : e.target.value})}
                            />
                        {errorInfosForm.street_number && <AlertMessage type="error">{errorInfosForm.street_number}</AlertMessage>}
                    </div>
                    <div className="wrapper">
                        <Input label="Nom de la rue*" id="street_name" type="text" maxLength={255} placeholder="rue Verdun"
                            value={userClientForm.street_name}
                            onChange={(e) => setUserClientForm({...userClientForm, street_name : e.target.value})}
                            />
                        {errorInfosForm.street_name && <AlertMessage type="error">{errorInfosForm.street_name}</AlertMessage>}
                    </div>
                    <div className="wrapper">
                        <Input label="Compléments" id="complement" type="text" autoComplete="off" maxLength={255} placeholder="Résidence Blue, Bâtiment A"
                            value={userClientForm.complement}
                            onChange={(e) => setUserClientForm({...userClientForm, complement : e.target.value})}
                            />
                        {errorInfosForm.complement && <AlertMessage type="error">{errorInfosForm.complement}</AlertMessage>}
                    </div>
                </div>

                <Button type="submit" className="btn-primary">
                    {isLoading ? (
                        <SpinLoader />
                    ): (
                        <>
                            Sauvegarder
                        </>
                    )}
                </Button>

                {alertMessage.context === "client-infos" && alertMessage.message &&
                    <AlertMessage type={alertMessage.type}>{alertMessage.message}</AlertMessage>
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
                    {isLoading ? (
                        <SpinLoader />
                    ): (
                        <>
                            Sauvegarder
                        </>
                    )}
                </Button>
                {alertMessage.context === "user-picture" && alertMessage.message &&
                    <AlertMessage type={alertMessage.type}>{alertMessage.message}</AlertMessage>
                }
            </form>
        </div>
    );
}

export default InformationsTab;