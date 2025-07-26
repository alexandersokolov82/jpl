// src/App.js
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Breadcrumbs, DetailView, CardListView } from './components';
import { projectData } from './data';
import './App.css';

function App() {
    const [data, setData] = useState(projectData);
    const [viewStack, setViewStack] = useState(['PROJ_001']);

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
            description: 'A new item description.',
            image: `https://picsum.photos/seed/${newId}/400/225`,
            ...(childType !== 'shot' && { children: [] }),
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

    const currentItem = data[viewStack[viewStack.length - 1]];
    const breadcrumbItems = viewStack.map(itemId => data[itemId]);
    const childItems = currentItem.children?.map(childId => data[childId]) || [];

    return (
        <div className="app-container">
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
                        <DetailView item={currentItem} onAddItem={() => handleAddItem(currentItem.id)} onNavigate={handleNavigateSibling} onUpdateItem={handleUpdateItem} />
                    </motion.div>
                </AnimatePresence>
                <AnimatePresence>
                    <CardListView items={childItems} onItemClick={handleDrillDown} />
                </AnimatePresence>
            </div>
        </div>
    );
}

export default App;
