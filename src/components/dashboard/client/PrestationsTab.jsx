import './PrestationsTab.scss';
import { useState, useContext, useEffect } from 'react';
import axios from "axios";

import { AuthContext } from "../../../context/AuthContext";
import Button from "../../ui/Button";
import Badge from "../../ui/Badge";

function PrestationsTab() {

    const apiBase = import.meta.env.VITE_MAIN_API_URI;
    const { userToken } = useContext(AuthContext);

    const [userPrestations, setUserPrestations] = useState(null)

    const fetchUserPrestations = async () => { 
        try {
            const response = await axios.get(`${apiBase}/api/prestations`, {
                    headers: {
                        "Authorization": "Bearer " + userToken,
                    }
                })
            setUserPrestations(response.data);
            console.log(response.data);
            
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchUserPrestations();
    }, []);

    return ( 
        <div className="prestations-tab-client">
                {userPrestations
                    ? userPrestations.map(pres => (
                        <article key={pres.id} className="prestation-card">
                            <div className="wrapper">
                                <div className="prestation-header">
                                    <h3 className="prestation-title">{pres.title.charAt(0).toUpperCase() + pres.title.slice(1)}</h3>
                                    <p className="craftsman-name">Artisan : {pres.craftsman?.user?.last_name} {pres.craftsman?.user?.first_name}</p>

                                    {pres.state === "await-craftsman" && <Badge color="pending">En attente artisan</Badge> }
                                    {pres.state === "await-client" && <Badge color="pending">En attente client</Badge> }
                                    {pres.state === "confirmed" && <Badge color="info">Prestation confirmé</Badge> }
                                    {pres.state === "completed" && <Badge color="success">Prestation complété</Badge> }
                                    {pres.state === "refused-by-client" && <Badge color="danger">Refusé par le client</Badge> }
                                    {pres.state === "refused-by-craftsman" && <Badge color="danger">Refusé par l'artisan</Badge> }
                                </div>
                                <p className="prestation-date">Date : {pres.date ? pres.date : 'Non définie'} </p>
                            </div>
                            <Button className="btn-primary">Voir les détails</Button>
                        </article>
                    ))
                    : <p>Vous n'avez pas de prestations en cours.</p>
                }
        </div>
    );
}

export default PrestationsTab;