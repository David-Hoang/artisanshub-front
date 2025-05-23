import axios from "axios";
import { useState, createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const apiBase = import.meta.env.VITE_MAIN_API_URI;
    let navigate = useNavigate();

    const [controllerLoading, setControllerLoading] = useState(true);

    const [isLogged, setIsLogged] = useState(false);
    const [userDatas, setUserDatas] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [userToken, setUserToken] = useState(null);
    const [userRoleInfos, setUserRoleInfos] = useState(false);

    //To manage loading spinner
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
        password_confirmation : "",
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

    // get user info on reload
    const userInfos = async (token) => {
        try {
            const response = await axios.get(apiBase + "/api/me", {
                    headers: {
                        "Authorization": "Bearer " + token,
                    }
                })
            if(response.status === 200){
                setUserRole(response.data.role);
                setUserDatas(response.data);

                // Check if user set his role infos
                if(response.data.profile){
                    setUserRoleInfos(true);
                }
            }
        } catch (error) {
            if (!error.response) return setErrorMessage("Une erreur s'est produite lors de la récupération des informations de l'utilisateur.");

            const { status } = error.response;

            if (status === 401) {
                setErrorMessage("Les informations de connexion ne sont pas valides.");
                navigate('/connexion')
            } else {
                return setErrorMessage("Une erreur s'est produite lors de la récupération des informations de l'utilisateur.");
            }
        }
    }

    useEffect( () => {
        try {
            const actualToken = localStorage.getItem("artisansHubUserToken");

            if(actualToken) {
                userInfos(actualToken);
                setUserToken(actualToken);
                setIsLogged(true);
            }else {
                setUserToken(null);
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
                let token = response.data.token;

                localStorage.setItem("artisansHubUserToken", token);
                setUserToken(token);
                setUserDatas(response.data.user);
                setUserRole(response.data.user.role);
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
            // const userToken = localStorage.getItem("artisansHubUserToken");

            const userLogout = await axios.post(apiBase + "/api/logout", {}, {
                headers: {
                    "Authorization": "Bearer " + userToken,
                }
            })

            if (userLogout.status === 200){
                localStorage.removeItem("artisansHubUserToken");
                setUserToken(null);
                setIsLogged(false);
                window.location.href = '/';
            }
        } catch (error) {
            localStorage.removeItem("artisansHubUserToken");
            setUserToken(null);
            setIsLogged(false);
            window.location.href = '/';
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
                    case "password_confirmation":
                        acc[key] = "Vous devez confirmer le mot de passe.";
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
                let token = register.data.token;
                localStorage.setItem("artisansHubUserToken", token);
                setUserToken(token);
                setUserDatas(register.data.user);
                setUserRole(register.data.user.role);
                setUserRoleInfos(true);
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
            } else {
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

                userToken,
                userDatas, 
                setUserDatas,
                userRole,
                userRoleInfos, 
                setUserRoleInfos,

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
