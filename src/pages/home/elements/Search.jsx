import './Search.scss';

import Button from "../../../components/ui/Button.jsx";
import Input from "../../../components/ui/Input.jsx";
import Select from "../../../components/ui/Select.jsx";

function Search({jobsCategories, ...props}) {

    return ( 
        <section className="home-search">
            <form className="home-search-form">
                <h2>Votre projet commence ici.</h2>
                <div className="wrapper">

                    <Select 
                        label="Que recherchez-vous ?"
                        id="job"
                        selectPlaceholder="Sélectionnez une catégorie"
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