// src/App.js
import React, { useState } from 'react';
import { projectData as initialData } from './data';
import { Breadcrumbs, DetailView, ListView } from './components';
import './App.css';

function App() {
  const [projectData, setProjectData] = useState(initialData);
  const [viewStack, setViewStack] = useState(['PROJ_001']);

  const handleDrillDown = (itemId) => {
    setViewStack([...viewStack, itemId]);
  };

  const handleBreadcrumbClick = (index) => {
    setViewStack(viewStack.slice(0, index + 1));
  };

  // --- НОВАЯ ФУНКЦИЯ (добавление записи) ---
  const handleAddItem = (parentId) => {
    const parent = projectData[parentId];
    if (!parent) return;

    let childType;
    if (parent.type === 'project') childType = 'sequence';
    else if (parent.type === 'sequence') childType = 'scene';
    else if (parent.type === 'scene') childType = 'shot';
    else return; // Нельзя добавить дочерний элемент к шоту

    const newId = `${childType.toUpperCase()}_${Date.now()}`;
    const newItem = {
      id: newId,
      type: childType,
      name: `New ${childType}`,
      code: newId,
      description: 'A new item description.',
      image: `https://picsum.photos/seed/${newId}/400/225`,
      ...(childType !== 'shot' && { children: [] }), // Добавляем children, если это не шот
    };

    setProjectData(prevData => ({
      ...prevData,
      [newId]: newItem,
      [parentId]: {
        ...parent,
        children: [...parent.children, newId],
      },
    }));
  };
  
  // --- НОВАЯ ФУНКЦИЯ (переход к соседней записи) ---
  const handleNavigateSibling = (direction) => {
    if (viewStack.length < 2) return; // Нельзя перемещаться на уровне проекта

    const parentId = viewStack[viewStack.length - 2];
    const parent = projectData[parentId];
    const siblings = parent.children;
    const currentId = viewStack[viewStack.length - 1];
    const currentIndex = siblings.indexOf(currentId);

    let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

    if (newIndex >= 0 && newIndex < siblings.length) {
      const newId = siblings[newIndex];
      setViewStack(prevStack => [...prevStack.slice(0, -1), newId]);
    }
  };

  const currentItemId = viewStack[viewStack.length - 1];
  const currentItem = projectData[currentItemId];

  const breadcrumbItems = viewStack.map(itemId => projectData[itemId]);
  const childItems = currentItem.children?.map(childId => projectData[childId]) || [];

  const getChildType = () => {
    if (currentItem.type === 'project') return 'Sequences';
    if (currentItem.type === 'sequence') return 'Scenes';
    if (currentItem.type === 'scene') return 'Shots';
    return null;
  };
  
  return (
    <div className="app-container">
      <Breadcrumbs items={breadcrumbItems} onClick={handleBreadcrumbClick} />
      <div className="main-content">
        <DetailView 
          item={currentItem}
          onAddItem={() => handleAddItem(currentItemId)}
          onNavigate={handleNavigateSibling}
          isRoot={viewStack.length === 1}
        />
        {childItems.length > 0 && (
          <ListView
            items={childItems}
            title={getChildType()}
            onItemClick={handleDrillDown}
          />
        )}
      </div>
    </div>
  );
}

export default App;