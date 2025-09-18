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
    const [editedStudio, setEditedStudio] = React.useState(item.studio);
    const [showModal, setShowModal] = React.useState(false);

    React.useEffect(() => {
        setEditedCode(item.code || item.id);
        setEditedDescription(item.description);
        setEditedChildrenCount(item.children ? item.children.length : 0);
        setEditedDuration(item.duration);
        setEditedStudio(item.studio);
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
        const updatedItem = { ...item, code: editedCode, description: editedDescription, studio: editedStudio };
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
        setEditedStudio(item.studio);
        setIsEditing(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'code') setEditedCode(value);
        else if (name === 'description') setEditedDescription(value);
        else if (name === 'duration') setEditedDuration(Number(value));
        else if (name === 'studio') setEditedStudio(value);
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

                    <span>Studio</span>
                    {isEditing ? (
                        <select name="studio" value={editedStudio} onChange={handleChange}>
                            <option value="Universal">Universal</option>
                            <option value="Warner Bros.">Warner Bros.</option>
                            <option value="Sony">Sony</option>
                        </select>
                    ) : (
                        <p>{item.studio}</p>
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
    const [sortConfig, setSortConfig] = React.useState({ key: 'name', direction: 'ascending' });

    const sortedItems = React.useMemo(() => {
        let sortableItems = [...items];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                if (sortConfig.key === 'children') {
                    aValue = a.children ? a.children.length : (a.duration || 0);
                    bValue = b.children ? b.children.length : (b.duration || 0);
                }

                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [items, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getChildTypeLabel = (item) => {
        if (!item) return 'Items';
        const type = item.type;
        if (type === 'project') return 'Sequences';
        if (type === 'sequence') return 'Scenes';
        if (type === 'scene') return 'Shots';
        if (type === 'shot') return 'Duration';
        return 'Items';
    }

    const getSortIndicator = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'ascending' ? '▲' : '▼';
        }
        return '▲';
    };

    return (
        <div className="card-list-view">
            <div className="card-header">
            </div>
            <div className="card-grid">
                <div className="card-list-header">
                    <div className="header-item">Thumbnail <button onClick={() => requestSort('image')} className="sort-button">{getSortIndicator('image')}</button></div>
                    <div className="header-item">Code <button onClick={() => requestSort('code')} className="sort-button">{getSortIndicator('code')}</button></div>
                    <div className="header-item">Name <button onClick={() => requestSort('name')} className="sort-button">{getSortIndicator('name')}</button></div>
                    <div className="header-item">Description <button onClick={() => requestSort('description')} className="sort-button">{getSortIndicator('description')}</button></div>
                    <div className="header-item">Studio <button onClick={() => requestSort('studio')} className="sort-button">{getSortIndicator('studio')}</button></div>
                    <div className="header-item">Info <button onClick={() => requestSort('children')} className="sort-button">{getSortIndicator('children')}</button></div>
                </div>
                {sortedItems.map((item, index) => (
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
                        <div className="card-column card-column-studio">
                            <p className="card-studio">{item.studio}</p>
                        </div>
                        <div className="card-column card-column-info">
                            {item.type === 'project' && item.children && (
                                <p>{item.children.length} {getChildTypeLabel(item)}</p>
                            )}
                            {item.type === 'sequence' && item.children && (
                                <p>{item.children.length} {getChildTypeLabel(item)}</p>
                            )}
                            {item.type === 'scene' && item.children && (
                                <p>{item.children.length} {getChildTypeLabel(item)}</p>
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
