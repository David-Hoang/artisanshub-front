import './Home.scss';
import HeroImg from '../../assets/img/home-hero-small.webp';

import { Link } from "react-router-dom";
import { useContext } from "react";
import { ApiServicesContext } from "../../context/ApiServicesContext.jsx";

import Search from './elements/Search.jsx';
import JobCard from './elements/JobCard.jsx';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faComments, faHandshakeSimple } from '@fortawesome/free-solid-svg-icons';

function Home() {

    const { jobsCategories } = useContext(ApiServicesContext);

    return ( 
        <main id="main-home">
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
                    {/* Search form */}
                    <Search />

                    {/* Jobs cards */}
                    <JobCard jobsCategories={jobsCategories}/>

                </div>
                <div className="content-work">
                    <section className="work-section">
                        <div className="work-title">
                            <h2>Comment ça fonctionne ?</h2>
                            <h3>En quelques étapes, entrez en connexion avec un artisan.</h3>
                        </div>
                        <div className="step-container">
                            <div className="step-item">
                                <div className="step-bg">
                                    <FontAwesomeIcon icon={faMagnifyingGlass} className="step-icon" />
                                </div>
                                <h2 className="step-title">Recherchez un artisan</h2>
                                <p className="step-desc">Parcourez à travers nos différentes catégories et trouvez l'artisan professionnel près de chez vous.</p>
                            </div>
                            <div className="step-item">
                                <div className="step-bg">
                                    <FontAwesomeIcon icon={faComments} className="step-icon" />
                                </div>
                                <h2 className="step-title">Échangez avec l'artisan</h2>
                                <p className="step-desc">Contactez directement les artisans pour discuter des exigences de votre projet et demander des devis.</p>
                            </div>
                            <div className="step-item">
                                <div className="step-bg">
                                    <FontAwesomeIcon icon={faHandshakeSimple} className="step-icon" />
                                </div>
                                <h2 className="step-title">Passez un accord et réalisez !</h2>
                                <p className="step-desc">Choisissez l'artisan idéal pour votre projet et obtenez des résultats de qualité.</p>
                            </div>
                        </div>
                    </section>
                </div>
        </main>
    );
}

export default Home;