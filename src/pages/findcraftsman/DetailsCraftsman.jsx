import './DetailsCraftsman.scss';
import { useParams, useNavigate  } from "react-router-dom";
import { useState, useEffect, useContext } from 'react';
import axios from "axios";

import { AuthContext } from "../../context/AuthContext.jsx";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

import HeroCraftsman from "./elements/HeroCraftsman";
import CtaContact from "./elements/CtaContact.jsx";

import Button from "../../components/ui/Button.jsx";
import SpinLoader from "../../components/ui/SpinLoader.jsx";
import TabsCraftsman from "./elements/TabsCraftsman.jsx";

function DetailsCraftsman() {
    const apiBase = import.meta.env.VITE_MAIN_API_URI;
    const navigate = useNavigate()

    const craftsmanId = useParams().craftsmanId;
    const {userToken, userRole} = useContext(AuthContext)

    const [craftsmanInfos, setCraftsmanInfo] = useState(null);
    const [isLoadingInfos, setIsloadingInfos] = useState(false);

    const fetchCraftsmanInfos = async () => {
        setIsloadingInfos(true);

        try {

            let response;

            if(userToken){
                response = await axios.get(`${apiBase}/api/craftsman/private/${craftsmanId}`, 
                    { headers: {
                        "Authorization": "Bearer " + userToken,
                    }
                });
            } else {
                response = await axios.get(`${apiBase}/api/craftsman/public/${craftsmanId}`);
            }
                
            if(response.status === 200){
                setCraftsmanInfo(response.data);
            }
            
        } catch (error) {
            console.log(error);
        } finally {
            setIsloadingInfos(false)
        }
    }

    useEffect(() => {
        fetchCraftsmanInfos()
    }, []);
    
    return ( 
        <main className="main-details-craftsman">

            <div className="btn-container">
                <Button className="btn-primary" onClick={() => navigate(-1)}>
                    <FontAwesomeIcon icon={faArrowLeft} transform="left-5"/>
                    Retour
                </Button>
            </div>
            
            {isLoadingInfos 
                ? <SpinLoader />
                : craftsmanInfos 
                    ? ( 
                        <>
                            <HeroCraftsman craftsmanInfos={craftsmanInfos} />

                            {/* Button contact + prestation */}
                            {userRole === 'client' &&
                                <CtaContact craftsmanInfos={craftsmanInfos}/>
                            }

                            <div className="tab-content">
                                <TabsCraftsman craftsmanInfos={craftsmanInfos} />
                            </div>
                        </>
                    ) : <p>L'artisan n'a pas pu être chargé.</p>
            }

        </main>
    );
}

export default DetailsCraftsman;