import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "../pages/Homepage";
import Register from "../pages/Register";
import Login from "../pages/Login";

function AppRouters() {
    return (
        <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/inscription" element={<Register />} />
            <Route path="/connexion" element={<Login />} />
        </Routes>
    );
}

export default AppRouters;