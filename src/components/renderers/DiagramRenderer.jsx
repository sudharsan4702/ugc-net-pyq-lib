import React from 'react';

export default function DiagramRenderer({ visualReference, figuresDir = '/ugc-net-jun-2026/figures', onInspect }) {
  if (!visualReference) return null;

  // Resolve image source cleanly
  let imgSrc = visualReference.image_file;
  if (imgSrc && !imgSrc.startsWith('/')) {
    imgSrc = `/ugc-net-jun-2026/${imgSrc}`;
  }

  return (
    <div className="diagram-container">
      <div className="diagram-card">
        <div className="diagram-image-wrapper">
          <img
            src={imgSrc}
            alt={visualReference.description || 'Question diagram figure'}
            className="diagram-image"
            loading="lazy"
            onClick={() => onInspect && onInspect(imgSrc, visualReference.description)}
          />
          <button
            type="button"
            className="diagram-zoom-btn"
            title="Inspect / Enlarge diagram"
            onClick={() => onInspect && onInspect(imgSrc, visualReference.description)}
          >
            🔍 Enlarge Diagram
          </button>
        </div>
        {visualReference.description && (
          <div className="diagram-caption">
            <strong>Figure Context:</strong> {visualReference.description}
          </div>
        )}
      </div>
    </div>
  );
}

