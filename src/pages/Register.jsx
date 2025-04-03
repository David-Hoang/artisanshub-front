import './Register.scss';

import { Link } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import axios from 'axios';

import Button from "../components/Button.jsx";
import Input from "../components/form/Input.jsx";
import Error from "../components/Error.jsx";
import SpinLoader from "../components/form/SpinLoader.jsx";


function Register() {
    const apiBase = import.meta.env.VITE_MAIN_API_URI;
    const {handleRegister, isLoading, formRegister, setFormRegister, errorFormRegister} = useContext(AuthContext);
    const [regions, setRegions] = useState(null);

    const fetchRegions = async () => {
        try {
            const response = await axios.get(apiBase + "/api/enums/regions");
            setRegions(response.data.regions)
        } catch (error) {
            console.log(error);
        }
    }
    
    useEffect(() => {
        fetchRegions()
    }, []);

    return ( 
        <main>
            <form onSubmit={handleRegister} className="register-form">
                <div className="register-header">
                    <h1>Créez votre compte</h1>
                    <h2>Créez votre compte et profitez pleinement de notre plateforme</h2>
                </div>

                <div className="register-roles">
                    <div className="choice-role">
                        <div className="radio-wrapper">
                            <input type="radio" name="role" id="client" value="client" onChange={(e) => { setFormRegister({...formRegister, role : e.target.value}) }} />
                            <label htmlFor="client">Je suis un client</label>
                        </div>
                        
                        <div className="radio-wrapper">
                            <input type="radio" name="role" id="craftsman" value="craftsman" onChange={(e) => { setFormRegister({...formRegister, role : e.target.value}) }} />
                            <label htmlFor="craftsman">Je suis un artisan</label>
                        </div>
                    </div>
                    {errorFormRegister.role && <Error>{errorFormRegister.role}</Error>}
                </div>

                <div className="register-name">
                    <div className="wrapper">
                        <Input label="Nom*" id="last_name" type="text" placeholder="Doe" autoComplete="off"
                            onChange={(e) => { setFormRegister({...formRegister, last_name : e.target.value}) }}/>
                        {errorFormRegister.last_name && <Error>{errorFormRegister.last_name}</Error>}
                    </div>
                    <div className="wrapper">
                        <Input label="Prénom*" id="first_name" type="text" placeholder="John" autoComplete="off"
                            onChange={(e) => { setFormRegister({...formRegister, first_name : e.target.value}) }}/>
                        {errorFormRegister.first_name && <Error>{errorFormRegister.first_name}</Error>}
                    </div>
                </div>

                <div className="register-contact">
                    <div className="wrapper">
                        <Input label="Téléphone*" id="phone" type="phone"
                            onChange={(e) => { setFormRegister({...formRegister, phone : e.target.value}) }}/>
                        {errorFormRegister.phone && <Error>{errorFormRegister.phone}</Error>}
                    </div>
                    <Input label="Pseudo" id="username" type="text"
                        onChange={(e) => { setFormRegister({...formRegister, username : e.target.value}) }}/>
                </div>

                <div className="register-auth">
                    <div className="wrapper">
                        <Input label="Email*" id="email" type="email" placeholder="john.doe@gmail.com"
                            onChange={(e) => { setFormRegister({...formRegister, email : e.target.value}) }}/>
                        {errorFormRegister.email && <Error>{errorFormRegister.email}</Error>}
                    </div>
                    <div className="wrapper">
                        <Input label="Mot de passe*" id="password" type="password"
                            onChange={(e) => { setFormRegister({...formRegister, password : e.target.value}) }}/>
                        {errorFormRegister.password && <Error>{errorFormRegister.password}</Error>}
                    </div>
                </div>

                <div className="register-location">
                    <div className="wrapper">
                        <Input label="Ville*" id="city" type="text"
                            onChange={(e) => { setFormRegister({...formRegister, city : e.target.value}) }}/>
                        {errorFormRegister.city && <Error>{errorFormRegister.city}</Error>}
                    </div>

                    <div className="wrapper">
                        <Input label="Code postal*" id="zipcode" type="text"
                            onChange={(e) => { setFormRegister({...formRegister, zipcode : e.target.value}) }}/>
                        {errorFormRegister.zipcode && <Error>{errorFormRegister.zipcode}</Error>}
                    </div>

                </div>
                
                <div className="register-region">
                    <div className="select-wrapper">
                        <label htmlFor="regions">Region*</label>
                        <select name="region" id="regions" onChange={(e) => { setFormRegister({...formRegister, region : e.target.value}) }}>
                            <option value="">Sélectionnez votre région</option>
                            {regions &&
                                regions.map( (region, key) => (
                                    <option key={key} value={region}>{region}</option>
                                ))
                            }
                        </select>
                    </div>
                    {errorFormRegister.region && <Error>{errorFormRegister.region}</Error>}

                </div>
                
                <Button type="submit" className="btn-primary">
                    {isLoading ? (
                        <SpinLoader />
                    ): (
                        <>
                            Je m'inscris
                        </>
                    )}
                </Button>
                
                <p>Vous avez deja un compte ? <Link to="/connexion">Connectez-vous !</Link></p>
            </form>
        </main>
    );
}

export default Register;