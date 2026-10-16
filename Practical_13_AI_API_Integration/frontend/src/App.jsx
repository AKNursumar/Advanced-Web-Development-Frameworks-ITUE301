import React, { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask, getAiStatus } from './api';
import TaskForm from './components/TaskForm';
import TaskItem from './components/TaskItem';
import Toast from './components/Toast';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiStatus, setAiStatus] = useState(null);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ message: '', type: '' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 3000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [tasksData, statusData] = await Promise.all([
        getTasks(),
        getAiStatus().catch(() => null)
      ]);
      setTasks(tasksData.data || tasksData);
      setAiStatus(statusData);
    } catch (err) {
      setError(err.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateTask = async (taskData) => {
    try {
      const res = await createTask(taskData);
      const created = res.data || res;
      setTasks([created, ...tasks]);
      showToast('Task saved to MongoDB!', 'success');
    } catch (err) {
      showToast('Error saving task: ' + err.message, 'error');
    }
  };

  const handleToggleComplete = async (id, completed) => {
    try {
      const res = await updateTask(id, { completed });
      const updated = res.data || res;
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
      showToast('Task deleted successfully', 'success');
    } catch (err) {
      showToast('Failed to delete task', 'error');
    }
  };

  return (
    <div className="container">
      <header>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span className="badge">Practical 13</span>
          {aiStatus && (
            <span className="badge badge-ai">
              Provider: {aiStatus.provider.toUpperCase()} {aiStatus.isKeyConfigured ? '✔ Active' : '⚠ Fallback Mode'}
            </span>
          )}
        </div>
        <h1>AI-Enhanced Task Management</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Student: <strong>Abdulkadir Nursumar</strong> | Semester 5 (ITUE301)
        </p>
      </header>

      <Toast message={toast.message} type={toast.type} />

      <TaskForm onTaskCreated={handleCreateTask} loading={loading} />

      <div style={{ marginTop: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0 }}>Persistent Tasks ({tasks.length})</h2>
          <button className="btn" onClick={loadData} style={{ background: 'var(--bg-input)', color: 'white' }}>
            Refresh
          </button>
        </div>

        {loading && <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading tasks from MongoDB...</p>}
        {error && <p style={{ color: 'var(--danger)', textAlign: 'center' }}>Error: {error}</p>}
        {!loading && tasks.length === 0 && !error && (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
            No tasks in database. Type a title and try AI Auto-Describe above!
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
