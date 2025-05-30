import './Dashboard.scss';
import { useState, useContext } from 'react';
import { AuthContext } from "../../../context/AuthContext.jsx";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGear, faComments, faReceipt } from '@fortawesome/free-solid-svg-icons';

import InformationsTab from './InformationsTab.jsx';
import MessagesTab from './MessagesTab.jsx';
import PrestationsTab from './PrestationsTab.jsx';


import Tabs from '../../ui/Tabs.jsx'
function Dashboard() {
    const {userDatas, userToken} = useContext(AuthContext);
    const [selectedTab, setSelectedTab] = useState('Informations');
        
    return ( 
        <>
            <Tabs 
                tabsList={[
                    {title : 'Informations', icon : <FontAwesomeIcon icon={faUserGear} />},
                    {title : 'Messages', icon : <FontAwesomeIcon icon={faComments} />},
                    {title : 'Prestations', icon : <FontAwesomeIcon icon={faReceipt} />},
                ]}
                selectedTab={selectedTab} setSelectedTab={setSelectedTab}
            >
                {selectedTab === 'Informations' &&
                    <InformationsTab userDatas={userDatas} token={userToken}/>
                }
                {selectedTab === 'Messages' &&
                    <MessagesTab />
                }
                {selectedTab === 'Prestations' &&
                    <PrestationsTab />
                }
            </Tabs>
        </>
    );
}

export default Dashboard;