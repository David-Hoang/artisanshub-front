import './Tabs.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

function Tabs({children, tabsList, selectedTab, setSelectedTab, ...props})
{
    return ( 
        <section className="tabs">
            <div className="tab-list">
                {tabsList && 
                    tabsList.map( (tab, index) => (
                        <button key={index} className={`tab-item ${ selectedTab === tab.title ? 'selected' : ''}`} 
                            onClick={ () => {setSelectedTab(tab.title)} }
                            disabled={tab.isLocked}
                            title={tab.isLocked ? tab.lockedMessage : undefined}
                        >
                            {tab.isLocked ? <FontAwesomeIcon icon={faLock}/> : tab.icon}
                            {tab.title}
                        </button>
                    ))
                }
            </div>
            {children}
        </section>
    );
}

export default Tabs;