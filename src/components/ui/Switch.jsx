import './Switch.scss'

function Switch({label, ...props}) {
    return (
        <div className="switch-input">
            <p className="label-switch">
                {label}
            </p>
            <label htmlFor={props.id} className="switch">
                <input type="checkbox" {...props}/>
                <span className="slider"></span>
            </label>
        </div>
    );
}

export default Switch;