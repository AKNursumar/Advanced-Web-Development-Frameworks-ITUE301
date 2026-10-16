import React, { useEffect } from 'react';

export default function ConfirmDialog({ isOpen, task, onConfirm, onCancel, isDeleting }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen || !task) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
      <div className="modal-card">
        <div className="modal-icon">⚠️</div>
        <h3 id="dialog-title" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          Delete Task?
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', marginBottom: '0.5rem' }}>
          Are you sure you want to permanently remove:
        </p>
        <p style={{ fontWeight: 700, color: 'var(--text-primary)', wordBreak: 'break-word' }}>
          "{task.title}"
        </p>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          This record will be deleted from MongoDB and cannot be restored.
        </p>

        <div className="modal-actions">
          <button
            onClick={onCancel}
            className="btn btn-outline"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="btn btn-danger"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
