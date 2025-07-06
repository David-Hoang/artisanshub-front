import './Select.scss';


function Select({label, selectPlaceholder, datas, datasValues, ...props}) {
    
    return ( 
        <div className="select-wrapper">
            <label htmlFor={props.id}>{label}</label>
            <select id={props.id} {...props}>
                <option value="">{selectPlaceholder}</option>
                {datas &&
                    datas.map( (data, key) => (
                        <option key={key} value={data}>{data}</option>
                    ))
                }
                {datasValues &&
                    datasValues.map( data => (
                        <option key={data.value} value={data.value}>{data.label}</option>
                    ))
                }
            </select>
        </div>
    );
}

export default Select;