import { Routes, Route } from "react-router-dom";
import Register from "../pages/Register";
import App from "../App";
import Login from "../pages/Login";
import Header from "../components/Header.jsx";
import Footer from '../components/Footer.jsx';

function AppRouters() {
    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/inscription" element={<Register />} />
                <Route path="/connexion" element={<Login />} />
            </Routes>
            <Footer />
        </>
    );
}

export default AppRouters;