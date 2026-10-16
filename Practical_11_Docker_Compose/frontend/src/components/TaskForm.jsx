import React, { useState } from 'react';

export default function TaskForm({ onTaskCreated, loading }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onTaskCreated({
      title: title.trim(),
      description: description.trim(),
      priority
    });

    setTitle('');
    setDescription('');
    setPriority('medium');
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h3 style={{ marginTop: 0 }}>Add New Task</h3>
      <div className="form-group">
        <label htmlFor="task-title">Task Title *</label>
        <input
          id="task-title"
          type="text"
          placeholder="e.g., Set up Docker Compose bridge network"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="task-desc">Description</label>
        <textarea
          id="task-desc"
          rows="2"
          placeholder="Optional task details..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="task-priority">Priority</label>
        <select
          id="task-priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Creating...' : 'Create Task'}
      </button>
    </form>
  );
}
