import './InformationsTab.scss';

import UserInfosForm from "./elements/UserInfosForm.jsx";
import UserPasswordForm from "./elements/UserPasswordForm.jsx";
import CraftsmanInfosForm from "./elements/CraftsmanInfosForm.jsx";
import ClientInfosForm from "./elements/ClientInfosForm.jsx";
import UserPictureForm from "./elements/UserPictureForm.jsx";

function InformationsTab({userDatas, userToken, userRole}) {

    return ( 
        <div className="informations-tab">

            <UserInfosForm userDatas={userDatas} userToken={userToken}/>
            
            <UserPasswordForm userToken={userToken}/>

            {   
                userRole === "craftsman" 
                ? <CraftsmanInfosForm userDatas={userDatas} userToken={userToken} />
                    : userRole === "client" ?
                    <ClientInfosForm userDatas={userDatas} userToken={userToken}/>
                        : null
            }

            <UserPictureForm userDatas={userDatas} userToken={userToken}/>

        </div>
    );
}

export default InformationsTab;