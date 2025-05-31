import './FindCraftsman.scss';
import { useState, useEffect } from 'react';
import { useSearchParams } from "react-router-dom";
import axios from "axios";

import Filters from "./elements/Filters.jsx";
import Listing from "./elements/Listing.jsx";

function FindCraftsman() {

    const apiBase = import.meta.env.VITE_MAIN_API_URI;
    const [searchParams, setSearchParams] = useSearchParams();

    const [listing, setListing] = useState([]);
    const [isLoadingList, setIsLoadingList] = useState(false);

    const fetchCraftsmen = async () => {
        setIsLoadingList(true);
        
        try {
            const response = await axios.get(`${apiBase}/api/craftsmen`);

            if(response.status === 200){
                setListing(response.data);
            }
            
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoadingList(false)
        }
    }

    useEffect(() => {
        fetchCraftsmen()
    }, []);

    return ( 
        <main className="main-find-craftsman">
            <section className="find-craftsman-header">
                <h1>Trouvez votre artisan</h1>
                <h2>Parcourez notre réseau d'artisans qualifiés et faites une demande en quelques clics</h2>
            </section>

            <Filters 
                searchParams={searchParams}
                setSearchParams={setSearchParams}
            />

            <Listing 
                isLoading={isLoadingList} 
                listing={listing}
            />
        </main>
    );
}

export default FindCraftsman;