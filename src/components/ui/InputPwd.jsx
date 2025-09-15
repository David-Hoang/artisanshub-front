import './InputPwd.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";


function InputPwd({label, ...props}) {

    const [pwdShow, setPwdShow] = useState(false);

    return ( 
        <div className="input-wrapper">
            <label htmlFor={props.id}>
                {label}
            </label>
            <input 
                type={pwdShow ? 'text' : 'password'}
                {...props} 
            />
            <button type="button" className="show-pwd" title={pwdShow ? 'Cacher le mot de passe' : 'Afficher le mot de passe'}
                onClick={() => setPwdShow(!pwdShow)}>
                    <FontAwesomeIcon icon={pwdShow ? faEyeSlash : faEye} />
            </button>
        </div>
    );
}

export default InputPwd;