import "./assets/scss/global.scss";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

import AppRouters from "./routes/AppRoutes.jsx";

import { AuthController } from "./context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
    // <StrictMode>
        <BrowserRouter>
            <AuthController>
                <AppRouters />
            </AuthController>
        </BrowserRouter>
    // </StrictMode>
);
