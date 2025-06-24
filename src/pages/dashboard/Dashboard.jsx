import './Dashboard.scss';
import { useContext, useState } from 'react';
import { AuthContext } from "../../context/AuthContext.jsx";

import { PrestationsProvider } from "./context/PrestationsContext.jsx";
import Tabs from "../../components/ui/Tabs.jsx";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGear, faComments, faReceipt } from '@fortawesome/free-solid-svg-icons';

import InformationsTab from "./tabs/informations/InformationsTab.jsx";
import MessagesTab from "./tabs/messages/MessagesTab.jsx";
import PrestationsTab from "./tabs/prestations/PrestationsTab.jsx";
import PrestationsTabCrafts from "../../components/dashboard/craftsman/PrestationsTab.jsx";


function Dashboard() {

    const {userRole, userDatas, userToken} = useContext(AuthContext);
    
    const [selectedTab, setSelectedTab] = useState('Prestations');

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
                    <InformationsTab userDatas={userDatas} userToken={userToken} userRole={userRole} />
                }
                {selectedTab === 'Messages' &&
                    <MessagesTab userDatas={userDatas} userToken={userToken} userRole={userRole} />
                }
                {selectedTab === 'Prestations' && userRole === 'client' &&
                    <PrestationsProvider>
                        <PrestationsTab userToken={userToken} userRole={userRole} />
                    </PrestationsProvider>
                }
                {selectedTab === 'Prestations' && userRole === 'craftsman' &&
                        <PrestationsTabCrafts/>
                }
                
            </Tabs>
            
        </main>
    );
}

export default Dashboard;