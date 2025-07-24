// src/components.js
import React from 'react';

export const Breadcrumbs = ({ items, onClick }) => (
  <nav className="breadcrumbs">
    {items.map((item, index) => (
      <span key={item.id}>
        <button onClick={() => onClick(index)}>{item.name}</button>
        {index < items.length - 1 && ' > '}
      </span>
    ))}
  </nav>
);

// --- ÊÎÌÏÎÍÅÍÒ ÎÁÍÎÂË¨Í ---
export const DetailView = ({ item, onAddItem, onNavigate, isRoot }) => {
  const itemType = item.type.toUpperCase();

  const getChildTypeName = () => {
    if (item.type === 'project') return 'Sequence';
    if (item.type === 'sequence') return 'Scene';
    if (item.type === 'scene') return 'Shot';
    return null;
  };

  const childTypeName = getChildTypeName();

  return (
    <div className="detail-view-container">
      <div className="details">
        <h2>{itemType}</h2>
        <div className="detail-grid">
          <span>{itemType} CODE</span><strong>{item.code || item.id}</strong>
          <span>{itemType} Name</span><strong>{item.name}</strong>
          <span>{itemType} Description</span><p>{item.description}</p>
          {item.scriptPageStart && (
            <>
              <span>Script Page Start</span><strong>{item.scriptPageStart}</strong>
              <span>Script Page End</span><strong>{item.scriptPageEnd}</strong>
            </>
          )}
        </div>
      </div>
      <div className="detail-image-actions">
        {item.image && <img src={item.image} alt={item.name} className="detail-image" />}
        <div className="actions">
          {childTypeName && <button onClick={onAddItem}>New {childTypeName}</button>}
          <button>Edit {item.type}</button>
          <button onClick={() => onNavigate('prev')} disabled={isRoot}>Previous</button>
          <button onClick={() => onNavigate('next')} disabled={isRoot}>Next</button>
          <button className="delete">Delete {item.type}</button>
        </div>
      </div>
    </div>
  );
};


export const ListView = ({ items, title, onItemClick }) => {
  if (!items || items.length === 0) return null;
  
  const firstItem = items[0];
  const columns = ['code', 'name', 'description'];
  if (firstItem.pageStart !== undefined) {
    columns.push('pageStart', 'pageEnd', 'pages');
  }
  columns.push('image');

  return (
    <div className="list-view-container">
      <div className="list-header">
        <h2>{title}</h2>
        <div className="list-actions">
          <button>Sort by pages</button>
          <button>Sort by number</button>
          <button>Add Scene...</button>
          <button className="delete">Delete Selected</button>
        </div>
      </div>
      <table className="list-table">
        <thead>
          <tr>
            {columns.map(col => (
                <th key={col}>{col.replace(/([A-Z])/g, ' $1').toUpperCase()}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} onClick={() => onItemClick(item.id)}>
              {columns.map(col => (
                <td key={col}>
                  {col === 'image' && item.image ? 
                   <img src={item.image.replace('/400/225', '/120/68')} alt={item.name} className="table-image" /> : 
                   item[col]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};