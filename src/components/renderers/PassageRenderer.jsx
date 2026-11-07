import React, { useState } from 'react';

export default function PassageRenderer({ passage }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!passage) return null;

  return (
    <div className="passage-container">
      <div className="passage-header">
        <div className="passage-title-group">
          <span className="badge badge-accent">Passage / Comprehension</span>
          {passage.applies_to_questions && (
            <span className="passage-applies">
              Applies to Questions: <strong>{passage.applies_to_questions.join(', ')}</strong>
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="btn-text btn-collapse"
        >
          {isCollapsed ? 'Show Passage ▲' : 'Hide Passage ▼'}
        </button>
      </div>

      {!isCollapsed && (
        <div className="passage-body">
          {passage.heading && <div className="passage-heading">{passage.heading}</div>}
          <div className="passage-text">{passage.text}</div>

          {passage.table && (
            <div className="passage-table-wrapper">
              {passage.table.caption && (
                <div className="table-caption">{passage.table.caption}</div>
              )}
              <div className="table-scroll-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      {passage.table.columns.map((col, idx) => (
                        <th key={idx}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {passage.table.rows.map((row, rIdx) => (
                      <tr key={rIdx}>
                        {row.map((cell, cIdx) => (
                          <td key={cIdx}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

