import './Dashboard.scss';
import { useContext, useState } from 'react';

import { AuthContext } from "../../context/AuthContext.jsx";
import { PrestationsProvider } from "./context/PrestationsContext.jsx";
import { JobsProvider } from "./context/JobsContext.jsx";

import Tabs from "../../components/ui/Tabs.jsx";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGear, faComments, faReceipt, faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons';

import InformationsTab from "./tabs/informations/InformationsTab.jsx";
import MessagesTab from "./tabs/messages/MessagesTab.jsx";
import PrestationsTab from "./tabs/prestations/PrestationsTab.jsx";
import JobsTab from "./tabs/jobs/JobsTab.jsx";

function Dashboard() {

    const {hasCompletedProfile, isAdmin} = useContext(AuthContext);
    const [selectedTab, setSelectedTab] = useState('Informations');

    const tabsList = [
            {title : 'Informations', icon : <FontAwesomeIcon icon={faUserGear} />, notification : !hasCompletedProfile },
            {title : 'Messages', icon : <FontAwesomeIcon icon={faComments} />, isLocked : !hasCompletedProfile, lockedMessage : "Veuillez compléter votre profil pour utiliser cette fonctionnalité"},
            {title : 'Prestations', icon : <FontAwesomeIcon icon={faReceipt} />, isLocked : !hasCompletedProfile, lockedMessage : "Veuillez compléter votre profil pour utiliser cette fonctionnalité"}
        ];
    
    if(isAdmin) {
        tabsList.push({title : 'Métiers', icon : <FontAwesomeIcon icon={faScrewdriverWrench} />})
    }

    return ( 
        <main className="main-dashboard">
            <section className="dashboard-title">
                <h1>Bienvenue sur votre tableau de bord {isAdmin && "administrateur"}</h1>
                <h2>
                    {isAdmin 
                        ? "Consultez l’activité de la plateforme, gérez les utilisateurs et modérez les contenus."
                        : "Accedez à vos informations, gérez vos messages et vos projets"
                    }
                    </h2>
            </section>

            <Tabs 
                tabsList={tabsList}
                selectedTab={selectedTab} 
                setSelectedTab={setSelectedTab}
            >

                {selectedTab === 'Informations' &&
                    <InformationsTab />
                }
                {selectedTab === 'Messages' && hasCompletedProfile &&
                    <MessagesTab />
                }
                {selectedTab === 'Prestations' && hasCompletedProfile &&
                    <PrestationsProvider>
                        <PrestationsTab />
                    </PrestationsProvider>
                }

                {selectedTab === 'Métiers' && hasCompletedProfile && isAdmin &&
                    <JobsProvider>
                        <JobsTab />
                    </JobsProvider>
                }
            </Tabs>
            
        </main>
    );
}

export default Dashboard;