import React from 'react';
import { motion } from 'framer-motion';
import ImageUploadModal from './ImageUploadModal';

export const TabNavigation = ({ activeTab, onTabChange }) => {
    const tabs = ['Main', 'Previs Shots', 'Previs Assets', 'Previs Budget'];

    return (
        <nav className="tab-navigation">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => onTabChange(tab)}
                >
                    {tab}
                </button>
            ))}
        </nav>
    );
};

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

export const DetailView = ({ item, onAddItem, onNavigate, onUpdateItem, onDeleteItem }) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const [editedName, setEditedName] = React.useState(item.name);
    const [editedCode, setEditedCode] = React.useState(item.code || item.id);
    const [editedDescription, setEditedDescription] = React.useState(item.description);
    const [editedChildrenCount, setEditedChildrenCount] = React.useState(item.children ? item.children.length : 0);
    const [editedDuration, setEditedDuration] = React.useState(item.duration);
    const [editedStudio, setEditedStudio] = React.useState(item.studio);
    const [showModal, setShowModal] = React.useState(false);
    const [errors, setErrors] = React.useState({});

    React.useEffect(() => {
        setEditedName(item.name);
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
        // Validation
        const newErrors = {};

        if (!editedName.trim()) {
            newErrors.name = true;
        }
        if (!editedCode.trim()) {
            newErrors.code = true;
        }
        if (!editedDescription.trim()) {
            newErrors.description = true;
        }
        if (item.type === 'shot' && (editedDuration < 0 || isNaN(editedDuration))) {
            newErrors.duration = true;
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            alert('Please fix the highlighted fields before saving');
            return;
        }

        const updatedItem = { ...item, name: editedName, code: editedCode, description: editedDescription, studio: editedStudio };
        if (item.type === 'shot') {
            updatedItem.duration = editedDuration;
        }
        onUpdateItem(updatedItem);
        setErrors({});
        setIsEditing(false);
    };

    const handleCancelClick = () => {
        setEditedName(item.name);
        setEditedCode(item.code || item.id);
        setEditedDescription(item.description);
        setEditedChildrenCount(item.children ? item.children.length : 0);
        setEditedDuration(item.duration);
        setEditedStudio(item.studio);
        setErrors({});
        setIsEditing(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'name') setEditedName(value);
        else if (name === 'code') setEditedCode(value);
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
                    {isEditing ? (
                        <input type="text" name="name" value={editedName} onChange={handleChange} className={errors.name ? 'invalid' : ''} />
                    ) : (
                        <h2>{item.name}</h2>
                    )}
                    <span className="item-type">{item.type}</span>
                </div>
                <div className="detail-grid">
                    <span>Code</span>
                    {isEditing ? (
                        <input type="text" name="code" value={editedCode} onChange={handleChange} className={errors.code ? 'invalid' : ''} />
                    ) : (
                        <strong>{item.code || item.id}</strong>
                    )}

                    <span>Description</span>
                    {isEditing ? (
                        <textarea name="description" value={editedDescription} onChange={handleChange} className={errors.description ? 'invalid' : ''} />
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
                                <input type="number" name="duration" value={editedDuration} onChange={handleChange} className={errors.duration ? 'invalid' : ''} />
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
                            <button className="delete" onClick={() => onDeleteItem(item.id)} disabled={item.type === 'project'}>Delete</button>
                            <button className="nav-button" onClick={() => onNavigate('prev')}>&larr;</button>
                            <button className="nav-button" onClick={() => onNavigate('next')}>&rarr;</button>
                        </>
                    )}
                </div>
            </div>
            <div className="detail-image-container">
                <motion.img
                    key={item.image}
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
        </div>
    );
};

