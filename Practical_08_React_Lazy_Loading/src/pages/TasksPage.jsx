import React, { useState } from 'react';

/**
 * Lazy Loaded Route Component (TasksPage)
 * Must use default export for React.lazy() compatibility.
 */
export default function TasksPage() {
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Implement React.lazy() in App.jsx', completed: true, priority: 'high' },
    { id: '2', title: 'Verify Rollup chunk splitting in dist/', completed: true, priority: 'high' },
    { id: '3', title: 'Measure network transfer on Slow 3G throttling', completed: false, priority: 'medium' },
    { id: '4', title: 'Record Profiler renders in React DevTools', completed: false, priority: 'low' }
  ]);

  const [newTitle, setNewTitle] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setTasks((prev) => [
      ...prev,
      { id: String(Date.now()), title: newTitle.trim(), completed: false, priority: 'medium' }
    ]);
    setNewTitle('');
  };

  const toggle = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  return (
    <div className="container">
      <div className="card">
        <p className="section-tag">Code-Split Route Chunk</p>
        <h1 className="section-title">Dynamic Tasks Management View</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          This route chunk (<code>TasksPage.chunk.js</code>) was downloaded only when you clicked "Tasks (Lazy)"!
        </p>

        <form onSubmit={handleAdd} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Add a new task..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            style={{
              padding: '0.65rem 1rem',
              borderRadius: '8px',
              background: '#1f2937',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff',
              flex: 1
            }}
          />
          <button type="submit" className="btn btn-primary">
            Add
          </button>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {tasks.map((task) => (
            <div
              key={task.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                background: '#111827',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.06)'
              }}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggle(task.id)}
                style={{ width: '18px', height: '18px', accentColor: '#10b981', cursor: 'pointer' }}
              />
              <span
                style={{
                  flex: 1,
                  textDecoration: task.completed ? 'line-through' : 'none',
                  color: task.completed ? '#6b7280' : '#f9fafb'
                }}
              >
                {task.title}
              </span>
              <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '999px', background: 'rgba(99,102,241,0.2)', color: '#38bdf8', fontFamily: 'monospace' }}>
                {task.priority}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
