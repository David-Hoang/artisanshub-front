import './InformationsTab.scss';
import axios from 'axios'
import {useContext, useState} from 'react';

import { ApiServicesContext } from "../../../context/ApiServicesContext.jsx";

import Button from "../../ui/Button.jsx";
import Input from "../../ui/Input.jsx";
import Select from "../../ui/Select.jsx";
import AlertMessage from "../../AlertMessage.jsx";
import SpinLoader from "../../ui/SpinLoader.jsx";


function InformationsTab({userDatas, token}) {

    const apiBase = import.meta.env.VITE_MAIN_API_URI;
    const {regions} = useContext(ApiServicesContext);

    //To manage loading spinner
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const defaultErrorForm = {
        first_name : "",
        last_name : "",
        email : "",
        role : "",
        password : "",
        phone : "",
        city : "",
        region : "",
        zipcode : "",
    };

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

    const handleSubmitUserInfos = async (e) => {
        e.preventDefault();

        setErrorMessage("");
        setErrorInfosForm(defaultErrorForm);
        setIsLoading(true);

        //Validation : Get userInfosForm and return object of error if no value in input
        const validateInputs = Object.entries(userInfosForm).reduce((acc, [key, value]) => {
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
            }
            return acc;
        }, {});

        //Check if there is at least 1 error
        if(Object.keys(validateInputs).length > 0){
            setErrorInfosForm(validateInputs);
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
                setErrorMessage("Vos informations ont été mises à jour.")
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    return ( 
        <div className="informations-tab">
            <form onSubmit={handleSubmitUserInfos} className="user-infos-form">
                <h2>Informations utilisateur</h2>
                <div className="user-infos-input">
                    <Input label="Nom" id="last_name" placeholder="Doe" type="text" autoComplete="off" 
                        value={userInfosForm.last_name}
                        onChange={(e) => setUserInfosForm({...userInfosForm, last_name : e.target.value})}
                    />
                    {errorInfosForm.last_name && <Error>{errorInfosForm.last_name}</Error>}

                    <Input label="Prénom" id="first_name" placeholder="John" type="text" autoComplete="off"
                        value={userInfosForm.first_name}
                        onChange={(e) => setUserInfosForm({...userInfosForm, first_name : e.target.value})}
                    />
                    {errorInfosForm.first_name && <Error>{errorInfosForm.first_name}</Error>}

                    <Input label="Pseudo" id="username" placeholder="johndoe123" type="text" autoComplete="off"
                        value={userInfosForm.username}
                        onChange={(e) => setUserInfosForm({...userInfosForm, username : e.target.value})}
                    />
                </div>
                <div>
                    <Input label="Téléphone" id="phone" type="phone"
                        value={userInfosForm.phone}
                        onChange={(e) => setUserInfosForm({...userInfosForm, phone : e.target.value})}
                    />
                    {errorInfosForm.phone && <Error>{errorInfosForm.phone}</Error>}

                    <Input label="Ville" id="city" placeholder="Bordeaux" type="text"
                        value={userInfosForm.city}
                        onChange={(e) => setUserInfosForm({...userInfosForm, city : e.target.value})}
                    />
                    {errorInfosForm.city && <Error>{errorInfosForm.city}</Error>}
                    
                    <Input label="Code postal" id="zipcode" placeholder="33000"
                        value={userInfosForm.zipcode}
                        onChange={(e) => setUserInfosForm({...userInfosForm, zipcode : e.target.value})}
                    />
                    {errorInfosForm.zipcode && <Error>{errorInfosForm.zipcode}</Error>}

                </div>
                <div>
                    <Select 
                        label="Region*"
                        id="region"
                        placeholder="Sélectionnez votre région"
                        datas={regions}
                        value={userInfosForm.region}
                        onChange={(e) => { setUserInfosForm({...userInfosForm, region : e.target.value}) }}/>
                    {errorInfosForm.region && <Error>{errorInfosForm.region}</Error>}
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

                {errorMessage && <AlertMessage type="success">{errorMessage}</AlertMessage>}

            </form>
        </div>
    );
}

export default InformationsTab;