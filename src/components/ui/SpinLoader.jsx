import "./SpinLoader.scss";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'

function SpinLoader ({className, ...props}) {
    return ( 
        <FontAwesomeIcon 
            spin={true}
            icon={faCircleNotch} 
            className={`fa-spin ${className}`}
            {...props}
        />
    );
}

export default SpinLoader;