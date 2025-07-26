import React from 'react';
import { motion } from 'framer-motion';
import ImageUploadModal from './ImageUploadModal';

export const Breadcrumbs = ({ items, onClick }) => (
    <nav className="breadcrumbs">
        {items.map((item, index) => (
            <span key={item.id}>
                <button onClick={() => onClick(index)}>{item.name}</button>
                {index < items.length - 1 && <span> / </span>}
            </span>
        ))}
    </nav>
);

export const DetailView = ({ item, onAddItem, onNavigate, onUpdateItem }) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const [editedCode, setEditedCode] = React.useState(item.code || item.id);
    const [editedDescription, setEditedDescription] = React.useState(item.description);
    const [editedChildrenCount, setEditedChildrenCount] = React.useState(item.children ? item.children.length : 0);
    const [editedDuration, setEditedDuration] = React.useState(item.duration);
    const [showModal, setShowModal] = React.useState(false);

    React.useEffect(() => {
        setEditedCode(item.code || item.id);
        setEditedDescription(item.description);
        setEditedChildrenCount(item.children ? item.children.length : 0);
        setEditedDuration(item.duration);
    }, [item]);

    const childTypeName = {
        project: 'Sequence',
        sequence: 'Scene',
        scene: 'Shot',
    }[item.type];

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        const updatedItem = { ...item, code: editedCode, description: editedDescription };
        if (item.type === 'shot') {
            updatedItem.duration = editedDuration;
        }
        onUpdateItem(updatedItem);
        setIsEditing(false);
    };

    const handleCancelClick = () => {
        setEditedCode(item.code || item.id);
        setEditedDescription(item.description);
        setEditedChildrenCount(item.children ? item.children.length : 0);
        setEditedDuration(item.duration);
        setIsEditing(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'code') setEditedCode(value);
        else if (name === 'description') setEditedDescription(value);
        else if (name === 'duration') setEditedDuration(Number(value));
    };

    const handleImageUploaded = (itemId, newImage) => {
        onUpdateItem({ ...item, image: newImage });
    };

    return (
        <div className="detail-view-container">
            <div className="detail-content">
                <div className="detail-header">
                    <h2>{item.name}</h2>
                    <span className="item-type">{item.type}</span>
                </div>
                <div className="detail-grid">
                    <span>Code</span>
                    {isEditing ? (
                        <input type="text" name="code" value={editedCode} onChange={handleChange} />
                    ) : (
                        <strong>{item.code || item.id}</strong>
                    )}

                    <span>Description</span>
                    {isEditing ? (
                        <textarea name="description" value={editedDescription} onChange={handleChange} />
                    ) : (
                        <p>{item.description}</p>
                    )}

                    {item.type === 'scene' && item.children && (
                        <>
                            <span>Shots</span>
                            {isEditing ? (
                                <input type="number" name="childrenCount" value={editedChildrenCount} onChange={handleChange} disabled />
                            ) : (
                                <p>{item.children.length}</p>
                            )}
                        </>
                    )}
                    {item.type === 'sequence' && item.children && (
                        <>
                            <span>Scenes</span>
                            {isEditing ? (
                                <input type="number" name="childrenCount" value={editedChildrenCount} onChange={handleChange} disabled />
                            ) : (
                                <p>{item.children.length}</p>
                            )}
                        </>
                    )}
                    {item.type === 'project' && item.children && (
                        <>
                            <span>Sequences</span>
                            {isEditing ? (
                                <input type="number" name="childrenCount" value={editedChildrenCount} onChange={handleChange} disabled />
                            ) : (
                                <p>{item.children.length}</p>
                            )}
                        </>
                    )}
                    {item.type === 'shot' && (item.duration !== undefined) && (
                        <>
                            <span>Duration</span>
                            {isEditing ? (
                                <input type="number" name="duration" value={editedDuration} onChange={handleChange} />
                            ) : (
                                <p>{item.duration} frames</p>                            
                            )}
                        </>
                    )}
                </div>
                <div className="actions">
                    {isEditing ? (
                        <>
                            <button onClick={handleSaveClick}>Save</button>
                            <button onClick={handleCancelClick}>Cancel</button>
                        </>
                    ) : (
                        <>
                            {childTypeName && <button onClick={onAddItem}>New {childTypeName}</button>}
                            <button onClick={handleEditClick}>Edit</button>
                            <button className="delete">Delete</button>
                            <button className="nav-button" onClick={() => onNavigate('prev')}>&larr;</button>
                            <button className="nav-button" onClick={() => onNavigate('next')}>&rarr;</button>
                        </>
                    )}
                </div>
            </div>
            <div className="detail-image-container">
                <div className="detail-image-container">
                <motion.img
                    key={item.image} // Animate when image changes
                    src={item.image}
                    alt={item.name}
                    className="detail-image"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                />
                <button className="edit-thumbnail-button" onClick={() => setShowModal(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                </button>
            </div>
            {showModal && <ImageUploadModal item={item} onclose={() => setShowModal(false)} onImageUploaded={handleImageUploaded} />}
                <button className="edit-thumbnail-button" onClick={() => setShowModal(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                </button>
            </div>
            {showModal && <ImageUploadModal item={item} onclose={() => setShowModal(false)} onImageUploaded={handleImageUploaded} />}
        </div>
    );
};

export const CardListView = ({ items, onItemClick }) => {
    const getChildTypeLabel = () => {
        if (!items || items.length === 0) return 'Items';
        const type = items[0].type;
        if (type === 'project') return 'Sequences';
        if (type === 'sequence') return 'Scenes';
        if (type === 'scene') return 'Shots';
        if (type === 'shot') return 'Duration';
        return 'Items';
    }

    return (
        <div className="card-list-view">
            <div className="card-header">
            </div>
            <div className="card-grid">
                <div className="card-list-header">
                    <div>Thumbnail</div>
                    <div>Code</div>
                    <div>Name</div>
                    <div>Description</div>
                    <div>{getChildTypeLabel()}</div>
                </div>
                {items.map((item, index) => (
                    <motion.div
                        key={item.id}
                        className="card"
                        onClick={() => onItemClick(item.id)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        layout
                    >
                        <img src={item.image.replace('/400/225', '/240/135')} alt={item.name} className="card-image" />
                        <div className="card-column card-column-code">
                            <p className="card-code">{item.code}</p>
                        </div>
                        <div className="card-column card-column-name">
                            <h3>{item.name}</h3>
                        </div>
                        <div className="card-column card-column-description">
                            <p className="card-description">{item.description}</p>
                        </div>
                        <div className="card-column card-column-info">
                            {item.type === 'project' && item.children && (
                                <p>{item.children.length} Sequences</p>
                            )}
                            {item.type === 'sequence' && item.children && (
                                <p>{item.children.length} Scenes</p>
                            )}
                            {item.type === 'scene' && item.children && (
                                <p>{item.children.length} Shots</p>
                            )}
                            {item.type === 'shot' && (item.duration !== undefined) && (
                                <p className="card-duration">{item.duration} frames</p>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};