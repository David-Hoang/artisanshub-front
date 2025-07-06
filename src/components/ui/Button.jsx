import './Button.scss';
import { useNavigate } from "react-router-dom";

function Button({children, className, type, link, ...props}) {
    let navigate = useNavigate();

    return (
        <button 
            className={className}
            type={type ? type : 'button'}
            onClick={link ? () => navigate(link) : props.onClick} 
            {...props}
        >
            
            {children}

        </button>
    );
}

export default Button;