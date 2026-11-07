import React from 'react';

export default function TableRenderer({ table }) {
  if (!table || !table.columns) return null;

  return (
    <div className="table-block-container">
      {table.caption && <div className="table-caption">{table.caption}</div>}
      <div className="table-scroll-container">
        <table className="data-table">
          <thead>
            <tr>
              {table.columns.map((col, idx) => (
                <th key={idx}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, rIdx) => (
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
  );
}

