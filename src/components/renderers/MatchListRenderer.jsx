import React from 'react';

export default function MatchListRenderer({ matchingItems }) {
  if (!matchingItems) return null;

  const { list_I_title, list_II_title, list_I, list_II } = matchingItems;

  return (
    <div className="match-list-container">
      <div className="match-list-card">
        <h4 className="match-column-header">{list_I_title || 'LIST - I'}</h4>
        <div className="match-items-wrapper">
          {list_I?.map((item, idx) => (
            <div key={idx} className="match-item-row">
              <span className="badge badge-primary">{item.label}</span>
              <span className="match-item-text">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="match-list-card">
        <h4 className="match-column-header">{list_II_title || 'LIST - II'}</h4>
        <div className="match-items-wrapper">
          {list_II?.map((item, idx) => (
            <div key={idx} className="match-item-row">
              <span className="badge badge-secondary">{item.label}</span>
              <span className="match-item-text">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

