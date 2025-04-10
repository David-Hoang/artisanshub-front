import "./assets/scss/global.scss";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

import App from "./App.jsx";

import { AuthController } from "./context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
    // <StrictMode>
        <BrowserRouter>
            <AuthController>
                <App />
            </AuthController>
        </BrowserRouter>
    // </StrictMode>
);
