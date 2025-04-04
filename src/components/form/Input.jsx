import './Input.scss'

function Input({label, ...props}) {
    return ( 
        <div className="input-wrapper">
            <label htmlFor={props.id}>
                {label}
            </label>
            <input {...props}/>
        </div>
    );
}

export default Input;