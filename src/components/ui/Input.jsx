import './Input.scss'

function Input({label, symbol, ...props}) {
    return ( 
        <div className="input-wrapper">
            <label htmlFor={props.id}>
                {label}
            </label>
            <input {...props}/>
            {symbol && 
                <span className="symbol">
                    {symbol}
                </span>
            }
        </div>
    );
}

export default Input;