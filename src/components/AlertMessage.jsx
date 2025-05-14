import './AlertMessage.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle, faCheck } from '@fortawesome/free-solid-svg-icons'

function AlertMessage({children, type}) {
    return ( 
        <div className={`alert-wrapper ${type === "success" ? 'success' : 'error'}`}>
            <div className="alert-icon-success">
                {type === "success" 
                    ?   <FontAwesomeIcon icon={faCheck} />
                    :   <FontAwesomeIcon icon={faExclamationTriangle} />
                }
            </div>
            <p className="alert-text">
                {children}
            </p>
        </div>
    );
}

export default AlertMessage;