import { createContext, useState, useEffect } from "react";
import axios from 'axios';

export const MessagesContext = createContext();

export const MessagesProvider = ({children}) => {
    
    const apiBase = import.meta.env.VITE_MAIN_API_URI;
    const [providerLoading, setProviderLoading] = useState(true);

    return (
        <MessagesContext.Provider>
            {!providerLoading && children}
        </MessagesContext.Provider>
    );
}
