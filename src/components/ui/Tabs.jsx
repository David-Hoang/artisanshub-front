import './Tabs.scss';

function Tabs({children, tabsList, selectedTab, setSelectedTab, ...props})
{
    return ( 
        <section className="tabs">
            <div className="tab-list">
                {tabsList && 
                    tabsList.map( (tab, index) => (
                        <button key={index} className={`tab-item ${ selectedTab === tab.title ? 'selected' : ''}`} 
                            onClick={ () => {setSelectedTab(tab.title)} }>
                            {tab.icon}
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