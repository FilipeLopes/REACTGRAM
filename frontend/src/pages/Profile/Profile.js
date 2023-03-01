import "./Profile.css";

import { uploads } from "../../utils/config";

// Components
import Message from "../../components/Message";
import { Link } from "react-router-dom";
import { BsFillEyeFill, BsPencilFill, BsXLg } from "react-icons/bs";

// Hooks
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

// Redux
import { getUserDetails } from "../../slices/userSlice";
import { publishPhoto, resetMessage, getUserPhotos, deletePhoto, updatePhoto } from "../../slices/photoSlice";

const Profile = () => {

    const { id } = useParams();
    const dispatch = useDispatch();

    const { user, loading } = useSelector((state) => state.user);
    const { user: userAuth } = useSelector((state) => state.auth);
    const { photos, loading: loadingPhoto, message: messagePhoto, error: errorPhoto } = useSelector((state) => state.photo);

    const [title, setTitle] = useState("");
    const [image, setImage] = useState("");

    const [editId, setEditId] = useState("");
    const [editImage, setEditImage] = useState("");
    const [editTitle, setEditTitle] = useState("");
    const [imgForm, setImgForm] = useState(false);

    // New form and edit form refs
    const newPhotoForm = useRef();
    const editPhotoForm = useRef();

    //Load user data
    useEffect(() => {
        dispatch(getUserDetails(id));
        dispatch(getUserPhotos(id));
    }, [dispatch, id]);

    const handleFile = (e) => {
        const image = e.target.files[0];
        setImgForm(false);
        setImage(image);
    };

    const resetComponentMessage = () => {
        setTimeout(() => {
            dispatch(resetMessage());
        }, 2000);
    };

    const submitHandle = (e) => {
        e.preventDefault();

        console.log(image.name);
        if (!image.name.match(/\.(jpg|png)$/)) {
            
            setImgForm(true);
            return;
        }

        const photoData = {
            title,
            image,
        };

        // Build form data
        const formData = new FormData();
        const photoFormData = Object.keys(photoData).forEach((key) => formData.append(key, photoData[key]));

        formData.append("photo", photoFormData);

        dispatch(publishPhoto(formData));

        setTitle("");

        resetComponentMessage();

    };

    // Delete a photo
    const handleDelete = (id) => {
        dispatch(deletePhoto(id));
        resetComponentMessage();
    };

    // Show or hide form
    const hideOrShowForms = () => {
        newPhotoForm.current.classList.toggle("hide");
        editPhotoForm.current.classList.toggle("hide");
    };

    // Update a photo
    const handleUpdate = (e) => {
        e.preventDefault();

        const photoData = {
            title: editTitle,
            id: editId
        }

        dispatch(updatePhoto(photoData));

        resetComponentMessage();
    };

    // Open edit form
    const handleEdit = (photo) => {
        if (editPhotoForm.current.classList.contains("hide")) {
            hideOrShowForms();
        }

        setEditId(photo._id);
        setEditTitle(photo.title);
        setEditImage(photo.image);
    };

    const handelCancelEdit = (e) => {
        hideOrShowForms();

    };

    if (loading) {
        return <p>Loading...</p>;
    };

    return (
        <div id="profile">
            <div className="profile-header">
                {user.profileImage && (
                    <img src={`${uploads}/users/${user.profileImage}`} alt={user.name} />
                )}
                <div className="profile-description">
                    <h2>{user.name}</h2>
                    <p>{user.bio}</p>
                </div>
            </div>
            {id === userAuth._id && (
                <>
                    <div className="new-photo" ref={newPhotoForm}>
                        <h3>Share your moments: </h3>
                        <form onSubmit={submitHandle}>
                            <label>
                                <span>Photo title:</span>
                                <input type="text" placeholder="Insert a title" onChange={(e) => setTitle(e.target.value)} value={title || ""} />
                            </label>
                            <label>
                                <span>Image:</span>
                                <input type="file" onChange={handleFile} />
                            </label>
                            {!loadingPhoto && <input type="submit" value="Post" />}
                            {loadingPhoto && <input type="submit" disabled value="Wait..." />}
                            {imgForm && <p className="file-error">Your file must be .png or .jpg!</p>}
                        </form>
                    </div>
                    <div className="edit-photo hide" ref={editPhotoForm}>
                        <p>Editing:</p>
                        {editImage && (
                            <img src={`${uploads}/photos/${editImage}`} alt={editTitle} />
                        )}
                        <form onSubmit={handleUpdate}>
                            <input type="text" placeholder="Insert a title" onChange={(e) => setEditTitle(e.target.value)} value={editTitle || ""} />
                            <input type="submit" value="Update" />
                            <button className="cancel-btn" onClick={handelCancelEdit}>Cancel edit</button>
                        </form>
                    </div>
                    {errorPhoto && <Message msg={errorPhoto} type="error" />}
                    {messagePhoto && <Message msg={messagePhoto} type="success" />}
                </>
            )}
            <div className="user-photos">
                <h2>Published photos: </h2>
                <div className="photos-container">
                    {photos &&
                        photos.map((photo) => (
                            <div className="photo" key={photo._id}>
                                {photo.image && (
                                    <img
                                        src={`${uploads}/photos/${photo.image}`}
                                        alt={photo.title}
                                    />
                                )}
                                {id === userAuth._id ? (
                                    <div className="actions">
                                        <Link to={`/photos/${photo._id}`}>
                                            <BsFillEyeFill />
                                        </Link>
                                        <BsPencilFill onClick={() => { handleEdit(photo) }} />
                                        <BsXLg onClick={() => handleDelete(photo._id)} />
                                    </div>
                                ) : (<Link to={`/photos/${photo._id}`}><BsFillEyeFill /></Link>)}
                            </div>
                        ))}
                    {photos.length === 0 && <p>There are no published photos</p>}
                </div>
            </div>
        </div>
    )
}

export default Profile