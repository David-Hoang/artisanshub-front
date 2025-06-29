import "./UserInfosForm.scss";
import { useState, useContext } from "react";
import axios from "axios";

import { ApiServicesContext } from "../../../../../context/ApiServicesContext";
import { AuthContext } from "../../../../../context/AuthContext";

import Input from "../../../../../components/ui/Input";
import Select from "../../../../../components/ui/Select";
import Button from "../../../../../components/ui/Button";
import AlertMessage from "../../../../../components/AlertMessage";
import SpinLoader from "../../../../../components/ui/SpinLoader";

function UserInfosForm() {
    
    const apiBase = import.meta.env.VITE_MAIN_API_URI;
    const {regions} = useContext(ApiServicesContext);
    const {userDatas, userToken, reFetchUserDatas} = useContext(AuthContext)

    const defaultAlertMessage = {type : "", message : ""};
    const defaultErrorForm = {
        first_name : "",
        last_name : "",
        username : "",
        email : "",
        phone : "",
        city : "",
        region : "",
        zipcode : "",
    };

    const [alertMessage, setAlertMessage] = useState(defaultAlertMessage);
    const [errorInfosForm, setErrorInfosForm] = useState(defaultErrorForm);
    const [isLoadingUserInfos, setIsLoadingUserInfos] = useState(false);


    const [userInfosForm, setUserInfosForm] = useState({
        first_name : userDatas.first_name,
        last_name : userDatas.last_name,
        username : userDatas.username ?? "",
        phone : userDatas.phone,
        city : userDatas.city,
        region : userDatas.region,
        zipcode : userDatas.zipcode,
    })

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
                    "Authorization": "Bearer " + userToken,
                }
            });

            if(updateUserInfos.status === 200) {
                setAlertMessage({...alertMessage, type : "success", message : "Vos informations ont été mises à jour."});
                reFetchUserDatas();
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
            setIsLoadingUserInfos(false);
        }
    }

    return ( 
        <form onSubmit={handleSubmitUserInfos} className="user-infos-form">
                <h2>Informations utilisateur</h2>
                <div className="user-infos-input">

                    <div className="wrapper">
                        <Input label="Nom*" id="last_name" placeholder="Doe" type="text" autoComplete="off"
                            value={userInfosForm.last_name}
                            onChange={(e) => setUserInfosForm({...userInfosForm, last_name : e.target.value})}
                            />
                        {errorInfosForm.last_name && <AlertMessage type="error">{errorInfosForm.last_name}</AlertMessage>}
                    </div>
                    
                    <div className="wrapper">
                        <Input label="Prénom*" id="first_name" placeholder="John" type="text" autoComplete="off"
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
                        <Input label="Téléphone*" id="phone" type="phone" pattern="^0\d{9}$" placeholder="0612345678"
                            value={userInfosForm.phone}
                            onChange={(e) => setUserInfosForm({...userInfosForm, phone : e.target.value})}
                            />
                        {errorInfosForm.phone && <AlertMessage type="error">{errorInfosForm.phone}</AlertMessage>}
                    </div>

                    <div className="wrapper">
                        <Input label="Ville*" id="city" placeholder="Bordeaux" type="text"
                            value={userInfosForm.city}
                            onChange={(e) => setUserInfosForm({...userInfosForm, city : e.target.value})}
                            />
                        {errorInfosForm.city && <AlertMessage type="error">{errorInfosForm.city}</AlertMessage>}
                    </div>
                    
                    <div className="wrapper">
                        <Input label="Code postal*" id="zipcode" type="text" pattern="^\d{5}$" placeholder="33000"
                            value={userInfosForm.zipcode}
                            onChange={(e) => setUserInfosForm({...userInfosForm, zipcode : e.target.value})}
                            />
                        {errorInfosForm.zipcode && <AlertMessage type="error">{errorInfosForm.zipcode}</AlertMessage>}
                    </div>
                </div>
                <div className="region-mail-wrapper">
                    <Select 
                        label="Region*"
                        id="region"
                        placeholder="Sélectionnez votre région"
                        datas={regions}
                        value={userInfosForm.region}
                        onChange={(e) => { setUserInfosForm({...userInfosForm, region : e.target.value}) }}/>
                    {errorInfosForm.region && <AlertMessage type="error">{errorInfosForm.region}</AlertMessage>}

                    <Input label="Email" type="mail" value={userDatas.email} disabled/>
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

                {alertMessage.message && alertMessage.type === "success" &&
                    <AlertMessage type="success">{alertMessage.message}</AlertMessage>
                }
                {alertMessage.message && alertMessage.type === "error" &&
                    <AlertMessage type="error">{alertMessage.message}</AlertMessage>
                }
        </form>
    );
    
}

export default UserInfosForm;