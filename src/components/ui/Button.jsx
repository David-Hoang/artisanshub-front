import './Button.scss';
import { useNavigate } from "react-router-dom";

function Button({children, className, link, ...props}) {
    let navigate = useNavigate();

    return (
        <button 
            className={className}
            type="button" 
            onClick={link ? () => navigate(link) : props.onClick} 
            {...props}
        >
            
            {children}

        </button>
    );
}

export default Button;