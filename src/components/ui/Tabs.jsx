import './Tabs.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

function Tabs({children, tabsList, selectedTab, setSelectedTab, className, ...props})
{
    return ( 
        <section className={className ? `tabs ${className}`: "tabs"}>
            <div className="tab-list">
                {tabsList && 
                    tabsList.map( (tab, index) => (
                        <button key={index} className={`tab-item ${ selectedTab === tab.title ? 'selected' : ''}`} 
                            onClick={ () => {setSelectedTab(tab.title)} }
                            disabled={tab.isLocked}
                            title={tab.isLocked ? tab.lockedMessage : undefined}
                        >
                            {tab.isLocked ? <FontAwesomeIcon icon={faLock}/> : tab.icon}
                            <span className="tab-title">{tab.title}</span>
                            {tab.notification && <span className="notification-tab-button"></span>}
                        </button>
                    ))
                }
            </div>
            {children}
        </section>
    );
}

export default Tabs;