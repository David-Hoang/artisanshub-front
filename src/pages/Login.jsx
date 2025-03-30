import "./Login.scss";

import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

import SpinLoader from "../components/form/SpinLoader.jsx";
import Button from "../components/Button.jsx";
import Input from "../components/form/Input.jsx";
import Error from "../components/Error.jsx";


function Login() {
    const {handleLogin, errorEmail, errorPassword, errorMessage, isLoading} = useContext(AuthContext);

    const [formLogin, setFormLogin] = useState({
        email : "",
        password : ""
    })

    return (
        <main>
            <form onSubmit={(e) => handleLogin(e, formLogin)} className="login-form">
                <div className="login-header">
                    <h1>Connectez vous à ArtisansHub</h1>
                    <h2>Entrez vos identifiants</h2>
                </div>

                <div className="login-input">
                    <Input
                        label="Email"
                        id="email"
                        type="email"
                        placeholder="john.doe@gmail.com"
                        autoComplete="off"
                        onChange={(e) => {
                            setFormLogin({...formLogin, email : e.target.value})
                        }}
                    />
                    {errorEmail && <Error>{errorEmail}</Error>}

                    <Input
                        label="Mot de passe"
                        id="password"
                        type="password"
                        onChange={(e) => {
                            setFormLogin({...formLogin, password : e.target.value})
                        }}
                    />

                    {errorPassword && <Error>{errorPassword}</Error>}
                </div>

                <Button className="btn-primary" type="submit" disabled={isLoading}>
                    {isLoading ? (
                            <SpinLoader />
                        ) : (
                            <>
                                Se connecter
                            </>
                        ) 
                    }
                </Button>
                {errorMessage && <Error>{errorMessage}</Error>}
                <p>Vous n'avez pas de compte ? <Link to="/inscription">Créez-en un !</Link></p>

            </form>
        </main>
    );
}

export default Login;
