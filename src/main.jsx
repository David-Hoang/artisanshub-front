import "./assets/scss/global.scss";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

import App from "./App.jsx";

import { AuthProvider } from "./context/AuthContext.jsx";
import { ApiServicesProvider } from "./context/ApiServicesContext.jsx";

createRoot(document.getElementById("root")).render(
    // <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <ApiServicesProvider>
                    <App />
                </ApiServicesProvider>
            </AuthProvider>
        </BrowserRouter>
    // </StrictMode>
);
