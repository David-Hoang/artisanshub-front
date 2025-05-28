import './TextArea.scss'

function TextArea({label, ...props}) {
    return ( 
        <div className="textarea-wrapper">
            <label htmlFor={props.id}>
                {label}
            </label>
            <textarea {...props} />
        </div>
    );
}

export default TextArea;