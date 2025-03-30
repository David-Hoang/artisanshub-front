import './Error.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'

function Error({children}) {
    return ( 
        <div className="error-wrapper">
            <div className="error-icon">
                <FontAwesomeIcon icon={faExclamationTriangle} />
            </div>
            <p className="error-text">
                {children}
            </p>
        </div>
    );
}

export default Error;