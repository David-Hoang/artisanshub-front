import './InformationsTab.scss';
import { useContext } from 'react';
import { AuthContext } from "../../../../context/AuthContext.jsx";

import UserInfosForm from "./elements/UserInfosForm.jsx";
import UserPasswordForm from "./elements/UserPasswordForm.jsx";
import CraftsmanInfosForm from "./elements/CraftsmanInfosForm.jsx";
import ClientInfosForm from "./elements/ClientInfosForm.jsx";
import UserPictureForm from "./elements/UserPictureForm.jsx";

function InformationsTab() {

    const {userRole, isAdmin} = useContext(AuthContext);

    return ( 
        <div className="informations-tab">

            <UserInfosForm />
            
            <UserPasswordForm/>

            {   
                userRole === "craftsman"
                ? <CraftsmanInfosForm />
                    : userRole === "client" ?
                    <ClientInfosForm />
                        : null
            }

            { !isAdmin &&
                <UserPictureForm />
            }

        </div>
    );
}

export default InformationsTab;