import './InformationsTab.scss';
import axios from 'axios'
import {useContext, useState} from 'react';
import { useNavigate } from "react-router-dom";

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
        password : "",
        new_password : "",
        new_password_confirmation : "",
        phone : "",
        city : "",
        region : "",
        zipcode : "",
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
            
            if (!error.response) return setAlertMessage({...alertMessage, type : "", message : "Une erreur est survenue durant la mise à jour de votre mot de passe", context : "user-password"})
            
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
    
    return ( 
        <div className="informations-tab">
            <form onSubmit={handleSubmitUserInfos} className="user-infos-form">
                <h2>Informations utilisateur</h2>
                <div className="user-infos-input">

                    <div className="wrapper">
                        <Input label="Nom" id="last_name" placeholder="Doe" type="text" autoComplete="off" maxLength={255}
                            value={userInfosForm.last_name}
                            onChange={(e) => setUserInfosForm({...userInfosForm, last_name : e.target.value})}
                            />
                        {errorInfosForm.last_name && <AlertMessage type="error">{errorInfosForm.last_name}</AlertMessage>}
                    </div>
                    
                    <div className="wrapper">
                        <Input label="Prénom" id="first_name" placeholder="John" type="text" autoComplete="off" maxLength={255}
                            value={userInfosForm.first_name}
                            onChange={(e) => setUserInfosForm({...userInfosForm, first_name : e.target.value})}
                            />
                        {errorInfosForm.first_name && <AlertMessage type="error">{errorInfosForm.first_name}</AlertMessage>}
                    </div>

                    <div className="wrapper">
                        <Input label="Pseudo" id="username" placeholder="johndoe123" type="text" autoComplete="off"
                            value={userInfosForm.username}
                            onChange={(e) => setUserInfosForm({...userInfosForm, username : e.target.value})}
                        />
                        {errorInfosForm.username && <AlertMessage type="error">{errorInfosForm.username}</AlertMessage>}
                    </div>
        
                    <div className="wrapper">
                        <Input label="Téléphone" id="phone" type="phone" maxLength={10}
                            value={userInfosForm.phone}
                            onChange={(e) => setUserInfosForm({...userInfosForm, phone : e.target.value})}
                            />
                        {errorInfosForm.phone && <AlertMessage type="error">{errorInfosForm.phone}</AlertMessage>}
                    </div>

                    <div className="wrapper">
                        <Input label="Ville" id="city" placeholder="Bordeaux" type="text" maxLength={255}
                            value={userInfosForm.city}
                            onChange={(e) => setUserInfosForm({...userInfosForm, city : e.target.value})}
                            />
                        {errorInfosForm.city && <AlertMessage type="error">{errorInfosForm.city}</AlertMessage>}
                    </div>
                    
                    <div className="wrapper">
                        <Input label="Code postal" id="zipcode" placeholder="33000" maxLength={5}
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
                        <Input label="Mot de passe actuel" id="password" type="password" autoComplete="off" minLength={8}
                            value={userPasswordForm.password}
                            onChange={(e) => setUserPasswordForm({...userPasswordForm, password : e.target.value})}
                            />
                        {errorInfosForm.password && <AlertMessage type="error">{errorInfosForm.password}</AlertMessage>}
                    </div>
                    <div className="wrapper">
                        <Input label="Nouveau mot de passe" id="new_password" type="password" autoComplete="off" minLength={8}
                            value={userPasswordForm.new_password}
                            onChange={(e) => setUserPasswordForm({...userPasswordForm, new_password : e.target.value})}
                            />
                        {errorInfosForm.new_password && <AlertMessage type="error">{errorInfosForm.new_password}</AlertMessage>}
                    </div>
                    <div className="wrapper">
                        <Input label="Confirmer nouveau mot de passe" id="new_password_confirmation" type="password" autoComplete="off" minLength={8}
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
        </div>
    );
}

export default InformationsTab;