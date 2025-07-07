import "./UserPictureForm.scss";
import { useState, useContext, useRef } from "react";
import axios from "axios";

import DefaultClient from '../../../../../assets/img/default-client.svg';
import DefaultCraftsman from '../../../../../assets/img/default-craftsman.svg';

import { AuthContext } from "../../../../../context/AuthContext";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

import Input from "../../../../../components/ui/Input";
import Button from "../../../../../components/ui/Button";
import AlertMessage from "../../../../../components/AlertMessage";
import SpinLoader from "../../../../../components/ui/SpinLoader";

function UserpictureForm() {

    const apiBase = import.meta.env.VITE_MAIN_API_URI;
    const {userDatas, userToken, userRole} = useContext(AuthContext)

    const defaultAlertMessage = {type : "", message : ""};
    const defaultErrorForm = {
        img_title : "",
        profile_picture : ""
    };

    const [alertMessage, setAlertMessage] = useState(defaultAlertMessage);
    const [errorInfosForm, setErrorInfosForm] = useState(defaultErrorForm);
    const [isLoadingUserPicture, setIsLoadingUserPicture] = useState(false);

    const defaultImage = userRole === 'client' 
                        ? DefaultClient 
                        : userRole === 'craftsman' 
                            ? DefaultCraftsman 
                            : null;

    const [userPictureForm, setUserPictureForm] = useState({
        img_path : userDatas.profile_img?.img_path ? `${apiBase}/storage/${userDatas.profile_img.img_path}` : defaultImage,
        img_title : userDatas.profile_img?.img_title ?? "",
        profile_picture : null,
    });

    const handleSubmitUserPicture = async (e) => {
        e.preventDefault()

        setAlertMessage(defaultAlertMessage);
        setErrorInfosForm(defaultErrorForm);

        setIsLoadingUserPicture(true);

        if(userPictureForm.img_title.length > 255){
            setErrorInfosForm({...errorInfosForm, img_title : "Le nom ne peut pas dépasser 255 caractères."});
        }

        //Validation : Get userPictureForm and return object of error if no value in input
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
                    "Authorization": "Bearer " + userToken,
                }
            });

            if(updateUserPicture.status === 200) { 
                setAlertMessage({...alertMessage, type : "success", message : "Votre photo de profil et son titre ont bien été enregistrés !"});
                setUserPictureForm({...userPictureForm, profile_picture : null});
            }else if (updateUserPicture.status === 201) {
                setAlertMessage({...alertMessage, type : "success", message : "Votre photo de profil et son titre ont bien été ajouté avec succès !"});
                setUserPictureForm({...userPictureForm, profile_picture : null});
            }

        } catch (error) {
            console.log(error);
            
            if (!error.response) return setAlertMessage({...alertMessage, type : "error", message : "Une erreur est survenue durant la mise à jour de votre photo de profil !"})
            
            const { status, data } = error.response;
            
            if(status === 422){
                // Convert the error into an object
                const getErrors = Object.entries(data.errors).reduce((validateError, validate) => {
                    validateError[validate[0]] = validate[1][0];
                    return validateError;
                }, {})
                setErrorInfosForm(getErrors);
            } else {
                setAlertMessage({...alertMessage, type : "error", message : "Une erreur est survenue durant la mise à jour de votre photo de profil et son titre !"})
            }
        } finally {
            setIsLoadingUserPicture(false);
        }
    }
    
    // If user upload a picture, he can remove and it will back to the old picture
    const removePicture = () => {
        setUserPictureForm({
            ...userPictureForm,
            img_path : userDatas.profile_img?.img_path ? `${apiBase}/storage/${userDatas.profile_img.img_path}` : defaultImage,
            profile_picture : null
        })
    }

    const profilePictureInput = useRef(null)
    
    return ( 
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
                                }
                            ref={profilePictureInput}
                            />
                        <img src={userPictureForm.img_path} alt={userPictureForm.img_title ?? ""} className="profile-picture"/>
                    </div>
                    {userPictureForm.profile_picture &&
                        <button type="button" className="button-delete-picture"
                            onClick={removePicture}>
                            <FontAwesomeIcon icon={faTrash}/>
                        </button>
                    }
                </div>
                
                <p className="info-size">Taille maximum par fichier (3Mo).</p>

                <Button className="btn-secondary mobile-button-picture"
                    onClick={() => profilePictureInput.current.click()}
                    >
                    Ajouter une photo
                </Button>
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
            {(alertMessage.message) && alertMessage.type === "success" &&
                <AlertMessage type="success">{alertMessage.message}</AlertMessage>
            }
            {(alertMessage.message) && alertMessage.type === "error" &&
                <AlertMessage type="error">{alertMessage.message}</AlertMessage>
            }
        </form>
    );
}

export default UserpictureForm;