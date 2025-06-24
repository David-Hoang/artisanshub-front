import "./UserPasswordForm.scss";
import { useState } from "react";
import axios from "axios";

import Input from "../../../../../components/ui/Input";
import Button from "../../../../../components/ui/Button";
import AlertMessage from "../../../../../components/AlertMessage";
import SpinLoader from "../../../../../components/ui/SpinLoader";

function UserPasswordForm({userToken}) {

    const apiBase = import.meta.env.VITE_MAIN_API_URI;

    const defaultPasswordForm = {
        password : "",
        new_password : "",
        new_password_confirmation : "",
    };

    const defaultErrorForm = {
        password : "",
        new_password : "",
        new_password_confirmation : "",
    };

    const defaultAlertMessage = {type : "", message : ""};

    const [userPasswordForm, setUserPasswordForm] = useState(defaultPasswordForm);
    const [errorInfosForm, setErrorInfosForm] = useState(defaultErrorForm);
    const [alertMessage, setAlertMessage] = useState(defaultAlertMessage);

    const [isLoadingUserPassword, setIsLoadingUserPassword] = useState(false);

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
                    "Authorization": "Bearer " + userToken,
                }
            });

            if(updateUserPassword.status === 200) {
                setAlertMessage({...alertMessage, type : "success", message : "Le mot de passe a été mis à jour avec succès."});
                setUserPasswordForm(defaultPasswordForm);
            }
        } catch (error) {
            
            if (!error.response) return setAlertMessage({...alertMessage, type : "error", message : "Une erreur est survenue durant la mise à jour de votre mot de passe"})
            
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
                setAlertMessage({...alertMessage, type : "error", message : "Une erreur est survenue durant la mise à jour de votre mot de passe"})
            }
        } finally {
            setIsLoadingUserPassword(false);
        }
    }

    return ( 
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

            {alertMessage.message && alertMessage.type === "success" &&
                <AlertMessage type="success">{alertMessage.message}</AlertMessage>
            }
            {alertMessage.message && alertMessage.type === "error" &&
                <AlertMessage type="error">{alertMessage.message}</AlertMessage>
            }
        </form>
    );
}

export default UserPasswordForm;