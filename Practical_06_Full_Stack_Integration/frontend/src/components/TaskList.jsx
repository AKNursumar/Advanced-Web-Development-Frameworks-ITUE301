import React, { useState } from 'react';
import TaskItem from './TaskItem';

export default function TaskList({ tasks, loading, onToggleComplete, onDeleteClick }) {
  const [filter, setFilter] = useState('all');

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
          Tasks from MongoDB ({filteredTasks.length})
        </h2>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {['all', 'active', 'completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="btn btn-outline"
              style={{
                padding: '0.3rem 0.75rem',
                fontSize: '0.8rem',
                textTransform: 'capitalize',
                background: filter === f ? 'var(--accent-primary)' : undefined,
                color: filter === f ? '#fff' : undefined,
                borderColor: filter === f ? 'var(--accent-primary)' : undefined
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading && <div className="spinner" role="status" aria-label="Loading tasks"></div>}

      {!loading && filteredTasks.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
          <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No tasks found in this view.</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Use the form above to create your first task and persist it to MongoDB.
          </p>
        </div>
      )}

      {!loading && filteredTasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onToggleComplete={onToggleComplete}
          onDeleteClick={onDeleteClick}
        />
      ))}
    </div>
  );
}
