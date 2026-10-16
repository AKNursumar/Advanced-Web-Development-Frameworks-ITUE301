import React, { useState } from 'react';

export default function TaskForm({ onTaskCreated, isSubmitting }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setValidationError('Please enter a task title.');
      return;
    }

    setValidationError('');
    try {
      await onTaskCreated({
        title: title.trim(),
        description: description.trim(),
        priority
      });
      setTitle('');
      setDescription('');
      setPriority('medium');
    } catch (err) {
      // Handled by parent
    }
  };

  return (
    <div className="card">
      <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span>➕</span> Add Personal Task
      </h2>

      {validationError && (
        <div style={{ color: 'var(--accent-rose)', fontSize: '0.85rem', marginBottom: '0.75rem', fontWeight: 600 }}>
          {validationError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="taskTitle">Task Title *</label>
            <input
              id="taskTitle"
              type="text"
              className="form-input"
              placeholder="e.g. Test JWT token expiration handling..."
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setValidationError('');
              }}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="taskPriority">Priority</label>
            <select
              id="taskPriority"
              className="form-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              disabled={isSubmitting}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="taskDesc">Description (Optional)</label>
          <textarea
            id="taskDesc"
            className="form-textarea"
            placeholder="Notes or requirements..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving to Database...' : 'Create Protected Task'}
        </button>
      </form>
    </div>
  );
}
