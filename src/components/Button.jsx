import './Button.scss';
import { Link } from "react-router-dom";

function Button({children, link, className}) {
    return (
        link ? 
            <Link to={link}>
                <button type="button" className={className}>
                    {children}
                </button>
            </Link>
        :
        <button className="btn">
            {children}
        </button>
    );
}

export default Button;
