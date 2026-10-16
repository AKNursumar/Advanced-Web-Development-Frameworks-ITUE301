import React from 'react';

export default function TaskItem({ task, onToggleComplete, onDeleteClick }) {
  const formattedDate = new Date(task.createdAt).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        className="task-checkbox"
        checked={task.completed}
        onChange={() => onToggleComplete(task)}
        aria-label={`Mark "${task.title}" as completed`}
      />

      <div className="task-content">
        <div className="task-title-line">
          <span className="task-title">{task.title}</span>
          <span className={`priority-badge priority-${task.priority || 'medium'}`}>
            {task.priority || 'medium'}
          </span>
        </div>

        {task.description && <p className="task-desc">{task.description}</p>}

        <div className="task-timestamp">
          <span>Created: {formattedDate}</span>
          {task.completed && <span style={{ color: 'var(--accent-emerald)', marginLeft: '1rem' }}>✓ Done</span>}
        </div>
      </div>

      <button
        onClick={() => onDeleteClick(task)}
        className="btn btn-danger"
        title="Delete Task"
        aria-label={`Delete task ${task.title}`}
      >
        🗑 Delete
      </button>
    </div>
  );
}
