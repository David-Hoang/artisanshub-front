import axios from "axios";
import { useState, createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthController = ({ children }) => {
    const apiBase = import.meta.env.VITE_MAIN_API_URI;
    let navigate = useNavigate();

    const [controllerLoading, setControllerLoading] = useState(true);

    const [isLogged, setIsLogged] = useState(false);
    const [userDatas, setUserDatas] = useState(null);

    const [isLoading, setIsLoading] = useState(false);

    const [errorEmail, setErrorEmail] = useState("");
    const [errorPassword, setErrorPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const [formRegister, setFormRegister] = useState({
        first_name : "",
        last_name : "",
        email : "",
        username : "",
        role : "",
        password : "",
        phone : "",
        city : "",
        region : "",
        zipcode : "",
    })

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

    const [errorFormRegister, setErrorFormRegister] = useState(defaultErrorForm);
    
    useEffect(() => {
        try {
            const token = localStorage.getItem("artisansHubUserToken");

            if(token) {
                setIsLogged(true);
            }else {
                setIsLogged(false);

            }
        } catch (error) {
            console.error('Une erreur est survenue lors de la récupération du token : ', error);
        }finally{
            setControllerLoading(false);
        }

    }, [])

    const handleLogin = async (e, formLogin) => {
        e.preventDefault();
        
        setErrorEmail("");
        setErrorPassword("");
        setErrorMessage("");
        const {email, password} = formLogin;

        if (!email) return setErrorEmail("Veuillez renseigner votre adresse email.");
        if (!password) return setErrorPassword("Veuillez renseigner un mot de passe.");
        
        setIsLoading(true);
        
        try {
            
            const response = await axios.post(apiBase + "/api/login", {
                    email,
                    password,
                })

            if(response.status === 200){
                let userToken = response.data.token;
                localStorage.setItem("artisansHubUserToken", userToken);
                setIsLogged(true);
                setIsLoading(true);
                navigate('/');
            }

        } catch (error) {
            if (!error.response) return setErrorMessage("Une erreur s'est produite lors de la tentative de connexion.");

            const { status, data } = error.response;

            if (status === 401) {
                setErrorMessage("Les informations de connexion ne sont pas valides.");
            } else if (status === 422) {
                setErrorEmail(data.errors?.email?.[0] || "");
                setErrorPassword(data.errors?.password?.[0] || "");
            } else {
                return setErrorMessage("Une erreur s'est produite lors de la tentative de connexion.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {

        try {
            const userToken = localStorage.getItem("artisansHubUserToken");

            await axios.post(apiBase + "/api/logout", {}, {
                headers: {
                    "Authorization": "Bearer " + userToken,
                }
            })

            localStorage.removeItem("artisansHubUserToken");
            setIsLogged(false);
            navigate('/');
        
        } catch (error) {
            console.error(error)
        }
    }

    const handleRegister = async (e) => {
        e.preventDefault();

        setIsLoading(true);

        //Reset errors
        setErrorFormRegister(defaultErrorForm);
        
        //Validation : Get formRegister and return object of error if no value in input
        const validateInputs = Object.entries(formRegister).reduce((acc, [key, value]) => {
            if (!value) {
                switch (key) {
                    case "first_name":
                        acc[key] = "Veuillez renseigner votre prénom.";
                        break;
                    case "last_name":
                        acc[key] = "Veuillez renseigner votre nom.";
                        break;
                    case "email":
                        acc[key] = "Veuillez renseigner votre adresse email.";
                        break;
                    case "role":
                        acc[key] = "Veuillez sélectionner votre profil.";
                        break;
                    case "password":
                        acc[key] = "Veuillez renseigner un mot de passe.";
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
            setErrorFormRegister(validateInputs);
            setIsLoading(false);
            return;
        }

        
        try {
            const register = await axios.post(apiBase + "/api/register", formRegister);
            
            if(register.status === 201){
                let userToken = register.data.token;
                localStorage.setItem("artisansHubUserToken", userToken);
                setIsLogged(true);
                navigate('/');
            }
        } catch (error) {

            const { status, data } = error.response;

            if(status === 422) {
                // Convert the array of error into an object
                const getErrors = Object.entries(data.errors).reduce((validateError, validate) => {
                    validateError[validate[0]] = validate[1][0];
                    return validateError;
                }, {})
                setErrorFormRegister(getErrors);
            }else {
                setErrorMessage("Une erreur est survenue durant la création de votre compte.")
            }
            
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <AuthContext.Provider value={{ 
                isLogged, 
                setIsLogged, 

                userDatas, 
                setUserDatas,

                handleLogout,
                handleLogin,
                handleRegister,
                formRegister,
                setFormRegister,
                errorFormRegister,

                errorEmail,
                errorPassword,
                errorMessage,

                isLoading
                }}
            >
            {/* Force not return the children before the end of loading */}
            {!controllerLoading && children} 
        </AuthContext.Provider>
    );
};
