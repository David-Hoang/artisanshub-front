import './Badge.scss';

function Badge({children, color, ...props}) {
    return ( 
        <span className={color ? `badge ${color}` : "badge"}
            {...props}>
            {children && children}
        </span>
    );
}

export default Badge;