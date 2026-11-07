import React, { useEffect } from 'react';

export default function ImageViewerModal({ isOpen, src, alt, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !src) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content image-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Diagram Inspector</h3>
          <button type="button" className="btn-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-image-body">
          <img src={src} alt={alt || 'Enlarged diagram'} className="modal-enlarged-img" />
          {alt && <p className="modal-image-caption">{alt}</p>}
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Close Viewer</button>
        </div>
      </div>
    </div>
  );
}

