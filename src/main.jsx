import "./assets/scss/global.scss";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

import App from "./App.jsx";

import { AuthController } from "./context/AuthContext.jsx";
import { JobsCatController } from "./context/JobsCatContext.jsx";

createRoot(document.getElementById("root")).render(
    // <StrictMode>
        <BrowserRouter>
            <AuthController>
                <JobsCatController>
                    <App />
                </JobsCatController>
            </AuthController>
        </BrowserRouter>
    // </StrictMode>
);
