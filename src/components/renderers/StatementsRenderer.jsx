import React from 'react';

export default function StatementsRenderer({ statements }) {
  if (!statements || !statements.length) return null;

  return (
    <div className="statements-list-container">
      {statements.map((stmt, idx) => (
        <div key={idx} className="statement-item">
          <span className="statement-badge">{stmt.label}</span>
          <span className="statement-text">{stmt.text}</span>
        </div>
      ))}
    </div>
  );
}

