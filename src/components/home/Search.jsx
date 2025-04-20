import './Search.scss';

import Button from "../Button.jsx";
import Input from "../form/Input.jsx";
import Select from "../form/Select.jsx";

function Search({jobsCategories, ...props}) {

    return ( 
        <section className="home-search">
            <form className="home-search-form">
                <h2>Votre projet commence ici.</h2>
                <div className="wrapper">

                    <Select 
                        label="Que recherchez-vous ?"
                        id="job"
                        placeholder="Sélectionnez une catégorie"
                        datas={jobsCategories}
                    />

                    <Input
                        label="Location"
                        id="location"
                        type="text"
                        placeholder="Renseignez la ville ou le code postal"
                        autoComplete="off"
                    />
                </div>

                <Button className="btn-primary">Rechercher</Button>
            </form>
        </section>
    );
}

export default Search;