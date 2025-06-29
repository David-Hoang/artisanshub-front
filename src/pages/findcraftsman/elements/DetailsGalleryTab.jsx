import "./DetailsGalleryTab.scss";
import { useState } from "react";

import Modal from "../../../components/ui/Modal";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';


function DetailsGalleryTab({craftsmanGallery}) {

    const apiBase = import.meta.env.VITE_MAIN_API_URI;

    const [isOpenModal, setIsOpenModal] = useState(false);
    const [selectedImgPath, setSelectedPath] = useState(null);

    const openLightBox = (img_path) => {
        setIsOpenModal(true);
        setSelectedPath(img_path);
    }

    const closeLightBox = () => {
        setIsOpenModal(false);
        setSelectedPath(null)
    }

    return (
        craftsmanGallery?.length > 0 
            ? 
            <>
                <ul className="craftsman-gallery">
                    {craftsmanGallery.map(photo => 
                        <li key={photo.id} className="photo-gallery" onClick={() => openLightBox(photo.img_path)}>
                            <img src={`${apiBase}/storage/${photo.img_path}`} />
                            <div className="filter-opacity">
                                <FontAwesomeIcon icon={faMagnifyingGlass} />
                            </div>
                        </li>
                    )}
                </ul>

                {isOpenModal &&
                    <Modal 
                        isOpen={isOpenModal} 
                        closeModal={closeLightBox} 
                        className="lightbox"
                    > 
                        <img className="full-photo" src={`${apiBase}/storage/${selectedImgPath}`} />
                    </Modal>
                }

            </>
            : <p>L'artisan n'a actuellement publié aucune photo dans sa galerie.</p>
    );
}


export default DetailsGalleryTab;