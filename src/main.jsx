import "./assets/scss/global.scss";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

import App from "./App.jsx";

import { AuthProvider } from "./context/AuthContext.jsx";
import { JobsCatProvider } from "./context/JobsCatContext.jsx";

createRoot(document.getElementById("root")).render(
    // <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <JobsCatProvider>
                    <App />
                </JobsCatProvider>
            </AuthProvider>
        </BrowserRouter>
    // </StrictMode>
);
