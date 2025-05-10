import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";

import Register from "../pages/Register";
import Login from "../pages/Login";
import Home from '../pages/Home.jsx';
import Dashboard from '../pages/Dashboard.jsx';

import { AuthContext } from "../context/AuthContext.jsx";

function AppRouters() {

    const { isLogged } = useContext(AuthContext);

    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/inscription" element={isLogged ? <Navigate to="/" /> : <Register />} />
                <Route path="/connexion" element={isLogged ? <Navigate to="/" /> : <Login />} /> 
                <Route path="/dashboard" element={isLogged ? <Navigate to="/" /> : <Dashboard />} /> 
            </Routes>
        </>
    );
}

export default AppRouters;