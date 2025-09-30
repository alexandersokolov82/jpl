// src/App.js
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TabNavigation, Breadcrumbs, DetailView, CardListView, PrevisShotsView, PrevisAssetsView, PrevisBudgetView } from './components';
import { projectData } from './data';
import './App.css';

function App() {
    // Load data from localStorage or use default projectData
    const [data, setData] = useState(() => {
        const savedData = localStorage.getItem('continuityData');
        return savedData ? JSON.parse(savedData) : projectData;
    });
    const [viewStack, setViewStack] = useState(['PROJ_001']);
    const [activeTab, setActiveTab] = useState('Main');

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
            setActiveTab('Main');
        }
    };

    const currentItem = data[viewStack[viewStack.length - 1]];
    const breadcrumbItems = viewStack.map(itemId => data[itemId]);
    const childItems = currentItem.children?.map(childId => data[childId]) || [];

    return (
        <div className="app-container">
            <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

            {activeTab === 'Main' ? (
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
            ) : activeTab === 'Previs Shots' ? (
                <PrevisShotsView data={data} onShotClick={handleShotClick} />
            ) : activeTab === 'Previs Assets' ? (
                <PrevisAssetsView />
            ) : activeTab === 'Previs Budget' ? (
                <PrevisBudgetView data={data} />
            ) : (
                <div className="placeholder-view">
                    <h2>{activeTab}</h2>
                    <p>Content for this tab will be implemented soon.</p>
                </div>
            )}
        </div>
    );
}

export default App;
