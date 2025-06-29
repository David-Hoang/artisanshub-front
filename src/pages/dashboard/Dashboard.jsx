import './Dashboard.scss';
import { useState } from 'react';


import { PrestationsProvider } from "./context/PrestationsContext.jsx";
import Tabs from "../../components/ui/Tabs.jsx";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGear, faComments, faReceipt } from '@fortawesome/free-solid-svg-icons';

import InformationsTab from "./tabs/informations/InformationsTab.jsx";
import MessagesTab from "./tabs/messages/MessagesTab.jsx";
import PrestationsTab from "./tabs/prestations/PrestationsTab.jsx";

function Dashboard() {

    const [selectedTab, setSelectedTab] = useState('Informations');

    return ( 
        <main className="main-dashboard">
            <section className="dashboard-title">
                <h1>Bienvenue sur votre tableau de bord</h1>
                <h2>Accedez à vos informations, gérez vos messages et vos projets</h2>
            </section>

            <Tabs 
                tabsList={[
                    {title : 'Informations', icon : <FontAwesomeIcon icon={faUserGear} />},
                    {title : 'Messages', icon : <FontAwesomeIcon icon={faComments} />},
                    {title : 'Prestations', icon : <FontAwesomeIcon icon={faReceipt} />},
                ]}
                selectedTab={selectedTab} setSelectedTab={setSelectedTab}
            >

                {selectedTab === 'Informations' &&
                    <InformationsTab />
                }
                {selectedTab === 'Messages' &&
                    <MessagesTab />
                }
                {selectedTab === 'Prestations' &&
                    <PrestationsProvider>
                        <PrestationsTab />
                    </PrestationsProvider>
                }
            </Tabs>
            
        </main>
    );
}

export default Dashboard;