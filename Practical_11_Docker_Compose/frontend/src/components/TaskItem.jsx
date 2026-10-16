import React from 'react';

export default function TaskItem({ task, onToggleComplete, onDelete }) {
  const handleDelete = () => {
    if (window.confirm(`Delete task "${task.title}"?`)) {
      onDelete(task._id);
    }
  };

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        <h4 className="task-title" style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
          {task.title}
        </h4>
        {task.description && <p className="task-desc">{task.description}</p>}
        <div style={{ marginTop: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span>Priority: <strong>{task.priority}</strong></span>
          <span style={{ marginLeft: '1rem' }}>
            Created: {new Date(task.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
      <div className="task-actions">
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.85rem' }}>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleComplete(task._id, !task.completed)}
            style={{ width: 'auto' }}
          />
          Done
        </label>
        <button className="btn btn-danger" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}
