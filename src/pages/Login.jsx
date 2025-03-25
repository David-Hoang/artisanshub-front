import Button from "../components/Button.jsx";
import Input from "../components/Input.jsx";
import "./Login.scss";

import axios from "axios";
import { useState } from "react";

function Login() {
    const apiBase = import.meta.env.VITE_MAIN_API_URI;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const fetching = await axios.post(apiBase + "/api/login", {
                    email,
                    password,
                })
                console.log(fetching.data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <main>
            <form onSubmit={handleSubmit} className="login-form">
                <div className="login-header">
                    <h1>Connecter vous à ArtisansHub</h1>
                    <h2>Entrez vos identifiants</h2>
                </div>

                <div className="login-input">
                    <Input
                        label="Email"
                        id="email"
                        type="email"
                        placeholder="john.doe@gmail.com"
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                    />

                    <Input
                        label="Mot de passe"
                        id="password"
                        type="password"
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                    />
                </div>

                <Button className="btn-primary" type="submit">
                    Se connecter
                </Button>
            </form>
        </main>
    );
}

export default Login;
