import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import Register from "../pages/Register";
import App from "../App";
import Login from "../pages/Login";
import Header from "../components/Header.jsx";
import Footer from '../components/Footer.jsx';

import { AuthContext } from "../context/AuthContext.jsx";

function AppRouters() {

    const { isLogged } = useContext(AuthContext);

    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/inscription" element={isLogged ? <Navigate to="/" /> : <Register />} />
                <Route path="/connexion" element={isLogged ? <Navigate to="/" /> : <Login />} /> 
            </Routes>
            <Footer />
        </>
    );
}

export default AppRouters;