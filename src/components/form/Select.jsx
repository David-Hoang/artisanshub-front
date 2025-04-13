import './Select.scss';


function Select({label, datas, ...props}) {
    return ( 
        <div className="select-wrapper">
            <label htmlFor={props.id}>{label}</label>
            <select {...props}>
                <option value="">{props.placeholder}</option>
                {datas &&
                    datas.map( (data, key) => (
                        <option key={key} value={data}>{data}</option>
                    ))
                }
            </select>
        </div>
    );
}

export default Select;