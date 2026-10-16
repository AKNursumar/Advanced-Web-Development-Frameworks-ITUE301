import React, { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from './api';
import TaskForm from './components/TaskForm';
import TaskItem from './components/TaskItem';
import Toast from './components/Toast';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ message: '', type: '' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 3000);
  };

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message || 'Failed to connect to backend service');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleCreateTask = async (taskData) => {
    try {
      const created = await createTask(taskData);
      setTasks([created, ...tasks]);
      showToast('Task created and persisted in MongoDB!', 'success');
    } catch (err) {
      showToast('Error creating task: ' + err.message, 'error');
    }
  };

  const handleToggleComplete = async (id, completed) => {
    try {
      const updated = await updateTask(id, { completed });
      setTasks(tasks.map((t) => (t._id === id ? updated : t)));
      showToast(completed ? 'Task completed' : 'Task reopened', 'success');
    } catch (err) {
      showToast('Failed to update task', 'error');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter((t) => t._id !== id));
      showToast('Task deleted from MongoDB', 'success');
    } catch (err) {
      showToast('Failed to delete task', 'error');
    }
  };

  return (
    <div className="container">
      <header>
        <div className="badge">Docker Compose Multi-Container Stack</div>
        <h1>Task Management System</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Student: <strong>Abdulkadir Nursumar</strong> | Semester 5 (ITUE301)
        </p>
      </header>

      <Toast message={toast.message} type={toast.type} />

      <TaskForm onTaskCreated={handleCreateTask} loading={loading} />

      <div style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0 }}>Tasks ({tasks.length})</h2>
          <button className="btn" onClick={loadTasks} style={{ background: 'var(--bg-input)', color: 'white' }}>
            Refresh
          </button>
        </div>

        {loading && <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading tasks from MongoDB...</p>}
        {error && <p style={{ color: 'var(--danger)', textAlign: 'center' }}>Error: {error}</p>}
        {!loading && tasks.length === 0 && !error && (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
            No tasks found in MongoDB. Create your first containerized task above!
          </p>
        )}

        <div className="task-list">
          {tasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
