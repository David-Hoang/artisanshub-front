import './Select.scss';

function SelectJobs({datas, label, ...props}) {
    return ( 
        <div className="select-wrapper">
            <label htmlFor={props.id}>{label}</label>
            <select {...props}>
                <option value="">
                    {props.placeholder}
                </option>
                {datas &&
                    datas.map( data => (
                        <option key={data.id} value={data.id}>{data.name}</option>
                    ))
                }
            </select>
        </div>
    );
}

export default SelectJobs;