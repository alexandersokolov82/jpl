import React from 'react';
import { motion } from 'framer-motion';
import ImageUploadModal from './ImageUploadModal';

export const TabNavigation = ({ activeTab, onTabChange, budgetTabs, activeBudgetTab, onBudgetTabChange }) => {
    const mainTabs = ['Previs Shots', 'Previs Assets'];

    return (
        <nav className="tab-navigation">
            {mainTabs.map((tab) => (
                <button
                    key={tab}
                    className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => onTabChange(tab)}
                >
                    {tab}
                </button>
            ))}
            {budgetTabs && budgetTabs.map((budgetTab) => (
                <button
                    key={budgetTab.id}
                    className={`tab-button ${activeBudgetTab === budgetTab.id && activeTab !== 'Previs Summary' ? 'active' : ''}`}
                    onClick={() => onBudgetTabChange(budgetTab.id)}
                >
                    {budgetTab.name}
                </button>
            ))}
            <button
                className={`tab-button ${activeTab === 'Previs Summary' ? 'active' : ''}`}
                onClick={() => onTabChange('Previs Summary')}
            >
                Previs Summary
            </button>
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
    // Extract first 10 shots from data to match budget table
    const allShots = Object.values(data).filter(item => item.type === 'shot').slice(0, 10);

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

export const PrevisAssetsView = ({ data, onAssetClick }) => {
    const assetRoot = Object.values(data).find(item => item.type === 'asset_root');
    if (!assetRoot) return <div>No assets found.</div>;

    const assetCategories = assetRoot.children.map(catId => data[catId]);

    return (
        <div className="previs-assets-view">
            {assetCategories.map((category) => (
                <div key={category.id} className="asset-category">
                    <h2 className="category-title">{category.name}</h2>
                    <div className="assets-grid">
                        {category.children.map(assetId => {
                            const asset = data[assetId];
                            return (
                                <div key={asset.id} className="asset-card" onClick={() => onAssetClick(asset.id)}>
                                    <img src={asset.image} alt={asset.name} className="asset-thumbnail" />
                                    <h3 className="asset-name">{asset.name}</h3>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};

export const PrevisBudgetView = ({ data, onShotClick, onAssetClick, budgetId, budgetTitle, onBudgetTitleChange, onDuplicateBudget, onNewBudget, onDeleteBudget, readOnly = false }) => {
    const [assetsCollapsed, setAssetsCollapsed] = React.useState(false);
    const [shotsCollapsed, setShotsCollapsed] = React.useState(false);
    const [teamCollapsed, setTeamCollapsed] = React.useState(false);
    const [productionCollapsed, setProductionCollapsed] = React.useState(false);
    const [isEditingTitle, setIsEditingTitle] = React.useState(false);

    // Global multipliers
    const [assetsEstimateMultiplier, setAssetsEstimateMultiplier] = React.useState(() => {
        const saved = localStorage.getItem(`assetsEstimateMultiplier_${budgetId}`);
        return saved ? parseFloat(saved) : 1.0;
    });

    const [shotsEstimateMultiplier, setShotsEstimateMultiplier] = React.useState(() => {
        const saved = localStorage.getItem(`shotsEstimateMultiplier_${budgetId}`);
        return saved ? parseFloat(saved) : 1.0;
    });

    const [contingencyPercent, setContingencyPercent] = React.useState(() => {
        const saved = localStorage.getItem(`contingencyPercent_${budgetId}`);
        return saved ? parseFloat(saved) : 15.0;
    });

    // Reload multipliers when budgetId changes
    React.useEffect(() => {
        const savedAssets = localStorage.getItem(`assetsEstimateMultiplier_${budgetId}`);
        const savedShots = localStorage.getItem(`shotsEstimateMultiplier_${budgetId}`);
        const savedContingency = localStorage.getItem(`contingencyPercent_${budgetId}`);

        setAssetsEstimateMultiplier(savedAssets ? parseFloat(savedAssets) : 1.0);
        setShotsEstimateMultiplier(savedShots ? parseFloat(savedShots) : 1.0);
        setContingencyPercent(savedContingency ? parseFloat(savedContingency) : 15.0);
    }, [budgetId]);

    // Save multipliers
    React.useEffect(() => {
        localStorage.setItem(`assetsEstimateMultiplier_${budgetId}`, assetsEstimateMultiplier.toString());
    }, [assetsEstimateMultiplier, budgetId]);

    React.useEffect(() => {
        localStorage.setItem(`shotsEstimateMultiplier_${budgetId}`, shotsEstimateMultiplier.toString());
    }, [shotsEstimateMultiplier, budgetId]);

    React.useEffect(() => {
        localStorage.setItem(`contingencyPercent_${budgetId}`, contingencyPercent.toString());
    }, [contingencyPercent, budgetId]);

    const initialProductionData = [
        { id: 0, name: 'Supervisor', days: 20, prodMultiplier: 0.7, cost: 0 },
        { id: 1, name: 'Coordinator', days: 20, prodMultiplier: 1.0, cost: 0 },
        { id: 2, name: 'Miscellaneous', days: 0, prodMultiplier: 1.0, cost: 0 },
    ];

    const [productionData, setProductionData] = React.useState(() => {
        const saved = localStorage.getItem(`previsBudgetProduction_v2_${budgetId}`);
        if (saved) {
            return JSON.parse(saved);
        }
        // For new budgets, return empty array or initial data only for budget_1
        return budgetId === 'budget_1' ? initialProductionData : [];
    });

    // Reload production data when budgetId changes
    React.useEffect(() => {
        const saved = localStorage.getItem(`previsBudgetProduction_v2_${budgetId}`);
        if (saved) {
            setProductionData(JSON.parse(saved));
        } else {
            setProductionData(budgetId === 'budget_1' ? initialProductionData : []);
        }
    }, [budgetId]);

    React.useEffect(() => {
        localStorage.setItem(`previsBudgetProduction_v2_${budgetId}`, JSON.stringify(productionData));
    }, [productionData, budgetId]);

    const defaultRoles = [
        { id: 0, role: 'Supervisor', headcount: 1, rateUnit: 'day', rate: 900, productivity: 1.0 },
        { id: 1, role: 'Animator', headcount: 1, rateUnit: 'day', rate: 600, productivity: 1.0 },
        { id: 2, role: 'Modeler', headcount: 1, rateUnit: 'day', rate: 400, productivity: 1.0 },
        { id: 3, role: 'Coordinator', headcount: 1, rateUnit: 'day', rate: 250, productivity: 1.0 },
    ];

    const [teamRoles, setTeamRoles] = React.useState(() => {
        const saved = localStorage.getItem(`previsBudgetTeamRoles_v5_${budgetId}`);
        if (saved) {
            return JSON.parse(saved);
        }
        // For new budgets, return empty array or default roles only for budget_1
        return budgetId === 'budget_1' ? defaultRoles : [];
    });

    // Reload team roles when budgetId changes
    React.useEffect(() => {
        const saved = localStorage.getItem(`previsBudgetTeamRoles_v5_${budgetId}`);
        if (saved) {
            setTeamRoles(JSON.parse(saved));
        } else {
            setTeamRoles(budgetId === 'budget_1' ? defaultRoles : []);
        }
    }, [budgetId]);

    React.useEffect(() => {
        localStorage.setItem(`previsBudgetTeamRoles_v5_${budgetId}`, JSON.stringify(teamRoles));
    }, [teamRoles, budgetId]);

    // Extra Artists multipliers
    const [assetsExtraArtists, setAssetsExtraArtists] = React.useState(() => {
        const saved = localStorage.getItem(`assetsExtraArtists_${budgetId}`);
        const value = saved ? parseFloat(saved) : 0;
        return isNaN(value) ? 0 : value;
    });

    const [shotsExtraArtists, setShotsExtraArtists] = React.useState(() => {
        const saved = localStorage.getItem(`shotsExtraArtists_${budgetId}`);
        const value = saved ? parseFloat(saved) : 0;
        return isNaN(value) ? 0 : value;
    });

    React.useEffect(() => {
        localStorage.setItem(`assetsExtraArtists_${budgetId}`, assetsExtraArtists.toString());
    }, [assetsExtraArtists, budgetId]);

    React.useEffect(() => {
        localStorage.setItem(`shotsExtraArtists_${budgetId}`, shotsExtraArtists.toString());
    }, [shotsExtraArtists, budgetId]);

    // Reload extra artists when budgetId changes
    React.useEffect(() => {
        const savedAssetsExtraArtists = localStorage.getItem(`assetsExtraArtists_${budgetId}`);
        const savedShotsExtraArtists = localStorage.getItem(`shotsExtraArtists_${budgetId}`);
        const assetsValue = savedAssetsExtraArtists ? parseFloat(savedAssetsExtraArtists) : 0;
        const shotsValue = savedShotsExtraArtists ? parseFloat(savedShotsExtraArtists) : 0;
        setAssetsExtraArtists(isNaN(assetsValue) ? 0 : assetsValue);
        setShotsExtraArtists(isNaN(shotsValue) ? 0 : shotsValue);
    }, [budgetId]);

    const initialAssetsBudgetData = [
        // Characters
        { id: 0, category: 'chr', name: 'Jack Torrance', artistDays: 2, revisions: 1, teamSize: 2, complexity: 1.0, assignedArtists: ['Modeler'] },
        { id: 1, category: 'chr', name: 'Wendy Torrance', artistDays: 2, revisions: 1, teamSize: 1, complexity: 1.0, assignedArtists: ['Modeler'] },
        // Environments
        { id: 2, category: 'env', name: 'Overlook Hotel Exterior', artistDays: 2, revisions: 1, teamSize: 1, complexity: 1.0, assignedArtists: ['Modeler'] },
        { id: 3, category: 'env', name: 'Hedge Maze', artistDays: 2, revisions: 1, teamSize: 1, complexity: 1.0, assignedArtists: ['Modeler'] },
        // Props
        { id: 4, category: 'prp', name: 'Typewriter', artistDays: 2, revisions: 1, teamSize: 1, complexity: 1.0, assignedArtists: ['Modeler'] },
        { id: 5, category: 'prp', name: 'Axe', artistDays: 2, revisions: 1, teamSize: 1, complexity: 1.0, assignedArtists: ['Modeler'] },
        // Vehicles
        { id: 6, category: 'veh', name: 'Yellow Volkswagen Beetle', artistDays: 2, revisions: 1, teamSize: 1, complexity: 1.0, assignedArtists: ['Modeler'] },
        { id: 7, category: 'veh', name: 'Snowcat', artistDays: 2, revisions: 1, teamSize: 1, complexity: 1.0, assignedArtists: ['Modeler'] },
        // EFX
        { id: 8, category: 'efx', name: 'Blizzard/Snowstorm', artistDays: 2, revisions: 1, teamSize: 1, complexity: 1.0, assignedArtists: ['Modeler'] },
        { id: 9, category: 'efx', name: 'Blood Flood from Elevator', artistDays: 2, revisions: 1, teamSize: 1, complexity: 1.0, assignedArtists: ['Modeler'] },
    ];

    const [assetsBudgetData, setAssetsBudgetData] = React.useState(() => {
        const saved = localStorage.getItem(`previsBudgetDataAssets_v4_${budgetId}`);
        if (saved) {
            return JSON.parse(saved);
        }
        // For new budgets, return empty array or initial data
        return budgetId === 'budget_1' ? initialAssetsBudgetData : [];
    });

    // Reload assets data when budgetId changes
    React.useEffect(() => {
        const saved = localStorage.getItem(`previsBudgetDataAssets_v4_${budgetId}`);
        if (saved) {
            setAssetsBudgetData(JSON.parse(saved));
        } else {
            setAssetsBudgetData(budgetId === 'budget_1' ? initialAssetsBudgetData : []);
        }
    }, [budgetId]);

    // Generate shots budget data from all shots in data
    const initialShotsBudgetData = React.useMemo(() => {
        if (!data) return [];
        return Object.values(data)
            .filter(item => item.type === 'shot')
            .slice(0, 10)
            .map((shot, index) => ({
                id: shot.id || `shot_${index}`,
                category: 'Shot',
                name: shot.name,
                code: shot.code,
                artistDays: 2,
                revisions: 1,
                teamSize: 1,
                complexity: 1.0,
                assignedArtists: ['Animator 1']
            }));
    }, [data]);

    const [shotsBudgetData, setShotsBudgetData] = React.useState(() => {
        const saved = localStorage.getItem(`previsBudgetDataShots_v6_${budgetId}`);
        if (saved) {
            return JSON.parse(saved);
        }
        // For new budgets, return empty array or initial data only for budget_1
        return budgetId === 'budget_1' ? initialShotsBudgetData : [];
    });

    // Reload shots data when budgetId changes
    React.useEffect(() => {
        const saved = localStorage.getItem(`previsBudgetDataShots_v6_${budgetId}`);
        if (saved) {
            setShotsBudgetData(JSON.parse(saved));
        } else {
            setShotsBudgetData(budgetId === 'budget_1' ? initialShotsBudgetData : []);
        }
    }, [budgetId]);

    // Update shots budget data when data changes - only for budget_1
    React.useEffect(() => {
        if (budgetId === 'budget_1' && initialShotsBudgetData.length > 0 && shotsBudgetData.length === 0) {
            setShotsBudgetData(initialShotsBudgetData);
        }
    }, [initialShotsBudgetData, shotsBudgetData.length, budgetId]);

    // Clean up invalid assigned artists and auto-assign "Animator" to shots
    React.useEffect(() => {
        const validRoleNames = teamRoles.map(r => r.role);

        setShotsBudgetData(prevData =>
            prevData.map(shot => {
                // Filter out invalid roles
                const validArtists = (shot.assignedArtists || []).filter(artist =>
                    validRoleNames.includes(artist)
                );

                // If no valid artists remain, assign "Animator" (if it exists)
                const finalArtists = validArtists.length > 0
                    ? validArtists
                    : (validRoleNames.includes('Animator') ? ['Animator'] : []);

                return {
                    ...shot,
                    assignedArtists: finalArtists
                };
            })
        );

        setAssetsBudgetData(prevData =>
            prevData.map(asset => {
                // Filter out invalid roles
                const validArtists = (asset.assignedArtists || []).filter(artist =>
                    validRoleNames.includes(artist)
                );

                return {
                    ...asset,
                    assignedArtists: validArtists
                };
            })
        );
    }, [teamRoles]);

    const [editingCell, setEditingCell] = React.useState(null);

    React.useEffect(() => {
        localStorage.setItem(`previsBudgetDataAssets_v4_${budgetId}`, JSON.stringify(assetsBudgetData));
    }, [assetsBudgetData, budgetId]);

    React.useEffect(() => {
        localStorage.setItem(`previsBudgetDataShots_v6_${budgetId}`, JSON.stringify(shotsBudgetData));
    }, [shotsBudgetData, budgetId]);

    const calculateTotal = (item) => {
        return (item.artistDays + item.revisions) * item.teamSize * (item.complexity || 1);
    };

    const calculateTotalArtistDays = (item) => {
        // Total Artist Days = (artistDays + revisions) * complexity (NOT multiplied by teamSize)
        return (item.artistDays + item.revisions) * (item.complexity || 1);
    };

    const calculateScenarioCost = (item, allItems) => {
        const totalArtistDays = calculateTotalArtistDays(item);
        const teamSize = parseFloat(item.teamSize) || 1;
        const artists = Array.isArray(item.assignedArtists) ? item.assignedArtists : [];

        if (artists.length === 0) {
            return 0;
        }

        // Cost = Total Artist Days * rate * teamSize
        // Total Artist Days - это сколько человеко-дней работы
        // Умножаем на teamSize потому что больше людей = больше зарплат
        let totalCost = 0;
        const numArtistTypes = artists.length;

        artists.forEach(artistRole => {
            const role = teamRoles.find(r => r.role === artistRole);
            if (role) {
                const rate = parseFloat(role.rate) || 0;
                const ratePerDay = role.rateUnit === 'week' ? rate / 5 : rate;
                const productivity = parseFloat(role.productivity) || 1.0;

                // Cost = (Total Artist Days / productivity) * rate * teamSize
                // productivity уменьшает стоимость (эффективнее = дешевле)
                // teamSize увеличивает стоимость (больше людей = дороже)
                const artistDaysForThisRole = totalArtistDays / (numArtistTypes * productivity);
                totalCost += artistDaysForThisRole * ratePerDay * teamSize;
            }
        });

        return totalCost;
    };

    const calculateLocalProjectDays = (item) => {
        const totalArtistDays = calculateTotalArtistDays(item);
        const teamSize = parseFloat(item.teamSize) || 1;
        const artists = Array.isArray(item.assignedArtists) ? item.assignedArtists : [];

        // If no artists assigned, use team size
        if (artists.length === 0) {
            return totalArtistDays / teamSize;
        }

        // Calculate combined productivity of all assigned artists
        let totalProductivity = 0;
        artists.forEach(artistRole => {
            const role = teamRoles.find(r => r.role === artistRole);
            if (role) {
                totalProductivity += (role.productivity || 1.0);
            }
        });

        // If no productivity found, use team size only
        if (totalProductivity === 0) {
            return totalArtistDays / teamSize;
        }

        // Real Days = Total Artist Days / (Team Size * productivity)
        // More people or higher productivity = fewer days
        return totalArtistDays / (teamSize * totalProductivity);
    };

    const assetsTotalDays = assetsBudgetData
        .filter(item => item.billable !== false)
        .reduce((sum, item) => sum + calculateTotalArtistDays(item), 0);
    const shotsTotalDays = shotsBudgetData
        .filter(item => item.billable !== false)
        .reduce((sum, item) => sum + calculateTotalArtistDays(item), 0);
    const grandTotal = Math.round(assetsTotalDays + shotsTotalDays);

    const handleCellClick = (itemId, field, tableType) => {
        setEditingCell({ itemId, field, tableType });
    };

    const handleCellChange = (itemId, field, value, tableType) => {
        const numValue = (field === 'complexity' || field === 'teamSize') ? parseFloat(value) || 0 : parseInt(value) || 0;
        const setter = tableType === 'assets' ? setAssetsBudgetData : setShotsBudgetData;
        setter(prevData =>
            prevData.map(item =>
                item.id === itemId ? { ...item, [field]: numValue } : item
            )
        );
    };

    const handleTeamCellChange = (roleId, field, value) => {
        const numValue = parseFloat(value) || 0;
        setTeamRoles(prevRoles =>
            prevRoles.map(role =>
                role.id === roleId ? { ...role, [field]: numValue } : role
            )
        );
    };

    const handleTeamRoleChange = (roleId, value) => {
        // Find the old role name before changing
        const oldRole = teamRoles.find(r => r.id === roleId);
        const oldRoleName = oldRole ? oldRole.role : null;

        // Update the role name
        setTeamRoles(prevRoles =>
            prevRoles.map(role =>
                role.id === roleId ? { ...role, role: value } : role
            )
        );

        // Update all assigned artists in Assets and Shots that reference the old role name
        if (oldRoleName && oldRoleName !== value) {
            // Update Assets
            setAssetsBudgetData(prevData =>
                prevData.map(item => {
                    if (Array.isArray(item.assignedArtists) && item.assignedArtists.includes(oldRoleName)) {
                        return {
                            ...item,
                            assignedArtists: item.assignedArtists.map(artist =>
                                artist === oldRoleName ? value : artist
                            )
                        };
                    }
                    return item;
                })
            );

            // Update Shots
            setShotsBudgetData(prevData =>
                prevData.map(item => {
                    if (Array.isArray(item.assignedArtists) && item.assignedArtists.includes(oldRoleName)) {
                        return {
                            ...item,
                            assignedArtists: item.assignedArtists.map(artist =>
                                artist === oldRoleName ? value : artist
                            )
                        };
                    }
                    return item;
                })
            );
        }
    };

    const handleTeamRateUnitChange = (roleId, value) => {
        setTeamRoles(prevRoles =>
            prevRoles.map(role =>
                role.id === roleId ? { ...role, rateUnit: value } : role
            )
        );
    };

    const handleProductionCellChange = (itemId, field, value) => {
        const numValue = parseFloat(value) || 0;
        setProductionData(prevData =>
            prevData.map(item =>
                item.id === itemId ? { ...item, [field]: numValue } : item
            )
        );
    };

    const addTeamRole = () => {
        const newId = teamRoles.length > 0 ? Math.max(...teamRoles.map(r => r.id)) + 1 : 0;
        setTeamRoles([...teamRoles, {
            id: newId,
            role: 'New Role',
            headcount: 1,
            rateUnit: 'day',
            rate: 500,
            productivity: 1.0
        }]);
    };

    const removeTeamRole = (roleId) => {
        setTeamRoles(prevRoles => prevRoles.filter(role => role.id !== roleId));
    };

    const handleCellBlur = () => {
        setEditingCell(null);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            setEditingCell(null);
        }
    };

    const handleAssignedArtistsChange = (itemId, role, tableType) => {
        const setter = tableType === 'assets' ? setAssetsBudgetData : setShotsBudgetData;
        setter(prevData =>
            prevData.map(item => {
                if (item.id === itemId) {
                    const currentArtists = Array.isArray(item.assignedArtists) ? item.assignedArtists : [];
                    const newArtists = currentArtists.includes(role)
                        ? currentArtists.filter(r => r !== role)
                        : [...currentArtists, role];
                    return { ...item, assignedArtists: newArtists };
                }
                return item;
            })
        );
    };

    const renderAssignedArtistsCell = (item, tableType) => {
        const artists = Array.isArray(item.assignedArtists) ? item.assignedArtists : [];
        const isEditing = editingCell?.itemId === item.id && editingCell?.field === 'assignedArtists' && editingCell?.tableType === tableType;

        if (isEditing) {
            return (
                <div style={{ position: 'relative' }}>
                    <div
                        style={{
                            position: 'absolute',
                            top: '0',
                            left: '0',
                            zIndex: 1000,
                            background: 'var(--bg-surface)',
                            border: '1px solid var(--accent-primary)',
                            borderRadius: '8px',
                            padding: '8px',
                            minWidth: '150px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                        }}
                        onBlur={(e) => {
                            if (!e.currentTarget.contains(e.relatedTarget)) {
                                setEditingCell(null);
                            }
                        }}
                        tabIndex={-1}
                    >
                        {teamRoles.map(role => (
                            <label
                                key={role.id}
                                style={{
                                    display: 'block',
                                    padding: '4px 0',
                                    cursor: 'pointer',
                                    color: 'var(--text-primary)'
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={artists.includes(role.role)}
                                    onChange={() => handleAssignedArtistsChange(item.id, role.role, tableType)}
                                    style={{ marginRight: '8px' }}
                                />
                                {role.role}
                            </label>
                        ))}
                    </div>
                    <span className="editable-cell">{artists.join(', ') || 'None'}</span>
                </div>
            );
        }

        return (
            <span
                onClick={() => handleCellClick(item.id, 'assignedArtists', tableType)}
                className="editable-cell"
            >
                {artists.join(', ') || 'None'}
            </span>
        );
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

    const handleEstimateMultiplierChange = (tableType, newMultiplier) => {
        const currentMultiplier = tableType === 'assets' ? assetsEstimateMultiplier : shotsEstimateMultiplier;
        const setter = tableType === 'assets' ? setAssetsBudgetData : setShotsBudgetData;
        const setMultiplier = tableType === 'assets' ? setAssetsEstimateMultiplier : setShotsEstimateMultiplier;

        // Calculate the ratio to apply
        const ratio = newMultiplier / currentMultiplier;

        // Apply the ratio to all artistDays in the table
        setter(prevData =>
            prevData.map(item => ({
                ...item,
                artistDays: Math.round(item.artistDays * ratio * 10) / 10 // Round to 1 decimal
            }))
        );

        // Update the multiplier
        setMultiplier(newMultiplier);
    };

    const renderBudgetTable = (budgetData, tableType, title, isCollapsed, toggleCollapsed) => {
        const estimateMultiplier = tableType === 'assets' ? assetsEstimateMultiplier : shotsEstimateMultiplier;
        const baseDays = budgetData
            .filter(item => item.billable !== false)
            .reduce((sum, item) => sum + calculateTotalArtistDays(item), 0);

        return (
            <div className="budget-section">
                <div className="budget-section-header" onClick={(e) => {
                    // Don't collapse when clicking on the input
                    if (e.target.tagName !== 'INPUT') {
                        toggleCollapsed();
                    }
                }}>
                    <h3>{title}</h3>
                    <div className="budget-section-info">
                        <span className="item-count">{budgetData.length} items</span>
                        <span className="section-total">{baseDays.toFixed(1)} days</span>
                        <span className={`collapse-icon ${isCollapsed ? 'collapsed' : ''}`}>▼</span>
                    </div>
                </div>
            <table className="budget-table">
                {!isCollapsed && (
                    <>
                        <thead>
                            <tr>
                                <th style={{ width: '60px' }}>Cat</th>
                                <th style={{ width: '250px' }}>Name</th>
                                <th style={{ width: '80px', textAlign: 'center' }}>Billable</th>
                                <th>Artist's Days</th>
                                <th>Revisions</th>
                                <th>Complexity ×</th>
                                <th>Assigned Artists</th>
                                <th>Team Size</th>
                                <th>Total Artist Days</th>
                                <th>Real Days</th>
                                <th>Cost (USD)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {budgetData.map((item) => (
                                <tr key={item.id} style={{ opacity: item.billable === false ? 0.5 : 1 }}>
                                    <td className="category-cell">{item.category}</td>
                                    <td
                                        style={{ cursor: 'pointer', color: '#4a9eff' }}
                                        onClick={() => {
                                            if (tableType === 'assets' && onAssetClick) {
                                                const asset = Object.values(data).find(d => d.type === 'asset' && d.name === item.name);
                                                if (asset) {
                                                    onAssetClick(asset.id);
                                                }
                                            } else if (tableType === 'shots' && onShotClick) {
                                                onShotClick(item.id);
                                            }
                                        }}
                                    >
                                        {item.name}
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <input
                                            type="checkbox"
                                            checked={item.billable !== false}
                                            onChange={(e) => {
                                                const setter = tableType === 'assets' ? setAssetsBudgetData : setShotsBudgetData;
                                                setter(prevData =>
                                                    prevData.map(i =>
                                                        i.id === item.id ? { ...i, billable: e.target.checked } : i
                                                    )
                                                );
                                            }}
                                            style={{
                                                cursor: 'pointer',
                                                width: '18px',
                                                height: '18px',
                                                accentColor: '#444444'
                                            }}
                                        />
                                    </td>
                                    <td className="number-cell">
                                        {renderEditableCell(item, 'artistDays', 'number-cell', tableType)}
                                    </td>
                                    <td className="number-cell">
                                        {renderEditableCell(item, 'revisions', 'number-cell', tableType)}
                                    </td>
                                    <td className="number-cell">
                                        {renderEditableCell(item, 'complexity', 'number-cell', tableType)}
                                    </td>
                                    <td>
                                        {renderAssignedArtistsCell(item, tableType)}
                                    </td>
                                    <td className="number-cell">
                                        {renderEditableCell(item, 'teamSize', 'number-cell', tableType)}
                                    </td>
                                    <td className="total-cell">{calculateTotalArtistDays(item).toFixed(1)}</td>
                                    <td className="total-cell">{calculateLocalProjectDays(item).toFixed(1)}</td>
                                    <td className="total-cell">${item.billable !== false ? calculateScenarioCost(item, budgetData).toLocaleString() : '0'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </>
                )}
                <tfoot>
                    <tr>
                        <td colSpan="7" className="total-label">Subtotal</td>
                        <td className="total-value">{budgetData.filter(item => item.billable !== false).reduce((sum, item) => sum + item.teamSize, 0)}</td>
                        <td className="total-value">{budgetData.filter(item => item.billable !== false).reduce((sum, item) => sum + calculateTotalArtistDays(item), 0).toFixed(1)}</td>
                        <td className="total-value">{budgetData.filter(item => item.billable !== false).reduce((sum, item) => sum + calculateLocalProjectDays(item), 0).toFixed(1)}</td>
                        <td className="total-value">${budgetData.filter(item => item.billable !== false).reduce((sum, item) => sum + calculateScenarioCost(item, budgetData), 0).toLocaleString()}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
        );
    };

    const renderTeamTable = () => (
        <div className="budget-section">
            <div className="budget-section-header" onClick={() => setTeamCollapsed(!teamCollapsed)}>
                <h3>Team Breakdown & Rates</h3>
                <div className="budget-section-info">
                    <span className="item-count">{teamRoles.length} roles</span>
                    <span className={`collapse-icon ${teamCollapsed ? 'collapsed' : ''}`}>▼</span>
                </div>
            </div>
            {!teamCollapsed && (
                <>
                    <table className="budget-table">
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'left' }}>Role</th>
                                <th style={{ textAlign: 'left' }}>Headcount</th>
                                <th style={{ textAlign: 'left' }}>Rate Unit</th>
                                <th style={{ textAlign: 'left' }}>Rate</th>
                                <th style={{ textAlign: 'left' }}>Prod×</th>
                                <th style={{ textAlign: 'center', width: '80px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teamRoles.map((role) => {
                                const isEditingRole = editingCell?.itemId === role.id && editingCell?.field === 'role' && editingCell?.tableType === 'team';
                                const isEditingHeadcount = editingCell?.itemId === role.id && editingCell?.field === 'headcount' && editingCell?.tableType === 'team';
                                const isEditingRate = editingCell?.itemId === role.id && editingCell?.field === 'rate' && editingCell?.tableType === 'team';
                                const isEditingProductivity = editingCell?.itemId === role.id && editingCell?.field === 'productivity' && editingCell?.tableType === 'team';

                                return (
                                    <tr key={role.id}>
                                        <td>
                                            {isEditingRole ? (
                                                <input
                                                    type="text"
                                                    className="editable-input"
                                                    value={role.role}
                                                    onChange={(e) => handleTeamRoleChange(role.id, e.target.value)}
                                                    onBlur={handleCellBlur}
                                                    onKeyDown={handleKeyDown}
                                                    autoFocus
                                                />
                                            ) : (
                                                <span
                                                    onClick={() => handleCellClick(role.id, 'role', 'team')}
                                                    className="editable-cell"
                                                >
                                                    {role.role}
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            {isEditingHeadcount ? (
                                                <input
                                                    type="number"
                                                    className="editable-input"
                                                    value={role.headcount}
                                                    onChange={(e) => handleTeamCellChange(role.id, 'headcount', e.target.value)}
                                                    onBlur={handleCellBlur}
                                                    onKeyDown={handleKeyDown}
                                                    autoFocus
                                                />
                                            ) : (
                                                <span
                                                    onClick={() => handleCellClick(role.id, 'headcount', 'team')}
                                                    className="editable-cell"
                                                >
                                                    {role.headcount}
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            <select
                                                value={role.rateUnit}
                                                onChange={(e) => handleTeamRateUnitChange(role.id, e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.5rem 0.75rem',
                                                    cursor: 'pointer',
                                                    borderRadius: '8px',
                                                    border: '1px solid var(--border-color)',
                                                    backgroundColor: 'var(--bg-surface)',
                                                    color: 'var(--text-primary)',
                                                    textAlign: 'left'
                                                }}
                                            >
                                                <option value="day">per day</option>
                                                <option value="week">per week</option>
                                            </select>
                                        </td>
                                        <td>
                                            {isEditingRate ? (
                                                <input
                                                    type="number"
                                                    className="editable-input"
                                                    value={role.rate}
                                                    onChange={(e) => handleTeamCellChange(role.id, 'rate', e.target.value)}
                                                    onBlur={handleCellBlur}
                                                    onKeyDown={handleKeyDown}
                                                    autoFocus
                                                />
                                            ) : (
                                                <span
                                                    onClick={() => handleCellClick(role.id, 'rate', 'team')}
                                                    className="editable-cell"
                                                >
                                                    ${role.rate}
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            {isEditingProductivity ? (
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    className="editable-input"
                                                    value={role.productivity}
                                                    onChange={(e) => handleTeamCellChange(role.id, 'productivity', e.target.value)}
                                                    onBlur={handleCellBlur}
                                                    onKeyDown={handleKeyDown}
                                                    autoFocus
                                                />
                                            ) : (
                                                <span
                                                    onClick={() => handleCellClick(role.id, 'productivity', 'team')}
                                                    className="editable-cell"
                                                >
                                                    {role.productivity}
                                                </span>
                                            )}
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <button
                                                onClick={() => removeTeamRole(role.id)}
                                                style={{
                                                    padding: '6px',
                                                    cursor: 'pointer',
                                                    background: 'transparent',
                                                    color: '#ff4444',
                                                    border: 'none',
                                                    fontSize: '18px'
                                                }}
                                                title="Remove role"
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <div style={{ paddingLeft: '1rem', marginTop: '12px', marginBottom: '12px' }}>
                        <button
                            onClick={addTeamRole}
                            style={{
                                padding: '8px 16px',
                                cursor: 'pointer',
                                background: 'var(--bg-surface)',
                                color: 'var(--text-primary)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px',
                                fontSize: '14px',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = 'var(--bg-surface-hover)';
                                e.target.style.borderColor = 'var(--accent-primary)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'var(--bg-surface)';
                                e.target.style.borderColor = 'var(--border-color)';
                            }}
                        >
                            + Add Role
                        </button>
                    </div>
                </>
            )}
        </div>
    );

    const calculateProductionCost = (item) => {
        // Find the role rate from teamRoles based on item name
        const role = teamRoles.find(r => r.role === item.name);
        if (!role) return 0;

        const ratePerDay = role.rateUnit === 'week' ? role.rate / 5 : role.rate;
        return item.days * ratePerDay * (item.prodMultiplier || 1.0);
    };

    const addProductionItem = () => {
        const newId = productionData.length > 0 ? Math.max(...productionData.map(p => p.id)) + 1 : 0;
        setProductionData([...productionData, {
            id: newId,
            name: 'New Item',
            days: 0,
            prodMultiplier: 1.0,
            cost: 0
        }]);
    };

    const removeProductionItem = (itemId) => {
        setProductionData(prevData => prevData.filter(item => item.id !== itemId));
    };

    const renderScenarioSummary = () => {
        // Calculate Assets metrics (only billable)
        const billableAssets = assetsBudgetData.filter(item => item.billable !== false);
        const assetsCount = billableAssets.length;
        const assetsArtistDays = billableAssets.reduce((sum, item) => sum + calculateTotalArtistDays(item), 0);
        const assetsCost = billableAssets.reduce((sum, item) => sum + calculateScenarioCost(item, assetsBudgetData), 0);

        // Calculate Shots metrics (only billable)
        const billableShots = shotsBudgetData.filter(item => item.billable !== false);
        const shotsCount = billableShots.length;
        const shotsArtistDays = billableShots.reduce((sum, item) => sum + calculateTotalArtistDays(item), 0);
        const shotsCost = billableShots.reduce((sum, item) => sum + calculateScenarioCost(item, shotsBudgetData), 0);

        // Calculate Total Artist Days
        const totalArtistDays = assetsArtistDays + shotsArtistDays;

        // Calculate Team Capacity per day
        const teamCapacityPerDay = teamRoles.reduce((sum, role) => sum + role.headcount, 0);

        // Calculate Project Days
        const projectDays = teamCapacityPerDay > 0 ? totalArtistDays / teamCapacityPerDay : 0;

        // Calculate Labor Cost
        const laborCost = assetsCost + shotsCost;

        // Calculate Production Cost (only billable)
        const billableProductionData = productionData.filter(item => item.billable !== false);
        const productionCost = billableProductionData.reduce((sum, item) => sum + calculateProductionCost(item), 0);

        // Subtotal before contingency
        const subtotal = laborCost + productionCost;

        // Contingency calculation
        const contingencyAmount = subtotal * (contingencyPercent / 100);

        // Grand Total with contingency
        const grandTotal = subtotal + contingencyAmount;

        // Pie chart data
        const chartData = [
            { label: 'Assets', value: assetsCost, color: '#9E9E9E' },
            { label: 'Shots', value: shotsCost, color: '#616161' },
            { label: 'Production', value: productionCost, color: '#BDBDBD' },
            { label: 'Contingency', value: contingencyAmount, color: '#E0E0E0' }
        ];

        const total = chartData.reduce((sum, item) => sum + item.value, 0);
        let currentAngle = -90; // Start from top

        return (
            <div className="budget-section">
                <div className="budget-section-header">
                    <h3>Scenario Summary</h3>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'stretch', padding: '1.5rem' }}>
                    <div style={{
                        flex: '1',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        padding: '1rem'
                    }}>
                        <table className="budget-table" style={{ width: '100%', background: 'transparent', border: 'none' }}>
                        <tbody>
                            <tr>
                                <td style={{ textAlign: 'left', width: '200px' }}>Assets Count</td>
                                <td style={{ textAlign: 'right', fontFamily: "'Courier New', monospace" }}>{assetsCount}</td>
                            </tr>
                            <tr>
                                <td style={{ textAlign: 'left' }}>Shots Count</td>
                                <td style={{ textAlign: 'right', fontFamily: "'Courier New', monospace" }}>{shotsCount}</td>
                            </tr>
                            <tr style={{ borderTop: '1px solid var(--border-color)' }}>
                                <td style={{ textAlign: 'left' }}>Assets Artist Days</td>
                                <td style={{ textAlign: 'right', fontFamily: "'Courier New', monospace" }}>{assetsArtistDays.toFixed(1)}</td>
                            </tr>
                            <tr>
                                <td style={{ textAlign: 'left' }}>Shots Artist Days</td>
                                <td style={{ textAlign: 'right', fontFamily: "'Courier New', monospace" }}>{shotsArtistDays.toFixed(1)}</td>
                            </tr>
                            <tr>
                                <td style={{ textAlign: 'left', fontWeight: 'bold' }}>Total Artist Days</td>
                                <td style={{ textAlign: 'right', fontFamily: "'Courier New', monospace", fontWeight: 'bold' }}>{totalArtistDays.toFixed(1)}</td>
                            </tr>
                            <tr style={{ borderTop: '1px solid var(--border-color)' }}>
                                <td style={{ textAlign: 'left' }}>Team Capacity/day</td>
                                <td style={{ textAlign: 'right', fontFamily: "'Courier New', monospace" }}>{teamCapacityPerDay}</td>
                            </tr>
                            <tr>
                                <td style={{ textAlign: 'left', fontWeight: 'bold' }}>Project Days</td>
                                <td style={{ textAlign: 'right', fontFamily: "'Courier New', monospace", fontWeight: 'bold' }}>{projectDays.toFixed(1)}</td>
                            </tr>
                            <tr style={{ borderTop: '1px solid var(--border-color)' }}>
                                <td style={{ textAlign: 'left' }}>Assets Cost</td>
                                <td style={{ textAlign: 'right', fontFamily: "'Courier New', monospace" }}>${assetsCost.toLocaleString()}</td>
                            </tr>
                            <tr>
                                <td style={{ textAlign: 'left' }}>Shots Cost</td>
                                <td style={{ textAlign: 'right', fontFamily: "'Courier New', monospace" }}>${shotsCost.toLocaleString()}</td>
                            </tr>
                            <tr>
                                <td style={{ textAlign: 'left' }}>Production Cost</td>
                                <td style={{ textAlign: 'right', fontFamily: "'Courier New', monospace" }}>${productionCost.toLocaleString()}</td>
                            </tr>
                            <tr style={{ borderTop: '1px solid var(--border-color)' }}>
                                <td style={{ textAlign: 'left', fontWeight: 'bold' }}>Subtotal</td>
                                <td style={{ textAlign: 'right', fontFamily: "'Courier New', monospace", fontWeight: 'bold' }}>${subtotal.toLocaleString()}</td>
                            </tr>
                            <tr>
                                <td style={{ textAlign: 'left' }}>Contingency ({contingencyPercent}%)</td>
                                <td style={{ textAlign: 'right', fontFamily: "'Courier New', monospace" }}>${contingencyAmount.toLocaleString()}</td>
                            </tr>
                            <tr style={{ borderTop: '2px solid var(--border-color)' }}>
                                <td style={{ textAlign: 'left', fontWeight: 'bold', fontSize: '16px' }}>Grand Total</td>
                                <td style={{ textAlign: 'right', fontFamily: "'Courier New', monospace", fontWeight: 'bold', fontSize: '16px' }}>${grandTotal.toLocaleString()} USD</td>
                            </tr>
                        </tbody>
                    </table>
                    </div>

                    <div style={{
                        flex: '1',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '1rem',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px'
                    }}>
                        <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Cost Distribution</h4>
                        <svg width="100%" height="auto" viewBox="0 0 250 250" style={{ maxWidth: '350px' }}>
                            {chartData.map((item, index) => {
                                const percentage = total > 0 ? (item.value / total) * 100 : 0;
                                const angle = (percentage / 100) * 360;
                                const startAngle = currentAngle;
                                const endAngle = currentAngle + angle;

                                // Convert angles to radians
                                const startRad = (startAngle * Math.PI) / 180;
                                const endRad = (endAngle * Math.PI) / 180;

                                // Calculate arc path
                                const x1 = 125 + 100 * Math.cos(startRad);
                                const y1 = 125 + 100 * Math.sin(startRad);
                                const x2 = 125 + 100 * Math.cos(endRad);
                                const y2 = 125 + 100 * Math.sin(endRad);

                                const largeArc = angle > 180 ? 1 : 0;
                                const path = `M 125 125 L ${x1} ${y1} A 100 100 0 ${largeArc} 1 ${x2} ${y2} Z`;

                                currentAngle = endAngle;

                                return (
                                    <path
                                        key={index}
                                        d={path}
                                        fill={item.color}
                                        stroke="var(--bg-primary)"
                                        strokeWidth="2"
                                    />
                                );
                            })}
                        </svg>
                        <div style={{
                            width: '100%',
                            maxWidth: '350px',
                            display: 'flex',
                            justifyContent: 'center',
                            padding: '0 1rem'
                        }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {chartData.map((item, index) => {
                                    const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
                                    return (
                                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div style={{ width: '16px', height: '16px', backgroundColor: item.color, borderRadius: '3px' }}></div>
                                            <span style={{ color: 'var(--text-primary)', fontSize: '14px' }}>
                                                {item.label}: ${item.value.toLocaleString()} ({percentage}%)
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ padding: '1.5rem 1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <button
                            onClick={() => window.print()}
                            style={{
                                padding: '10px 20px',
                                cursor: 'pointer',
                                background: 'var(--bg-surface)',
                                color: 'var(--text-primary)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '600',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = 'var(--bg-surface-hover)';
                                e.target.style.borderColor = 'var(--accent-primary)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'var(--bg-surface)';
                                e.target.style.borderColor = 'var(--border-color)';
                            }}
                        >
                            🖨️ Print
                        </button>
                        <button
                            onClick={() => alert('Save as PDF functionality coming soon')}
                            style={{
                                padding: '10px 20px',
                                cursor: 'pointer',
                                background: 'var(--bg-surface)',
                                color: 'var(--text-primary)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '600',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = 'var(--bg-surface-hover)';
                                e.target.style.borderColor = 'var(--accent-primary)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'var(--bg-surface)';
                                e.target.style.borderColor = 'var(--border-color)';
                            }}
                        >
                            📄 Save as PDF
                        </button>
                        <button
                            onClick={() => alert('Export to Excel functionality coming soon')}
                            style={{
                                padding: '10px 20px',
                                cursor: 'pointer',
                                background: 'var(--bg-surface)',
                                color: 'var(--text-primary)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '600',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = 'var(--bg-surface-hover)';
                                e.target.style.borderColor = 'var(--accent-primary)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'var(--bg-surface)';
                                e.target.style.borderColor = 'var(--border-color)';
                            }}
                        >
                            📊 Export to Excel
                        </button>
                        <button
                            onClick={() => alert('Send Invoice functionality coming soon')}
                            style={{
                                padding: '10px 20px',
                                cursor: 'pointer',
                                background: 'var(--bg-surface)',
                                color: 'var(--text-primary)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '600',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = 'var(--bg-surface-hover)';
                                e.target.style.borderColor = 'var(--accent-primary)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'var(--bg-surface)';
                                e.target.style.borderColor = 'var(--border-color)';
                            }}
                        >
                            📧 Send Invoice
                        </button>
                        <button
                            onClick={() => alert('Share Link functionality coming soon')}
                            style={{
                                padding: '10px 20px',
                                cursor: 'pointer',
                                background: 'var(--bg-surface)',
                                color: 'var(--text-primary)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '600',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = 'var(--bg-surface-hover)';
                                e.target.style.borderColor = 'var(--accent-primary)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'var(--bg-surface)';
                                e.target.style.borderColor = 'var(--border-color)';
                            }}
                        >
                            🔗 Share Link
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderProductionTable = () => {
        const billableProduction = productionData.filter(item => item.billable !== false);
        const productionTotal = billableProduction.reduce((sum, item) => sum + calculateProductionCost(item), 0);
        const productionTotalDays = billableProduction.reduce((sum, item) => sum + item.days, 0);

        return (
            <div className="budget-section">
                <div className="budget-section-header" onClick={() => setProductionCollapsed(!productionCollapsed)}>
                    <h3>Production</h3>
                    <div className="budget-section-info">
                        <span className="item-count">{productionData.length} items</span>
                        <span className="section-total">{productionTotalDays} days</span>
                        <span className={`collapse-icon ${productionCollapsed ? 'collapsed' : ''}`}>▼</span>
                    </div>
                </div>
                <table className="budget-table">
                    {!productionCollapsed && (
                        <>
                            <thead>
                                <tr>
                                    <th style={{ width: '60px' }}>Cat</th>
                                    <th style={{ textAlign: 'left', width: '250px' }}>Item</th>
                                    <th style={{ width: '80px', textAlign: 'center' }}>Billable</th>
                                    <th style={{ width: '100px' }}>Prod×</th>
                                    <th style={{ width: '100px' }}>Days</th>
                                    <th style={{ textAlign: 'right' }}>Cost (USD)</th>
                                    <th style={{ textAlign: 'center', width: '80px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productionData.map((item) => {
                                    const isEditingDays = editingCell?.itemId === item.id && editingCell?.field === 'days' && editingCell?.tableType === 'production';
                                    const isEditingProdMultiplier = editingCell?.itemId === item.id && editingCell?.field === 'prodMultiplier' && editingCell?.tableType === 'production';
                                    const calculatedCost = calculateProductionCost(item);

                                    return (
                                        <tr key={item.id} style={{ opacity: item.billable === false ? 0.5 : 1 }}>
                                            <td className="category-cell">{item.category || 'prod'}</td>
                                            <td>{item.name}</td>
                                            <td style={{ textAlign: 'center' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={item.billable !== false}
                                                    onChange={(e) => {
                                                        setProductionData(prevData =>
                                                            prevData.map(i =>
                                                                i.id === item.id ? { ...i, billable: e.target.checked } : i
                                                            )
                                                        );
                                                    }}
                                                    style={{
                                                        cursor: 'pointer',
                                                        width: '18px',
                                                        height: '18px',
                                                        accentColor: '#444444'
                                                    }}
                                                />
                                            </td>
                                            <td className="number-cell">
                                                {isEditingProdMultiplier ? (
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        className="editable-input number-cell"
                                                        value={item.prodMultiplier || 1.0}
                                                        onChange={(e) => handleProductionCellChange(item.id, 'prodMultiplier', e.target.value)}
                                                        onBlur={handleCellBlur}
                                                        onKeyDown={handleKeyDown}
                                                        autoFocus
                                                    />
                                                ) : (
                                                    <span
                                                        onClick={() => handleCellClick(item.id, 'prodMultiplier', 'production')}
                                                        className="editable-cell"
                                                    >
                                                        {item.prodMultiplier || 1.0}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="number-cell">
                                                {isEditingDays ? (
                                                    <input
                                                        type="number"
                                                        className="editable-input number-cell"
                                                        value={item.days}
                                                        onChange={(e) => handleProductionCellChange(item.id, 'days', e.target.value)}
                                                        onBlur={handleCellBlur}
                                                        onKeyDown={handleKeyDown}
                                                        autoFocus
                                                    />
                                                ) : (
                                                    <span
                                                        onClick={() => handleCellClick(item.id, 'days', 'production')}
                                                        className="editable-cell"
                                                    >
                                                        {item.days}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="total-cell" style={{ textAlign: 'right' }}>
                                                ${item.billable !== false ? calculatedCost.toLocaleString() : '0'}
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <button
                                                    onClick={() => removeProductionItem(item.id)}
                                                    style={{
                                                        padding: '6px',
                                                        cursor: 'pointer',
                                                        background: 'transparent',
                                                        color: '#ff4444',
                                                        border: 'none',
                                                        fontSize: '18px'
                                                    }}
                                                    title="Remove item"
                                                >
                                                    🗑️
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                <tr>
                                    <td colSpan="5" style={{ padding: '12px 0 12px 1rem', border: 'none' }}>
                                        <button
                                            onClick={addProductionItem}
                                            style={{
                                                padding: '8px 16px',
                                                cursor: 'pointer',
                                                background: 'var(--bg-surface)',
                                                color: 'var(--text-primary)',
                                                border: '1px solid var(--border-color)',
                                                borderRadius: '8px',
                                                fontSize: '14px',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.background = 'var(--bg-surface-hover)';
                                                e.target.style.borderColor = 'var(--accent-primary)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.background = 'var(--bg-surface)';
                                                e.target.style.borderColor = 'var(--border-color)';
                                            }}
                                        >
                                            + Add Item
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </>
                    )}
                    <tfoot>
                        <tr>
                            <td colSpan="4" className="total-label">Subtotal</td>
                            <td className="total-value" style={{ textAlign: 'center' }}>{productionData.reduce((sum, item) => sum + item.days, 0)}</td>
                            <td className="total-value" style={{ textAlign: 'right' }}>${productionTotal.toLocaleString()}</td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        );
    };


    return (
        <div className="previs-budget-view">
            {!readOnly && (
                <div className="budget-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {isEditingTitle ? (
                            <input
                                type="text"
                                value={budgetTitle}
                                onChange={(e) => onBudgetTitleChange(e.target.value)}
                                onBlur={() => setIsEditingTitle(false)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') setIsEditingTitle(false);
                                }}
                                autoFocus
                                style={{
                                    fontSize: '2rem',
                                    fontWeight: 'bold',
                                    background: 'var(--bg-surface)',
                                    border: '2px solid var(--accent-primary)',
                                    borderRadius: '4px',
                                    padding: '0.25rem 0.5rem',
                                    color: 'var(--text-primary)'
                                }}
                            />
                        ) : (
                            <h2
                                onClick={() => setIsEditingTitle(true)}
                                style={{ cursor: 'pointer', margin: 0 }}
                            >
                                {budgetTitle}
                            </h2>
                        )}
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                onClick={onDuplicateBudget}
                                style={{
                                    padding: '0.5rem 1rem',
                                    cursor: 'pointer',
                                    background: 'var(--bg-surface)',
                                    color: 'var(--text-primary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '8px',
                                    fontSize: '14px'
                                }}
                            >
                                Duplicate
                            </button>
                            <button
                                onClick={onNewBudget}
                                style={{
                                    padding: '0.5rem 1rem',
                                    cursor: 'pointer',
                                    background: 'var(--bg-surface)',
                                    color: 'var(--text-primary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '8px',
                                    fontSize: '14px'
                                }}
                            >
                                New
                            </button>
                            <button
                                onClick={onDeleteBudget}
                                style={{
                                    padding: '0.5rem 1rem',
                                    cursor: 'pointer',
                                    background: 'var(--bg-surface)',
                                    color: '#ff4444',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '8px',
                                    fontSize: '14px'
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                    <div className="budget-summary">
                        <span>Grand Total: <strong>{grandTotal}</strong> days</span>
                    </div>
                </div>
            )}

            {renderTeamTable()}

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

            {renderProductionTable()}

            {readOnly && renderScenarioSummary()}
        </div>
    );
};

export const PrevisSummaryView = ({ budgetId }) => {
    // Load all budget data
    const [assetsBudgetData, setAssetsBudgetData] = React.useState(() => {
        const saved = localStorage.getItem(`previsBudgetDataAssets_v4_${budgetId}`);
        return saved ? JSON.parse(saved) : [];
    });

    const [shotsBudgetData, setShotsBudgetData] = React.useState(() => {
        const saved = localStorage.getItem(`previsBudgetDataShots_v6_${budgetId}`);
        return saved ? JSON.parse(saved) : [];
    });

    const [teamRoles, setTeamRoles] = React.useState(() => {
        const saved = localStorage.getItem(`previsBudgetTeamRoles_v5_${budgetId}`);
        return saved ? JSON.parse(saved) : [];
    });

    const [productionData, setProductionData] = React.useState(() => {
        const saved = localStorage.getItem(`previsBudgetProduction_v2_${budgetId}`);
        return saved ? JSON.parse(saved) : [];
    });

    const [contingencyPercent, setContingencyPercent] = React.useState(() => {
        const saved = localStorage.getItem(`contingencyPercent_${budgetId}`);
        return saved ? parseFloat(saved) : 15;
    });

    const [assetsEstimateMultiplier, setAssetsEstimateMultiplier] = React.useState(() => {
        const saved = localStorage.getItem(`assetsEstimateMultiplier_${budgetId}`);
        return saved ? parseFloat(saved) : 1.0;
    });

    const [shotsEstimateMultiplier, setShotsEstimateMultiplier] = React.useState(() => {
        const saved = localStorage.getItem(`shotsEstimateMultiplier_${budgetId}`);
        return saved ? parseFloat(saved) : 1.0;
    });

    const [assetsExtraArtists, setAssetsExtraArtists] = React.useState(() => {
        const saved = localStorage.getItem(`assetsExtraArtists_${budgetId}`);
        const value = saved ? parseFloat(saved) : 0;
        return isNaN(value) ? 0 : value;
    });

    const [shotsExtraArtists, setShotsExtraArtists] = React.useState(() => {
        const saved = localStorage.getItem(`shotsExtraArtists_${budgetId}`);
        const value = saved ? parseFloat(saved) : 0;
        return isNaN(value) ? 0 : value;
    });

    // Budget Scenarios state
    const [savedScenarios, setSavedScenarios] = React.useState(() => {
        const saved = localStorage.getItem(`budgetScenarios_${budgetId}`);
        return saved ? JSON.parse(saved) : [
            { name: 'Default', assetsEst: 1.0, shotsEst: 1.0, assetsExtra: 0, shotsExtra: 0, contingency: 10 },
            { name: 'Fast', assetsEst: 0.8, shotsEst: 0.8, assetsExtra: 2, shotsExtra: 2, contingency: 5 },
            { name: 'Deluxe', assetsEst: 1.5, shotsEst: 1.5, assetsExtra: 0, shotsExtra: 0, contingency: 20 }
        ];
    });

    const [activeScenario, setActiveScenario] = React.useState('Default');

    React.useEffect(() => {
        localStorage.setItem(`budgetScenarios_${budgetId}`, JSON.stringify(savedScenarios));
    }, [savedScenarios, budgetId]);

    // Save to localStorage
    React.useEffect(() => {
        localStorage.setItem(`contingencyPercent_${budgetId}`, contingencyPercent.toString());
    }, [contingencyPercent, budgetId]);

    React.useEffect(() => {
        localStorage.setItem(`assetsEstimateMultiplier_${budgetId}`, assetsEstimateMultiplier.toString());
    }, [assetsEstimateMultiplier, budgetId]);

    React.useEffect(() => {
        localStorage.setItem(`shotsEstimateMultiplier_${budgetId}`, shotsEstimateMultiplier.toString());
    }, [shotsEstimateMultiplier, budgetId]);

    React.useEffect(() => {
        localStorage.setItem(`assetsExtraArtists_${budgetId}`, assetsExtraArtists.toString());
    }, [assetsExtraArtists, budgetId]);

    React.useEffect(() => {
        localStorage.setItem(`shotsExtraArtists_${budgetId}`, shotsExtraArtists.toString());
    }, [shotsExtraArtists, budgetId]);

    // Function to reload all data from localStorage
    const reloadDataFromStorage = React.useCallback(() => {
        const savedAssets = localStorage.getItem(`previsBudgetDataAssets_v4_${budgetId}`);
        const savedShots = localStorage.getItem(`previsBudgetDataShots_v6_${budgetId}`);
        const savedTeam = localStorage.getItem(`previsBudgetTeamRoles_v5_${budgetId}`);
        const savedProduction = localStorage.getItem(`previsBudgetProduction_v2_${budgetId}`);
        const savedContingency = localStorage.getItem(`contingencyPercent_${budgetId}`);
        const savedAssetsMultiplier = localStorage.getItem(`assetsEstimateMultiplier_${budgetId}`);
        const savedShotsMultiplier = localStorage.getItem(`shotsEstimateMultiplier_${budgetId}`);
        const savedAssetsExtraArtists = localStorage.getItem(`assetsExtraArtists_${budgetId}`);
        const savedShotsExtraArtists = localStorage.getItem(`shotsExtraArtists_${budgetId}`);

        if (savedAssets) setAssetsBudgetData(JSON.parse(savedAssets));
        if (savedShots) setShotsBudgetData(JSON.parse(savedShots));
        if (savedTeam) setTeamRoles(JSON.parse(savedTeam));
        if (savedProduction) setProductionData(JSON.parse(savedProduction));
        if (savedContingency) setContingencyPercent(parseFloat(savedContingency));
        if (savedAssetsMultiplier) setAssetsEstimateMultiplier(parseFloat(savedAssetsMultiplier));
        if (savedShotsMultiplier) setShotsEstimateMultiplier(parseFloat(savedShotsMultiplier));
        const assetsValue = savedAssetsExtraArtists ? parseFloat(savedAssetsExtraArtists) : 0;
        const shotsValue = savedShotsExtraArtists ? parseFloat(savedShotsExtraArtists) : 0;
        setAssetsExtraArtists(isNaN(assetsValue) ? 0 : assetsValue);
        setShotsExtraArtists(isNaN(shotsValue) ? 0 : shotsValue);
    }, [budgetId]);

    // Reload data when budgetId changes
    React.useEffect(() => {
        reloadDataFromStorage();
    }, [budgetId, reloadDataFromStorage]);

    // Reload data on component mount (to get fresh data when switching to Summary tab)
    React.useEffect(() => {
        reloadDataFromStorage();
    }, [reloadDataFromStorage]);

    // Helper functions
    const calculateTotalArtistDays = (item) => {
        const artistDays = parseFloat(item.artistDays) || 0;
        const revisions = parseFloat(item.revisions) || 0;
        const complexity = parseFloat(item.complexity) || 1;
        // Total Artist Days = (artistDays + revisions) * complexity (NOT multiplied by teamSize)
        return (artistDays + revisions) * complexity;
    };

    const calculateProductionCost = (item) => {
        const days = parseFloat(item.days) || 0;
        const prodMultiplier = parseFloat(item.prodMultiplier) || 1.0;
        return days * prodMultiplier * 1000;
    };

    const calculateScenarioCost = (item, budgetData, extraArtists = 0) => {
        const totalArtistDays = calculateTotalArtistDays(item);
        const teamSize = parseFloat(item.teamSize) || 1;
        const adjustedTeamSize = teamSize + extraArtists; // Add extra artists, not multiply
        const artists = Array.isArray(item.assignedArtists) ? item.assignedArtists : [];

        if (artists.length === 0) {
            return 0;
        }

        // Cost = Total Artist Days * rate * adjustedTeamSize
        let totalCost = 0;
        const numArtistTypes = artists.length;

        artists.forEach(artistRole => {
            const role = teamRoles.find(r => r.role === artistRole);
            if (role) {
                const rate = parseFloat(role.rate) || 0;
                const rateUnit = role.rateUnit || 'day';
                const dailyRate = rateUnit === 'week' ? rate / 5 : rate;
                const productivity = parseFloat(role.productivity) || 1.0;

                // Cost = (Total Artist Days / productivity) * rate * adjustedTeamSize
                const artistDaysForThisRole = totalArtistDays / (numArtistTypes * productivity);
                totalCost += artistDaysForThisRole * dailyRate * adjustedTeamSize;
            }
        });

        return totalCost;
    };

    // Calculate Assets metrics (only billable) with Estimate Correction and Extra Artists applied
    const billableAssets = assetsBudgetData.filter(item => item.billable !== false);
    const assetsCount = billableAssets.length;
    // Total Artist Days doesn't change with Extra Artists - only affected by Estimate Correction
    const assetsArtistDays = billableAssets.reduce((sum, item) => sum + calculateTotalArtistDays(item), 0) * assetsEstimateMultiplier;
    // Cost is affected by Extra Artists (more people = higher cost for same work)
    const assetsCost = billableAssets.reduce((sum, item) => sum + calculateScenarioCost(item, assetsBudgetData, assetsExtraArtists), 0) * assetsEstimateMultiplier;

    // Calculate Shots metrics (only billable) with Estimate Correction and Extra Artists applied
    const billableShots = shotsBudgetData.filter(item => item.billable !== false);
    const shotsCount = billableShots.length;
    // Total Artist Days doesn't change with Extra Artists - only affected by Estimate Correction
    const shotsArtistDays = billableShots.reduce((sum, item) => sum + calculateTotalArtistDays(item), 0) * shotsEstimateMultiplier;
    // Cost is affected by Extra Artists (more people = higher cost for same work)
    const shotsCost = billableShots.reduce((sum, item) => sum + calculateScenarioCost(item, shotsBudgetData, shotsExtraArtists), 0) * shotsEstimateMultiplier;

    // Helper to calculate local project days for an item
    const calculateLocalProjectDays = (item, extraArtists = 0, estimateMultiplier = 1.0) => {
        const totalArtistDays = calculateTotalArtistDays(item) * estimateMultiplier; // Apply Est×
        const teamSize = parseFloat(item.teamSize) || 1;
        const adjustedTeamSize = teamSize + extraArtists; // Add extra artists, not multiply
        const artists = Array.isArray(item.assignedArtists) ? item.assignedArtists : [];

        if (artists.length === 0) {
            return totalArtistDays / adjustedTeamSize;
        }

        let totalProductivity = 0;
        artists.forEach(artistRole => {
            const role = teamRoles.find(r => r.role === artistRole);
            if (role) {
                totalProductivity += (role.productivity || 1.0);
            }
        });

        if (totalProductivity === 0) {
            return totalArtistDays / adjustedTeamSize;
        }

        // Real Days = Total Artist Days / (Adjusted Team Size * productivity)
        // More people or higher productivity = fewer days
        return totalArtistDays / (adjustedTeamSize * totalProductivity);
    };

    // Calculate Total Artist Days
    const totalArtistDays = assetsArtistDays + shotsArtistDays;

    // Calculate Local Days for Assets and Shots (with Est× applied)
    const assetsLocalDays = billableAssets.reduce((sum, item) => sum + calculateLocalProjectDays(item, assetsExtraArtists, assetsEstimateMultiplier), 0);
    const shotsLocalDays = billableShots.reduce((sum, item) => sum + calculateLocalProjectDays(item, shotsExtraArtists, shotsEstimateMultiplier), 0);
    const totalLocalDays = assetsLocalDays + shotsLocalDays;

    // Calculate Team Capacity per day
    const teamCapacityPerDay = teamRoles.reduce((sum, role) => sum + role.headcount, 0);

    // Calculate Project Days
    const projectDays = teamCapacityPerDay > 0 ? totalArtistDays / teamCapacityPerDay : 0;

    // Calculate Labor Cost
    const laborCost = assetsCost + shotsCost;

    // Calculate Production Cost (only billable)
    const billableProductionData = productionData.filter(item => item.billable !== false);
    const productionCost = billableProductionData.reduce((sum, item) => sum + calculateProductionCost(item), 0);

    // Subtotal before contingency
    const subtotal = laborCost + productionCost;

    // Contingency calculation
    const contingencyAmount = subtotal * (contingencyPercent / 100);

    // Grand Total with contingency
    const grandTotal = subtotal + contingencyAmount;

    // Pie chart data
    const chartData = [
        { label: 'Assets', value: assetsCost, color: '#9E9E9E' },
        { label: 'Shots', value: shotsCost, color: '#616161' },
        { label: 'Production', value: productionCost, color: '#BDBDBD' },
        { label: 'Contingency', value: contingencyAmount, color: '#E0E0E0' }
    ];

    const total = chartData.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = -90; // Start from top

    return (
        <div style={{ padding: '2rem' }}>
            {/* Budget Scenarios Table */}
            <div className="budget-section" style={{ marginBottom: '2rem' }}>
                <div className="budget-section-header">
                    <h3>Budget Scenarios</h3>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <select
                            value={activeScenario}
                            onChange={(e) => {
                                const scenarioName = e.target.value;
                                setActiveScenario(scenarioName);
                                const scenario = savedScenarios.find(s => s.name === scenarioName);
                                if (scenario) {
                                    setAssetsEstimateMultiplier(scenario.assetsEst);
                                    setShotsEstimateMultiplier(scenario.shotsEst);
                                    setAssetsExtraArtists(scenario.assetsExtra);
                                    setShotsExtraArtists(scenario.shotsExtra);
                                    setContingencyPercent(scenario.contingency);
                                }
                            }}
                            style={{
                                padding: '0.4rem 0.6rem',
                                background: 'var(--bg-surface)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '4px',
                                color: 'var(--text-primary)',
                                fontSize: '0.875rem'
                            }}
                        >
                            {savedScenarios.map(scenario => (
                                <option key={scenario.name} value={scenario.name}>{scenario.name}</option>
                            ))}
                        </select>
                        <button
                            onClick={() => {
                                const currentScenario = savedScenarios.find(s => s.name === activeScenario);
                                if (currentScenario) {
                                    const updated = savedScenarios.map(s =>
                                        s.name === activeScenario
                                            ? { ...s, assetsEst: assetsEstimateMultiplier, shotsEst: shotsEstimateMultiplier, assetsExtra: assetsExtraArtists, shotsExtra: shotsExtraArtists, contingency: contingencyPercent }
                                            : s
                                    );
                                    setSavedScenarios(updated);
                                }
                            }}
                            style={{
                                padding: '0.4rem 0.8rem',
                                background: 'var(--bg-surface)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '4px',
                                color: 'var(--text-primary)',
                                cursor: 'pointer',
                                fontSize: '0.875rem'
                            }}
                        >
                            Save
                        </button>
                        <button
                            onClick={() => {
                                const name = prompt('Enter scenario name:');
                                if (name && name.trim()) {
                                    setSavedScenarios([...savedScenarios, {
                                        name: name.trim(),
                                        assetsEst: assetsEstimateMultiplier,
                                        shotsEst: shotsEstimateMultiplier,
                                        assetsExtra: assetsExtraArtists,
                                        shotsExtra: shotsExtraArtists,
                                        contingency: contingencyPercent
                                    }]);
                                    setActiveScenario(name.trim());
                                }
                            }}
                            style={{
                                padding: '0.4rem 0.8rem',
                                background: 'var(--bg-surface)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '4px',
                                color: 'var(--text-primary)',
                                cursor: 'pointer',
                                fontSize: '0.875rem'
                            }}
                        >
                            New
                        </button>
                        <button
                            onClick={() => {
                                if (savedScenarios.length === 1) {
                                    alert('Cannot delete the last scenario');
                                    return;
                                }
                                if (window.confirm(`Delete scenario "${activeScenario}"?`)) {
                                    const filtered = savedScenarios.filter(s => s.name !== activeScenario);
                                    setSavedScenarios(filtered);
                                    setActiveScenario(filtered[0].name);
                                    const first = filtered[0];
                                    setAssetsEstimateMultiplier(first.assetsEst);
                                    setShotsEstimateMultiplier(first.shotsEst);
                                    setAssetsExtraArtists(first.assetsExtra);
                                    setShotsExtraArtists(first.shotsExtra);
                                    setContingencyPercent(first.contingency);
                                }
                            }}
                            style={{
                                padding: '0.4rem 0.8rem',
                                background: 'var(--bg-surface)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '4px',
                                color: 'var(--text-primary)',
                                cursor: 'pointer',
                                fontSize: '0.875rem'
                            }}
                        >
                            Delete
                        </button>
                    </div>
                </div>
                <table className="budget-table" style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left' }}>Parameter</th>
                            <th style={{ textAlign: 'left' }}>Assets</th>
                            <th style={{ textAlign: 'left' }}>Shots</th>
                            <th style={{ textAlign: 'left' }}>Global</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ textAlign: 'left' }}>Estimate Correction (Est×)</td>
                            <td>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={assetsEstimateMultiplier}
                                    onChange={(e) => setAssetsEstimateMultiplier(parseFloat(e.target.value) || 1.0)}
                                    style={{
                                        width: '80px',
                                        padding: '0.25rem 0.5rem',
                                        background: 'var(--bg-surface)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '4px',
                                        color: 'var(--text-primary)',
                                        fontSize: '0.875rem'
                                    }}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={shotsEstimateMultiplier}
                                    onChange={(e) => setShotsEstimateMultiplier(parseFloat(e.target.value) || 1.0)}
                                    style={{
                                        width: '80px',
                                        padding: '0.25rem 0.5rem',
                                        background: 'var(--bg-surface)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '4px',
                                        color: 'var(--text-primary)',
                                        fontSize: '0.875rem'
                                    }}
                                />
                            </td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'left' }}>Extra artists</td>
                            <td>
                                <input
                                    type="number"
                                    step="1"
                                    value={assetsExtraArtists}
                                    onChange={(e) => setAssetsExtraArtists(parseFloat(e.target.value) || 0)}
                                    style={{
                                        width: '80px',
                                        padding: '0.25rem 0.5rem',
                                        background: 'var(--bg-surface)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '4px',
                                        color: 'var(--text-primary)',
                                        fontSize: '0.875rem'
                                    }}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    step="1"
                                    value={shotsExtraArtists}
                                    onChange={(e) => setShotsExtraArtists(parseFloat(e.target.value) || 0)}
                                    style={{
                                        width: '80px',
                                        padding: '0.25rem 0.5rem',
                                        background: 'var(--bg-surface)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '4px',
                                        color: 'var(--text-primary)',
                                        fontSize: '0.875rem'
                                    }}
                                />
                            </td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'left' }}>Contingency %</td>
                            <td>-</td>
                            <td>-</td>
                            <td>
                                <input
                                    type="number"
                                    step="1"
                                    value={contingencyPercent}
                                    onChange={(e) => setContingencyPercent(parseFloat(e.target.value) || 0)}
                                    style={{
                                        width: '80px',
                                        padding: '0.25rem 0.5rem',
                                        background: 'var(--bg-surface)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '4px',
                                        color: 'var(--text-primary)',
                                        fontSize: '0.875rem'
                                    }}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Scenario Summary */}
            <div className="budget-section">
                <div className="budget-section-header">
                    <h3>Scenario Summary</h3>
                </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'stretch', padding: '1.5rem' }}>
                <div style={{
                    flex: '1',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '1rem'
                }}>
                    <table className="budget-table" style={{ width: '100%', background: 'transparent', border: 'none' }}>
                    <tbody>
                        <tr>
                            <td style={{ textAlign: 'left', width: '200px' }}>Assets Count</td>
                            <td style={{ textAlign: 'right', fontFamily: "'Courier New', monospace" }}>{assetsCount}</td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'left' }}>Shots Count</td>
                            <td style={{ textAlign: 'right', fontFamily: "'Courier New', monospace" }}>{shotsCount}</td>
                        </tr>
                        <tr style={{ borderTop: '1px solid var(--border-color)' }}>
                            <td style={{ textAlign: 'left' }}>Assets Artist Days</td>
                            <td style={{ textAlign: 'right', fontFamily: "'Courier New', monospace" }}>{assetsArtistDays.toFixed(1)}</td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'left' }}>Shots Artist Days</td>
                            <td style={{ textAlign: 'right', fontFamily: "'Courier New', monospace" }}>{shotsArtistDays.toFixed(1)}</td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'left', fontWeight: 'bold' }}>Total Artist Days</td>
                            <td style={{ textAlign: 'right', fontFamily: "'Courier New', monospace", fontWeight: 'bold' }}>{totalArtistDays.toFixed(1)}</td>
                        </tr>
                        <tr style={{ borderTop: '1px solid var(--border-color)' }}>
                            <td style={{ textAlign: 'left' }}>Assets Real Days</td>
                            <td style={{ textAlign: 'right', fontFamily: "'Courier New', monospace" }}>{assetsLocalDays.toFixed(1)}</td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'left' }}>Shots Real Days</td>
                            <td style={{ textAlign: 'right', fontFamily: "'Courier New', monospace" }}>{shotsLocalDays.toFixed(1)}</td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'left', fontWeight: 'bold' }}>Total Real Days</td>
                            <td style={{ textAlign: 'right', fontFamily: "'Courier New', monospace", fontWeight: 'bold' }}>{totalLocalDays.toFixed(1)}</td>
                        </tr>
                        <tr style={{ borderTop: '1px solid var(--border-color)' }}>
                            <td style={{ textAlign: 'left' }}>Assets Cost</td>
                            <td style={{ textAlign: 'right', fontFamily: "'Courier New', monospace" }}>${assetsCost.toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'left' }}>Shots Cost</td>
                            <td style={{ textAlign: 'right', fontFamily: "'Courier New', monospace" }}>${shotsCost.toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'left' }}>Production Cost</td>
                            <td style={{ textAlign: 'right', fontFamily: "'Courier New', monospace" }}>${productionCost.toLocaleString()}</td>
                        </tr>
                        <tr style={{ borderTop: '1px solid var(--border-color)' }}>
                            <td style={{ textAlign: 'left', fontWeight: 'bold' }}>Subtotal</td>
                            <td style={{ textAlign: 'right', fontFamily: "'Courier New', monospace", fontWeight: 'bold' }}>${subtotal.toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'left' }}>Contingency ({contingencyPercent}%)</td>
                            <td style={{ textAlign: 'right', fontFamily: "'Courier New', monospace" }}>${contingencyAmount.toLocaleString()}</td>
                        </tr>
                        <tr style={{ borderTop: '2px solid var(--border-color)' }}>
                            <td style={{ textAlign: 'left', fontWeight: 'bold', fontSize: '16px' }}>Grand Total</td>
                            <td style={{ textAlign: 'right', fontFamily: "'Courier New', monospace", fontWeight: 'bold', fontSize: '16px' }}>${grandTotal.toLocaleString()} USD</td>
                        </tr>
                    </tbody>
                </table>
                </div>

                <div style={{
                    flex: '1',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px'
                }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Cost Distribution</h4>
                    <svg width="100%" height="auto" viewBox="0 0 250 250" style={{ maxWidth: '350px' }}>
                        {chartData.map((item, index) => {
                            const percentage = total > 0 ? (item.value / total) * 100 : 0;
                            const angle = (percentage / 100) * 360;
                            const startAngle = currentAngle;
                            const endAngle = currentAngle + angle;

                            // Convert angles to radians
                            const startRad = (startAngle * Math.PI) / 180;
                            const endRad = (endAngle * Math.PI) / 180;

                            // Calculate arc path
                            const x1 = 125 + 100 * Math.cos(startRad);
                            const y1 = 125 + 100 * Math.sin(startRad);
                            const x2 = 125 + 100 * Math.cos(endRad);
                            const y2 = 125 + 100 * Math.sin(endRad);

                            const largeArc = angle > 180 ? 1 : 0;
                            const path = `M 125 125 L ${x1} ${y1} A 100 100 0 ${largeArc} 1 ${x2} ${y2} Z`;

                            currentAngle = endAngle;

                            return (
                                <path
                                    key={index}
                                    d={path}
                                    fill={item.color}
                                    stroke="var(--bg-primary)"
                                    strokeWidth="2"
                                />
                            );
                        })}
                    </svg>
                    <div style={{
                        width: '100%',
                        maxWidth: '350px',
                        display: 'flex',
                        justifyContent: 'center',
                        padding: '0 1rem'
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {chartData.map((item, index) => {
                                const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
                                return (
                                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div style={{ width: '16px', height: '16px', backgroundColor: item.color, borderRadius: '3px' }}></div>
                                        <span style={{ color: 'var(--text-primary)', fontSize: '14px' }}>
                                            {item.label}: ${item.value.toLocaleString()} ({percentage}%)
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ padding: '1.5rem 1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <button
                        onClick={() => window.print()}
                        style={{
                            padding: '10px 20px',
                            cursor: 'pointer',
                            background: 'var(--bg-surface)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '600',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = 'var(--bg-surface-hover)';
                            e.target.style.borderColor = 'var(--accent-primary)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'var(--bg-surface)';
                            e.target.style.borderColor = 'var(--border-color)';
                        }}
                    >
                        🖨️ Print
                    </button>
                    <button
                        onClick={() => alert('Save as PDF functionality coming soon')}
                        style={{
                            padding: '10px 20px',
                            cursor: 'pointer',
                            background: 'var(--bg-surface)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '600',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = 'var(--bg-surface-hover)';
                            e.target.style.borderColor = 'var(--accent-primary)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'var(--bg-surface)';
                            e.target.style.borderColor = 'var(--border-color)';
                        }}
                    >
                        📄 Save as PDF
                    </button>
                    <button
                        onClick={() => alert('Export to Excel functionality coming soon')}
                        style={{
                            padding: '10px 20px',
                            cursor: 'pointer',
                            background: 'var(--bg-surface)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '600',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = 'var(--bg-surface-hover)';
                            e.target.style.borderColor = 'var(--accent-primary)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'var(--bg-surface)';
                            e.target.style.borderColor = 'var(--border-color)';
                        }}
                    >
                        📊 Export to Excel
                    </button>
                    <button
                        onClick={() => alert('Send Invoice functionality coming soon')}
                        style={{
                            padding: '10px 20px',
                            cursor: 'pointer',
                            background: 'var(--bg-surface)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '600',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = 'var(--bg-surface-hover)';
                            e.target.style.borderColor = 'var(--accent-primary)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'var(--bg-surface)';
                            e.target.style.borderColor = 'var(--border-color)';
                        }}
                    >
                        📧 Send Invoice
                    </button>
                    <button
                        onClick={() => alert('Share Link functionality coming soon')}
                        style={{
                            padding: '10px 20px',
                            cursor: 'pointer',
                            background: 'var(--bg-surface)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '600',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = 'var(--bg-surface-hover)';
                            e.target.style.borderColor = 'var(--accent-primary)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'var(--bg-surface)';
                            e.target.style.borderColor = 'var(--border-color)';
                        }}
                    >
                        🔗 Share Link
                    </button>
                </div>
            </div>
            </div>
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
