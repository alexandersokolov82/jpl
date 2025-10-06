// src/App.js
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TabNavigation, Breadcrumbs, DetailView, CardListView, PrevisShotsView, PrevisAssetsView, PrevisBudgetView, PrevisSummaryView, ProjectsListView } from './components';
import { projectData } from './data';
import './App.css';

function App() {
    // Clear old budget data to force reload with new shot names
    useEffect(() => {
        const currentVersion = 'v13_project_estimates';
        const storedVersion = localStorage.getItem('budgetDataVersion');
        if (storedVersion !== currentVersion) {
            // Clear ALL localStorage to reset to defaults
            localStorage.clear();
            localStorage.setItem('budgetDataVersion', currentVersion);
            // Force reload
            window.location.reload();
        }
    }, []);

    // Load data from localStorage or use default projectData
    const [data, setData] = useState(() => {
        // TEMPORARY: Always use projectData to get new shot names
        return projectData;
        // const savedData = localStorage.getItem('continuityData');
        // return savedData ? JSON.parse(savedData) : projectData;
    });
    const [viewStack, setViewStack] = useState(['PROJ_001']);
    const [activeTab, setActiveTab] = useState('Main');

    // Budget tabs management
    const [budgetTabs, setBudgetTabs] = useState(() => {
        const saved = localStorage.getItem('budgetTabs');
        return saved ? JSON.parse(saved) : [{ id: 'budget_1', name: 'Project Estimates' }];
    });

    const [activeBudgetTab, setActiveBudgetTab] = useState(() => {
        const saved = localStorage.getItem('activeBudgetTab');
        return saved || 'budget_1';
    });

    React.useEffect(() => {
        localStorage.setItem('budgetTabs', JSON.stringify(budgetTabs));
    }, [budgetTabs]);

    React.useEffect(() => {
        localStorage.setItem('activeBudgetTab', activeBudgetTab);
    }, [activeBudgetTab]);

    // Save data to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('continuityData', JSON.stringify(data));
    }, [data]);

    const handleDrillDown = (itemId) => {
        setViewStack([...viewStack, itemId]);
    };

    const handleBreadcrumbClick = (index) => {
        setViewStack(viewStack.slice(0, index + 1));
    };

    const handleAddItem = (parentId) => {
        const parent = data[parentId];
        if (!parent) return;

        let childType;
        if (parent.type === 'project') childType = 'sequence';
        else if (parent.type === 'sequence') childType = 'scene';
        else if (parent.type === 'scene') childType = 'shot';
        else return;

        const newId = `${childType.toUpperCase()}_${Date.now()}`;
        const newItem = {
            id: newId,
            type: childType,
            name: `New ${childType}`,
            code: newId,
            description: 'Description required',
            image: `https://picsum.photos/seed/${newId}/400/225`,
            studio: 'Warner Bros.',
            ...(childType !== 'shot' && { children: [] }),
            ...(childType === 'shot' && { duration: 100 }),
        };

        setData(prevData => ({
            ...prevData,
            [newId]: newItem,
            [parentId]: {
                ...parent,
                children: [...parent.children, newId],
            },
        }));
    };

    const handleNavigateSibling = (direction) => {
        if (viewStack.length < 2) return;

        const parentId = viewStack[viewStack.length - 2];
        const parent = data[parentId];
        const siblings = parent.children;
        const currentId = viewStack[viewStack.length - 1];
        const currentIndex = siblings.indexOf(currentId);

        let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

        if (newIndex >= 0 && newIndex < siblings.length) {
            const newId = siblings[newIndex];
            setViewStack(prevStack => [...prevStack.slice(0, -1), newId]);
        }
    };

    const handleUpdateItem = (updatedItem) => {
        setData(prevData => ({
            ...prevData,
            [updatedItem.id]: updatedItem,
        }));
    };

    const handleDeleteItem = (itemId) => {
        if (!window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
            return;
        }

        setData(prevData => {
            const newData = { ...prevData };
            const itemToDelete = newData[itemId];

            // Find parent and remove this item from parent's children
            const parentId = viewStack[viewStack.length - 2];
            if (parentId && newData[parentId]) {
                newData[parentId] = {
                    ...newData[parentId],
                    children: newData[parentId].children.filter(id => id !== itemId)
                };
            }

            // Recursively delete all children
            const deleteRecursive = (id) => {
                const item = newData[id];
                if (item && item.children) {
                    item.children.forEach(childId => deleteRecursive(childId));
                }
                delete newData[id];
            };

            deleteRecursive(itemId);
            return newData;
        });

        // Navigate back to parent
        if (viewStack.length > 1) {
            setViewStack(viewStack.slice(0, -1));
        }
    };

    const handleShotClick = (shotId) => {
        // Find parent scene and sequence for this shot
        const shot = data[shotId];
        let sceneId = null;
        let sequenceId = null;

        // Find scene that contains this shot
        Object.values(data).forEach(item => {
            if (item.type === 'scene' && item.children?.includes(shotId)) {
                sceneId = item.id;
            }
        });

        // Find sequence that contains this scene
        if (sceneId) {
            Object.values(data).forEach(item => {
                if (item.type === 'sequence' && item.children?.includes(sceneId)) {
                    sequenceId = item.id;
                }
            });
        }

        // Build view stack: project -> sequence -> scene -> shot
        if (sequenceId && sceneId) {
            setViewStack(['PROJ_001', sequenceId, sceneId, shotId]);
            setActiveTab('Previs Shots'); // Make Previs Shots tab active
            setActiveBudgetTab(null);
        }
    };

    const handleAssetClick = (assetId) => {
        const asset = data[assetId];
        if (!asset) return;

        // Find parent category and root for the asset
        let categoryId = null;
        Object.values(data).forEach(item => {
            if (item.type === 'asset_category' && item.children?.includes(assetId)) {
                categoryId = item.id;
            }
        });

        // Build view stack: project -> assets_root -> category -> asset
        if (categoryId) {
            setViewStack(['PROJ_001', 'ASSETS_ROOT', categoryId, assetId]);
        } else {
            // Fallback for assets without a category
            setViewStack(['PROJ_001', 'ASSETS_ROOT', assetId]);
        }
        setActiveTab('Previs Assets'); // Make Previs Assets tab active
        setActiveBudgetTab(null);
    };

    const handleProjectClick = (projectId) => {
        setViewStack([projectId]);
        setActiveTab('Project');
        setActiveBudgetTab(null);
    };

    const handleNavigateToProject = () => {
        setActiveTab('Project');
        setViewStack(['PROJ_001']);
        setActiveBudgetTab(null);
    };

    const handleBudgetTitleChange = (newTitle) => {
        setBudgetTabs(tabs => tabs.map(tab =>
            tab.id === activeBudgetTab ? { ...tab, name: newTitle } : tab
        ));
    };

    const handleDuplicateBudget = () => {
        const currentTab = budgetTabs.find(tab => tab.id === activeBudgetTab);
        if (!currentTab) return;

        // Find next available number
        const existingNumbers = budgetTabs
            .map(tab => {
                const match = tab.name.match(/\s(\d+)$/);
                return match ? parseInt(match[1]) : 0;
            });
        const nextNumber = Math.max(...existingNumbers, 1) + 1;

        const newBudgetId = `budget_${Date.now()}`;
        const newBudgetName = `${currentTab.name.replace(/\s\d+$/, '')} ${nextNumber}`;

        // Copy all budget data from current tab to new tab
        const budgetDataKeys = [
            'previsBudgetProduction_v2',
            'previsBudgetTeamRoles_v5',
            'previsBudgetDataAssets_v4',
            'previsBudgetDataShots_v6',
            'assetsEstimateMultiplier',
            'shotsEstimateMultiplier',
            'contingencyPercent'
        ];

        budgetDataKeys.forEach(key => {
            const sourceKey = `${key}_${activeBudgetTab}`;
            const targetKey = `${key}_${newBudgetId}`;
            const data = localStorage.getItem(sourceKey);
            if (data) {
                localStorage.setItem(targetKey, data);
            }
        });

        // Add new tab
        setBudgetTabs(tabs => [...tabs, { id: newBudgetId, name: newBudgetName }]);
        setActiveBudgetTab(newBudgetId);
    };

    const handleNewBudget = () => {
        const newBudgetId = `budget_${Date.now()}`;
        const newBudgetName = 'New Estimate';

        setBudgetTabs(tabs => [...tabs, { id: newBudgetId, name: newBudgetName }]);
        setActiveBudgetTab(newBudgetId);
    };

    const handleDeleteBudget = () => {
        if (budgetTabs.length === 1) {
            alert('Cannot delete the last budget tab.');
            return;
        }

        if (!window.confirm('Delete this budget? This action cannot be undone.')) {
            return;
        }

        // Delete all data for this budget
        const budgetDataKeys = [
            'previsBudgetProduction_v2',
            'previsBudgetTeamRoles_v5',
            'previsBudgetDataAssets_v4',
            'previsBudgetDataShots_v6',
            'assetsEstimateMultiplier',
            'shotsEstimateMultiplier',
            'contingencyPercent'
        ];

        budgetDataKeys.forEach(key => {
            localStorage.removeItem(`${key}_${activeBudgetTab}`);
        });

        // Remove tab and switch to first remaining tab
        const remainingTabs = budgetTabs.filter(tab => tab.id !== activeBudgetTab);
        setBudgetTabs(remainingTabs);
        setActiveBudgetTab(remainingTabs[0].id);
    };

    const currentItem = data[viewStack[viewStack.length - 1]];
    const breadcrumbItems = viewStack.map(itemId => data[itemId]);
    const childItems = currentItem.children?.map(childId => data[childId]) || [];

    const currentBudgetTab = budgetTabs.find(tab => tab.id === activeBudgetTab);

    const handleBudgetTabChange = (budgetId) => {
        setActiveBudgetTab(budgetId);
        setActiveTab(null); // Reset activeTab when switching to budget tab
    };

    const handleMainTabChange = (tab) => {
        setActiveTab(tab);

        // For Summary tab, keep the last active budget ID but clear the active state
        if (tab === 'Previs Summary') {
            // Keep activeBudgetTab value but visually it won't be highlighted
        } else {
            setActiveBudgetTab(null);
        }

        // Reset viewStack when switching to list views
        if (tab === 'Previs Shots' || tab === 'Previs Assets') {
            setViewStack(['PROJ_001']);
        }
    };

    return (
        <div className="app-container">
            <TabNavigation
                activeTab={activeTab}
                onTabChange={handleMainTabChange}
                budgetTabs={budgetTabs}
                activeBudgetTab={activeBudgetTab}
                onBudgetTabChange={handleBudgetTabChange}
            />

            {activeTab === 'Previs Shots' && viewStack.length > 1 ? (
                <>
                    <Breadcrumbs items={breadcrumbItems} onClick={handleBreadcrumbClick} />
                    <div className="main-content">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentItem.id}
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 50 }}
                                transition={{ duration: 0.3 }}
                            >
                                <DetailView item={currentItem} onAddItem={() => handleAddItem(currentItem.id)} onNavigate={handleNavigateSibling} onUpdateItem={handleUpdateItem} onDeleteItem={handleDeleteItem} />
                            </motion.div>
                        </AnimatePresence>
                        <AnimatePresence>
                            <CardListView items={childItems} onItemClick={handleDrillDown} />
                        </AnimatePresence>
                    </div>
                </>
            ) : activeTab === 'Main' ? (
                <ProjectsListView onProjectClick={handleProjectClick} />
            ) : activeTab === 'Previs Shots' ? (
                <PrevisShotsView data={data} onShotClick={handleShotClick} onNavigateToProject={handleNavigateToProject} />
            ) : activeTab === 'Previs Assets' && viewStack.length > 1 ? (
                <>
                    <Breadcrumbs items={breadcrumbItems} onClick={handleBreadcrumbClick} />
                    <div className="main-content">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentItem.id}
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 50 }}
                                transition={{ duration: 0.3 }}
                            >
                                <DetailView item={currentItem} onAddItem={() => handleAddItem(currentItem.id)} onNavigate={handleNavigateSibling} onUpdateItem={handleUpdateItem} onDeleteItem={handleDeleteItem} />
                            </motion.div>
                        </AnimatePresence>
                        <AnimatePresence>
                            <CardListView items={childItems} onItemClick={handleDrillDown} />
                        </AnimatePresence>
                    </div>
                </>
            ) : activeTab === 'Previs Assets' ? (
                <PrevisAssetsView data={data} onAssetClick={handleAssetClick} onNavigateToProject={handleNavigateToProject} />
            ) : activeTab === 'Previs Summary' ? (
                <PrevisSummaryView budgetId={activeBudgetTab || budgetTabs[0]?.id || 'budget_1'} onNavigateToProject={handleNavigateToProject} />
            ) : activeTab === 'Project' ? (
                <>
                    <Breadcrumbs items={breadcrumbItems} onClick={handleBreadcrumbClick} />
                    <div className="main-content">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentItem.id}
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 50 }}
                                transition={{ duration: 0.3 }}
                            >
                                <DetailView item={currentItem} onAddItem={() => handleAddItem(currentItem.id)} onNavigate={handleNavigateSibling} onUpdateItem={handleUpdateItem} onDeleteItem={handleDeleteItem} />
                            </motion.div>
                        </AnimatePresence>
                        <AnimatePresence>
                            <CardListView items={childItems} onItemClick={handleDrillDown} />
                        </AnimatePresence>
                    </div>
                </>
            ) : (
                <PrevisBudgetView
                    data={data}
                    onShotClick={handleShotClick}
                    onAssetClick={handleAssetClick}
                    budgetId={activeBudgetTab}
                    budgetTitle={currentBudgetTab?.name || 'Previs Budget'}
                    onBudgetTitleChange={handleBudgetTitleChange}
                    onDuplicateBudget={handleDuplicateBudget}
                    onNewBudget={handleNewBudget}
                    onDeleteBudget={handleDeleteBudget}
                    onNavigateToProject={handleNavigateToProject}
                />
            )}
        </div>
    );
}

export default App;
