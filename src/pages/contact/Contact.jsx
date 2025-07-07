import "./Contact.scss"
import { useState } from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

import Input from "../../components/ui/Input";
import TextArea from "../../components/ui/TextArea";
import Button from "../../components/ui/Button";

function Contact() {

    const [guessContact, setGuessContact] = useState({
        first_name : "",
        last_name : "",
        phone : "",
        email : "",
        message_content : ""
    })

    return ( 
        <main id="main-contact-page">
            <div className="contact-header">
                <h1>Une question ?</h1>
                <h2>Besoin d'aide ou d'informations ? Remplissez le formulaire ci-dessous et nous vous répondrons rapidement.</h2>
            </div>

            <form id="guess-contact-form">

                <h3>Nous contacter</h3>

                {/* Name */}
                <div className="wrapper">
                    <Input
                        label="Nom *" 
                        id="last_name"
                        type="text" 
                        placeholder="Doe" 
                        autoComplete="off"
                        value={guessContact.last_name}
                        onChange={(e) => setGuessContact({...guessContact, last_name : e.target.value})}
                        />

                    <Input
                        label="Prénom *" 
                        id="first_name"
                        type="text" 
                        placeholder="John" 
                        autoComplete="off"
                        value={guessContact.first_name}
                        onChange={(e) => setGuessContact({...guessContact, first_name : e.target.value})}
                        />
                    </div>

                {/* Infos */}
                <div className="wrapper">
                    <Input label="Email *" id="email" type="email"
                        value={guessContact.email} placeholder="john.doe@gmail.com"
                        onChange={(e) => { setGuessContact({...guessContact, email : e.target.value}) }}
                    />

                    <Input label="Téléphone*" id="phone" type="phone" pattern="^0\d{9}$"
                        value={guessContact.phone} placeholder="0123456789"
                        onChange={(e) => { setGuessContact({...guessContact, phone : e.target.value}) }}
                    />
                </div>
                
                <TextArea 
                    label="Message *"  
                    value={guessContact.message_content}
                    onChange={(e) => { setGuessContact({...guessContact, message_content : e.target.value}) }}
                />

                <Button className="btn-primary">
                    Envoyer
                    <FontAwesomeIcon icon={faPaperPlane} />
                </Button>
            </form>
        </main>
    );
}

export default Contact;