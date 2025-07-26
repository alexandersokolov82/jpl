// src/ImageUploadModal.js
import React, { useState } from 'react';

const ImageUploadModal = ({ item, onclose, onImageUploaded }) => {
    const [imageUrl, setImageUrl] = useState('');
    const [file, setFile] = useState(null);

    const handleUrlChange = (e) => {
        setImageUrl(e.target.value);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = () => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onImageUploaded(item.id, reader.result);
            };
            reader.readAsDataURL(file);
        } else if (imageUrl) {
            onImageUploaded(item.id, imageUrl);
        }
        onclose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Replace Thumbnail</h2>
                <div className="modal-body">
                    <div className="form-group">
                        <label htmlFor="imageUrl">Image URL</label>
                        <input type="text" id="imageUrl" value={imageUrl} onChange={handleUrlChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="file">Or upload a file</label>
                        <input type="file" id="file" onChange={handleFileChange} accept="image/*" />
                    </div>
                </div>
                <div className="modal-footer">
                    <button onClick={handleSubmit} className="save-button">Save</button>
                    <button onClick={onclose} className="cancel-button">Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default ImageUploadModal;
