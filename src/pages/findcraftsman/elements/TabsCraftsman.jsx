import "./TabsCraftsman.scss";
import { useState } from "react";

import Tabs from "../../../components/ui/Tabs.jsx"

import DetailsInformationsTab from "./DetailsInformationsTab.jsx";
import DetailsGalleryTab from "./DetailsGalleryTab.jsx";

function TabsCraftsman({craftsmanInfos}) {

    const [selectedTab, setSelectedTab] = useState('Informations')

    return ( 
        <Tabs 
            tabsList={[
                {title : 'Informations'},
                {title : 'Galerie'},
            ]}
            selectedTab={selectedTab} setSelectedTab={setSelectedTab}>

                {selectedTab === 'Informations' &&
                    <DetailsInformationsTab craftsmanInfos={craftsmanInfos}/>
                }
                {selectedTab === 'Galerie' &&
                    <DetailsGalleryTab craftsmanGallery={craftsmanInfos.gallery}/>
                }
        </Tabs>
    );
}

export default TabsCraftsman;