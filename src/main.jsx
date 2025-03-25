import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

import './assets/scss/global.scss';
import AppRouters from "./routes/AppRoutes.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <AppRouters />
        </BrowserRouter>
    </StrictMode>
);
