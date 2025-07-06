import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";

import Register from "../pages/register/Register.jsx";
import Login from "../pages/login/Login.jsx";
import Home from '../pages/home/Home.jsx';
import Dashboard from '../pages/dashboard/Dashboard.jsx';
import FindCraftsmanList from '../pages/findcraftsman/FindCraftsmanList.jsx';
import DetailsCraftsman from "../pages/findcraftsman/DetailsCraftsman.jsx";
import PageNotFound from "../pages/pagenotfound/PageNotFound.jsx";
import Contact from "../pages/contact/Contact.jsx";
import Legal from "../pages/legal/Legal.jsx";
import PrivacyPolicy from "../pages/legal/PrivacyPolicy.jsx";
import Terms from "../pages/legal/Terms.jsx";

import { AuthContext } from "../context/AuthContext.jsx";

function AppRouters() {

    const { isLogged } = useContext(AuthContext);

    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />

                <Route path="/contactez-nous" element={<Contact />} />
                <Route path="/mentions-legales" element={<Legal />} />
                <Route path="/politique-de-confidentialite" element={<PrivacyPolicy />} />
                <Route path="/conditions-utilisation" element={<Terms />} />

                <Route path="/inscription" element={isLogged ? <Navigate to="/" /> : <Register />} />
                <Route path="/connexion" element={isLogged ? <Navigate to="/" /> : <Login />} /> 

                <Route path="/trouver-artisan" element={<FindCraftsmanList/>} /> 
                <Route path="/artisan/:craftsmanId" element={<DetailsCraftsman/>} /> 

                <Route path="/dashboard" element={isLogged ? <Dashboard /> : <Navigate to="/" />} />

                <Route path="*" element={<PageNotFound />} />

            </Routes>
        </>
    );
}

export default AppRouters;