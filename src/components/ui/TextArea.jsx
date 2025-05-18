import './TextArea.scss'

function TextArea({label, ...props}) {
    return ( 
        <div className="textarea-wrapper">
            <label htmlFor={props.id}>
                {label}
            </label>
            <textarea {...props} rows="8" />
        </div>
    );
}

export default TextArea;