export const PrevisShotsView = ({ data, onShotClick }) => {
    // Extract all shots from data
    const allShots = Object.values(data).filter(item => item.type === 'shot');

    return (
        <div className="previs-shots-view">
            <div className="shots-grid">
                {allShots.map((shot) => (
                    <div key={shot.id} className="shot-card" onClick={() => onShotClick(shot.id)}>
                        <img src={shot.image} alt={shot.name} className="shot-thumbnail" />
                        <h3 className="shot-name">{shot.name}</h3>
                        <p className="shot-code">{shot.code}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const PrevisAssetsView = () => {
    const assetCategories = [
        {
            id: 'characters',
            name: 'Characters',
            items: [
                { id: 'char_01', name: 'Jack Torrance', image: 'https://alexandersokolov.com/continuity/thumbnails/shining_thumb_0067.jpg' },
                { id: 'char_02', name: 'Wendy Torrance', image: 'https://alexandersokolov.com/continuity/thumbnails/shining_thumb_0082.jpg' },
                { id: 'char_03', name: 'Danny Torrance', image: 'https://alexandersokolov.com/continuity/thumbnails/shining_thumb_0048.jpg' },
                { id: 'char_04', name: 'Dick Hallorann', image: 'https://alexandersokolov.com/continuity/thumbnails/shining_thumb_0039.jpg' },
                { id: 'char_05', name: 'The Grady Twins', image: 'https://alexandersokolov.com/continuity/thumbnails/shining_thumb_0013.jpg' },
            ]
        },
        {
            id: 'environments',
            name: 'Environments',
            items: [
                { id: 'env_01', name: 'Overlook Hotel Exterior', image: 'https://alexandersokolov.com/continuity/thumbnails/shining_thumb_0088.jpg' },
                { id: 'env_02', name: 'Main Hall', image: 'https://alexandersokolov.com/continuity/thumbnails/shining_thumb_0037.jpg' },
                { id: 'env_03', name: 'Room 237', image: 'https://alexandersokolov.com/continuity/thumbnails/shining_thumb_0069.jpg' },
                { id: 'env_04', name: 'Kitchen and Corridors', image: 'https://alexandersokolov.com/continuity/thumbnails/shining_thumb_0039.jpg' },
                { id: 'env_05', name: 'Hedge Maze', image: 'https://alexandersokolov.com/continuity/thumbnails/shining_thumb_0081.jpg' },
            ]
        },
        {
            id: 'props',
            name: 'Props',
            items: [
                { id: 'prop_01', name: 'Typewriter', image: 'https://alexandersokolov.com/continuity/thumbnails/shining_thumb_0002.jpg' },
                { id: 'prop_02', name: 'Axe', image: 'https://alexandersokolov.com/continuity/thumbnails/shining_thumb_0030.jpg' },
                { id: 'prop_03', name: 'Baseball Bat', image: 'https://alexandersokolov.com/continuity/thumbnails/shining_thumb_0030.jpg' },
                { id: 'prop_04', name: 'Radio', image: 'https://alexandersokolov.com/continuity/thumbnails/shining_thumb_0064.jpg' },
                { id: 'prop_05', name: 'Bar Counter with Bottles', image: 'https://alexandersokolov.com/continuity/thumbnails/shining_thumb_0021.jpg' },
                { id: 'prop_06', name: 'Toys and Tricycle', image: 'https://alexandersokolov.com/continuity/thumbnails/shining_thumb_0049.jpg' },
            ]
        },
        {
            id: 'vehicles',
            name: 'Vehicles',
            items: [
                { id: 'veh_01', name: 'Yellow Volkswagen Beetle', image: 'https://alexandersokolov.com/continuity/thumbnails/shining_thumb_0033.jpg' },
                { id: 'veh_02', name: 'Snowcat', image: 'https://alexandersokolov.com/continuity/thumbnails/shining_thumb_0061.jpg' },
            ]
        },
        {
            id: 'efx',
            name: 'EFX',
            items: [
                { id: 'efx_01', name: 'Gunshots', image: 'https://alexandersokolov.com/continuity/thumbnails/shining_thumb_0066.jpg' },
                { id: 'efx_02', name: 'Wood Splinters', image: 'https://alexandersokolov.com/continuity/thumbnails/shining_thumb_0030.jpg' },
                { id: 'efx_03', name: 'Electricity Sparks', image: 'https://alexandersokolov.com/continuity/thumbnails/shining_thumb_0064.jpg' },
                { id: 'efx_04', name: 'Blizzard/Snowstorm', image: 'https://alexandersokolov.com/continuity/thumbnails/shining_thumb_0084.jpg' },
                { id: 'efx_05', name: 'Blood Flood from Elevator', image: 'https://alexandersokolov.com/continuity/thumbnails/shining_thumb_0058.jpg' },
            ]
        }
    ];

    return (
        <div className="previs-assets-view">
            {assetCategories.map((category) => (
                <div key={category.id} className="asset-category">
                    <h2 className="category-title">{category.name}</h2>
                    <div className="assets-grid">
                        {category.items.map((asset) => (
                            <div key={asset.id} className="asset-card">
                                <img src={asset.image} alt={asset.name} className="asset-thumbnail" />
                                <h3 className="asset-name">{asset.name}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export const PrevisBudgetView = ({ data }) => {
    const [assetsCollapsed, setAssetsCollapsed] = React.useState(false);
    const [shotsCollapsed, setShotsCollapsed] = React.useState(false);

    const initialAssetsBudgetData = [
        // Characters
        { id: 0, category: 'Characters', name: 'Jack Torrance', artistDays: 8, revisions: 2, teamSize: 1 },
        { id: 1, category: 'Characters', name: 'Wendy Torrance', artistDays: 8, revisions: 2, teamSize: 1 },
        { id: 2, category: 'Characters', name: 'Danny Torrance', artistDays: 6, revisions: 2, teamSize: 1 },
        { id: 3, category: 'Characters', name: 'Dick Hallorann', artistDays: 5, revisions: 1, teamSize: 1 },
        { id: 4, category: 'Characters', name: 'The Grady Twins', artistDays: 4, revisions: 1, teamSize: 1 },
        // Environments
        { id: 5, category: 'Environments', name: 'Overlook Hotel Exterior', artistDays: 12, revisions: 3, teamSize: 2 },
        { id: 6, category: 'Environments', name: 'Main Hall', artistDays: 10, revisions: 2, teamSize: 2 },
        { id: 7, category: 'Environments', name: 'Room 237', artistDays: 8, revisions: 2, teamSize: 1 },
        { id: 8, category: 'Environments', name: 'Kitchen and Corridors', artistDays: 7, revisions: 2, teamSize: 2 },
        { id: 9, category: 'Environments', name: 'Hedge Maze', artistDays: 15, revisions: 3, teamSize: 2 },
        // Props
        { id: 10, category: 'Props', name: 'Typewriter', artistDays: 2, revisions: 1, teamSize: 1 },
        { id: 11, category: 'Props', name: 'Axe', artistDays: 1, revisions: 1, teamSize: 1 },
        { id: 12, category: 'Props', name: 'Baseball Bat', artistDays: 1, revisions: 1, teamSize: 1 },
        { id: 13, category: 'Props', name: 'Radio', artistDays: 2, revisions: 1, teamSize: 1 },
        { id: 14, category: 'Props', name: 'Bar Counter with Bottles', artistDays: 3, revisions: 1, teamSize: 1 },
        { id: 15, category: 'Props', name: 'Toys and Tricycle', artistDays: 2, revisions: 1, teamSize: 1 },
        // Vehicles
        { id: 16, category: 'Vehicles', name: 'Yellow Volkswagen Beetle', artistDays: 5, revisions: 2, teamSize: 1 },
        { id: 17, category: 'Vehicles', name: 'Snowcat', artistDays: 6, revisions: 2, teamSize: 1 },
        // EFX
        { id: 18, category: 'EFX', name: 'Gunshots', artistDays: 3, revisions: 2, teamSize: 1 },
        { id: 19, category: 'EFX', name: 'Wood Splinters', artistDays: 2, revisions: 1, teamSize: 1 },
        { id: 20, category: 'EFX', name: 'Electricity Sparks', artistDays: 2, revisions: 1, teamSize: 1 },
        { id: 21, category: 'EFX', name: 'Blizzard/Snowstorm', artistDays: 5, revisions: 2, teamSize: 1 },
        { id: 22, category: 'EFX', name: 'Blood Flood from Elevator', artistDays: 8, revisions: 3, teamSize: 2 },
    ];

    const [assetsBudgetData, setAssetsBudgetData] = React.useState(() => {
        const saved = localStorage.getItem('previsBudgetDataAssets');
        return saved ? JSON.parse(saved) : initialAssetsBudgetData;
    });

    // Generate shots budget data from all shots in data
    const initialShotsBudgetData = React.useMemo(() => {
        if (!data) return [];
        return Object.values(data)
            .filter(item => item.type === 'shot')
            .map((shot, index) => ({
                id: shot.id || `shot_${index}`,
                category: 'Shot',
                name: shot.name,
                code: shot.code,
                artistDays: 2,
                revisions: 1,
                teamSize: 1
            }));
    }, [data]);

    const [shotsBudgetData, setShotsBudgetData] = React.useState(() => {
        const saved = localStorage.getItem('previsBudgetDataShots');
        if (saved) {
            const savedData = JSON.parse(saved);
            // If saved data exists but is empty or outdated, regenerate
            if (savedData.length === 0 && initialShotsBudgetData.length > 0) {
                return initialShotsBudgetData;
            }
            return savedData;
        }
        return initialShotsBudgetData;
    });

    // Update shots budget data when data changes
    React.useEffect(() => {
        if (initialShotsBudgetData.length > 0 && shotsBudgetData.length === 0) {
            setShotsBudgetData(initialShotsBudgetData);
        }
    }, [initialShotsBudgetData, shotsBudgetData.length]);

    const [editingCell, setEditingCell] = React.useState(null);

    React.useEffect(() => {
        localStorage.setItem('previsBudgetDataAssets', JSON.stringify(assetsBudgetData));
    }, [assetsBudgetData]);

    React.useEffect(() => {
        localStorage.setItem('previsBudgetDataShots', JSON.stringify(shotsBudgetData));
    }, [shotsBudgetData]);

    const calculateTotal = (item) => {
        return (item.artistDays + item.revisions) * item.teamSize;
    };

    const assetsTotalDays = assetsBudgetData.reduce((sum, item) => sum + calculateTotal(item), 0);
    const shotsTotalDays = shotsBudgetData.reduce((sum, item) => sum + calculateTotal(item), 0);
    const grandTotal = assetsTotalDays + shotsTotalDays;

    const handleCellClick = (itemId, field, tableType) => {
        setEditingCell({ itemId, field, tableType });
    };

    const handleCellChange = (itemId, field, value, tableType) => {
        const numValue = parseInt(value) || 0;
        const setter = tableType === 'assets' ? setAssetsBudgetData : setShotsBudgetData;
        setter(prevData =>
            prevData.map(item =>
                item.id === itemId ? { ...item, [field]: numValue } : item
            )
        );
    };

    const handleCellBlur = () => {
        setEditingCell(null);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            setEditingCell(null);
        }
    };

    const renderEditableCell = (item, field, className, tableType) => {
        const isEditing = editingCell?.itemId === item.id && editingCell?.field === field && editingCell?.tableType === tableType;

        if (isEditing) {
            return (
                <input
                    type="number"
                    className={`editable-input ${className}`}
                    value={item[field]}
                    onChange={(e) => handleCellChange(item.id, field, e.target.value, tableType)}
                    onBlur={handleCellBlur}
                    onKeyDown={handleKeyDown}
                    autoFocus
                />
            );
        }

        return (
            <span onClick={() => handleCellClick(item.id, field, tableType)} className="editable-cell">
                {item[field]}
            </span>
        );
    };

    const renderBudgetTable = (budgetData, tableType, title, isCollapsed, toggleCollapsed) => (
        <div className="budget-section">
            <div className="budget-section-header" onClick={toggleCollapsed}>
                <h3>{title}</h3>
                <div className="budget-section-info">
                    <span className="item-count">{budgetData.length} items</span>
                    <span className="section-total">{budgetData.reduce((sum, item) => sum + calculateTotal(item), 0)} days</span>
                    <span className={`collapse-icon ${isCollapsed ? 'collapsed' : ''}`}>▼</span>
                </div>
            </div>
            {!isCollapsed && (
                <table className="budget-table">
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Name</th>
                            <th>Artist's Days</th>
                            <th>Revisions</th>
                            <th>Team Size</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {budgetData.map((item) => (
                            <tr key={item.id}>
                                <td className="category-cell">{item.category}</td>
                                <td>{item.name}</td>
                                <td className="number-cell">
                                    {renderEditableCell(item, 'artistDays', 'number-cell', tableType)}
                                </td>
                                <td className="number-cell">
                                    {renderEditableCell(item, 'revisions', 'number-cell', tableType)}
                                </td>
                                <td className="number-cell">
                                    {renderEditableCell(item, 'teamSize', 'number-cell', tableType)}
                                </td>
                                <td className="total-cell">{calculateTotal(item)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="5" className="total-label">Subtotal</td>
                            <td className="total-value">{budgetData.reduce((sum, item) => sum + calculateTotal(item), 0)}</td>
                        </tr>
                    </tfoot>
                </table>
            )}
        </div>
    );

    return (
        <div className="previs-budget-view">
            <div className="budget-header">
                <h2>Previs Budget</h2>
                <div className="budget-summary">
                    <span>Grand Total: <strong>{grandTotal}</strong> days</span>
                </div>
            </div>

            {renderBudgetTable(
                assetsBudgetData,
                'assets',
                'Assets',
                assetsCollapsed,
                () => setAssetsCollapsed(!assetsCollapsed)
            )}

            {renderBudgetTable(
                shotsBudgetData,
                'shots',
                'Shots',
                shotsCollapsed,
                () => setShotsCollapsed(!shotsCollapsed)
            )}
        </div>
    );
};

export const CardListView = ({ items, onItemClick }) => {
    const [sortConfig, setSortConfig] = React.useState({ key: 'code', direction: 'ascending' });

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
                        <img src={item.image} alt={item.name} className="card-image" />
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
