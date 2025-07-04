import "./Table.scss";

function Table({name, thead, children}) {
    return ( 
        <table>
            {name && 
                <caption>{name}</caption>
            }

            <thead>
                <tr>
                    {thead &&
                        thead.map( (name, key) => (
                            <th key={key} scope="col">
                                {name}
                            </th>
                        ))}
                </tr>
            </thead>

            <tbody>
                {children}
            </tbody>
        </table>
    );
}

export default Table;