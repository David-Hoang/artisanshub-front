import "./CraftsmanGallery.scss";
import { useContext, useState, useEffect } from "react";
import axios from "axios";

import { AuthContext } from "../../../../../context/AuthContext";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faTrash, faCloud } from '@fortawesome/free-solid-svg-icons';

import AlertMessage from "../../../../../components/AlertMessage";

function CraftsmanGallery({galleryToForm, setGalleryToForm, alertGallery, setAlertGallery, resetPreview}) {

    const apiBase = import.meta.env.VITE_MAIN_API_URI;
    const {userToken, reFetchUserDatas, userDatas} = useContext(AuthContext)

    const [previewGallery, setPreviewGallery] = useState([]);

    //empty array or array of object
    const [craftsmanGallery, setCraftsmanGallery] = useState([]); 

    //refresh component on delete active gallery photo
    useEffect(() => {
        setCraftsmanGallery(userDatas.craftsman.gallery);
    }, [userDatas]);

    //to refresh preview on upload infos
    useEffect(() => {
        setPreviewGallery([]);
    }, [resetPreview]);

    const handleGallery = (e) => {

        // Transform into an array
        const filesToArray = Array.from(e.target.files);

        const newPreviews = filesToArray.map(file => URL.createObjectURL(file));
        
        //put array FileList into previewGallery state
        setPreviewGallery(prev => [...prev, ...newPreviews]);

        //put array FileList into galleryForm state
        setGalleryToForm(prev => [...prev, ...e.target.files]);
    }

    const removePreviewPicture = (key) => {
        //remove from preview
        setPreviewGallery([
            ...previewGallery.slice(0, key),
            ...previewGallery.slice(key + 1)
        ]);

        //preview from gallerytofrom
        setGalleryToForm([
            ...galleryToForm.slice(0, key),
            ...galleryToForm.slice(key + 1)
        ]);

    }

    const deletePhotoGallery = async (photoId) => {

        setAlertGallery({type : "", message : ""});

        try{
            const response = await axios.delete(`${apiBase}/api/photo-gallery/${photoId}`,
                { headers: 
                    {"Authorization": `Bearer ${userToken}`
                } 
            })

            if(response.status === 200){
                setAlertGallery({...alertGallery, type:"success", message : "La photo a été supprimé avec succès."});
                reFetchUserDatas();
            } 

        }catch(error) {
            const { status, data } = error.response;

            if(status === 404){
                setAlertGallery({...alertGallery, type : "error", message : data.message})
            } else {
                setAlertGallery({...alertGallery, type : "error", message : "Une erreur est survenue durant la suppression de la photo."})
            }
        }
    }

    return (
        <div className="craftsman-gallery">
            <h2>Galerie de photo</h2>

            {craftsmanGallery.length > 0 
                ?   <>
                        <ul className="gallery gallery-photos">
                            {craftsmanGallery.map(photo => (
                                <li key={photo.id} className="item-photo">
                                    <img src={`${apiBase}/storage/${photo.img_path}`} />

                                    <div className="filter-opacity">
                                        <button type="button" className="button-delete-preview"
                                            onClick={() => deletePhotoGallery(photo.id)}>
                                            <FontAwesomeIcon icon={faTrash}/>
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {alertGallery.message && alertGallery.type === "success" &&
                            <AlertMessage type="success">{alertGallery.message}</AlertMessage>
                        }
                        {alertGallery.message && alertGallery.type === "error" &&
                            <AlertMessage type="error">{alertGallery.message}</AlertMessage>
                        }

                    </>
                : <p>Vous n'avez pas encore ajouté de photos dans votre galerie.</p>
            }

            <div className="dropzone-gallery">
                <div className="upload-animation">
                    <FontAwesomeIcon icon={faCloud} />
                    <FontAwesomeIcon icon={faArrowUp} />
                </div>
                <label htmlFor="gallery">Déposez ou sélectionnez vos images</label>
                <input
                    id="gallery"
                    type="file"
                    multiple
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    onChange={(e) => handleGallery(e)}
                    />
            </div>
            
            {previewGallery && previewGallery.length > 0 &&
                <>
                    <h3>Prévisualisation</h3>
                    <ul className="gallery preview-gallery">
                        {previewGallery.map((imgPath, key) => (
                            <li key={key} className="preview-photo">
                                <img src={imgPath}/>
                                <div className="filter-opacity">
                                    <button type="button" className="button-delete-preview"
                                        onClick={() => removePreviewPicture(key)}>
                                        <FontAwesomeIcon icon={faTrash}/>
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </>
            }

        </div>
    );
}

export default CraftsmanGallery;
