import { createContext, useState, useEffect } from "react";
import axios from 'axios';

export const InformationsContext = createContext();

export const InformationsProvider = ({children}) => {
    
    const apiBase = import.meta.env.VITE_MAIN_API_URI;
    const [providerLoading, setProviderLoading] = useState(true);

    return (
        <InformationsContext.Provider>
            {!providerLoading && children}
        </InformationsContext.Provider>
    );
}
