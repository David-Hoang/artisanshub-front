import './Home.scss';
import HeroImg from '../assets/img/home-hero.jpg';

import { Link } from "react-router-dom";
import { useContext } from "react";
import { JobsCatContext } from "../context/JobsCatContext.jsx";

import Search from '../components/home/Search.jsx';
import JobCard from '../components/home/JobCard.jsx';


function Home() {
    
    const { jobsCategories } = useContext(JobsCatContext);

    return ( 
        <main className="main-home">
                <section className="hero">
                    <div className="hero-content">
                        <h1 className="hero-title">
                            Simplifiez vos travaux, trouvez l'artisan qu'il vous faut.
                        </h1>
                        <h2 className="hero-subtitle">
                            Un intérieur à transformer ? Un jardin à imaginer ? Des artisans passionnés vous accompagnent, tout près de chez vous, pour donner vie à vos projets.
                        </h2>
                        <div className="hero-btn">
                            <Link to="/trouver-artisan" className="a-btn-primary">Trouver un artisan</Link>
                            <Link to="/inscription" className="a-btn-secondary">Nous rejoindre</Link>
                        </div>
                    </div>
                    <div className="hero-img">
                        <img src={HeroImg} alt="Hero Image" />
                    </div>
                </section>
                <div className="content">
                    <Search
                        //Transform to an array of name only
                        jobsCategories={
                            jobsCategories.length > 1 ?
                            jobsCategories.map(job => job.name) : 
                            null
                        }
                    />

                    <JobCard jobsCategories={jobsCategories}/>

                </div>
        </main>
    );
}

export default Home;