import React, { useState, useEffect, useCallback } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import ConfirmDialog from './components/ConfirmDialog';
import Toast from './components/Toast';
import { fetchTasks, createTask, updateTask, deleteTask } from './api';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Modal state
  const [taskToDelete, setTaskToDelete] = useState(null);
  
  // Toast state
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Create Task
  const handleCreateTask = async (taskData) => {
    setIsSubmitting(true);
    try {
      const created = await createTask(taskData);
      setTasks((prev) => [created, ...prev]);
      showToast(`Task "${created.title}" created successfully!`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Complete (with rollback on error)
  const handleToggleComplete = async (task) => {
    const originalState = [...tasks];
    const newCompleted = !task.completed;

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t._id === task._id ? { ...t, completed: newCompleted } : t))
    );

    try {
      const updated = await updateTask(task._id, { completed: newCompleted });
      // Sync confirmed state from server
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? updated : t))
      );
      showToast(
        newCompleted ? `Marked "${task.title}" as completed!` : `Marked "${task.title}" as active!`,
        'success'
      );
    } catch (err) {
      // Rollback on server failure
      setTasks(originalState);
      showToast(`Update failed: ${err.message}. Rolled back.`, 'error');
    }
  };

  // Delete Task Handlers
  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    setIsDeleting(true);

    try {
      await deleteTask(taskToDelete._id);
      setTasks((prev) => prev.filter((t) => t._id !== taskToDelete._id));
      showToast(`Task "${taskToDelete.title}" deleted from database.`, 'success');
      setTaskToDelete(null);
    } catch (err) {
      showToast(`Delete failed: ${err.message}`, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  return (
    <div className="container">
      {/* Toast Notification Container */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

      {/* Delete Confirmation Modal Dialog */}
      <ConfirmDialog
        isOpen={Boolean(taskToDelete)}
        task={taskToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => setTaskToDelete(null)}
        isDeleting={isDeleting}
      />

      {/* Header */}
      <header className="app-header">
        <div className="app-title-group">
          <h1>
            <span>📋</span> Full-Stack Task Manager
            <span className="app-title-badge">Practical 6</span>
          </h1>
          <p className="app-meta">
            React (Vite) ↔ Express REST API ↔ MongoDB (Mongoose) | Student: <strong>Abdulkadir Nursumar</strong>
          </p>
        </div>

        <div className="stats-bar">
          <div className="stat-box">
            <div className="stat-number">{tasks.length}</div>
            <div className="stat-label">Total</div>
          </div>
          <div className="stat-box">
            <div className="stat-number" style={{ color: 'var(--accent-amber)' }}>{pendingCount}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-box">
            <div className="stat-number" style={{ color: 'var(--accent-emerald)' }}>{completedCount}</div>
            <div className="stat-label">Done</div>
          </div>
        </div>
      </header>

      <main>
        <TaskForm
          onTaskCreated={handleCreateTask}
          isSubmitting={isSubmitting}
        />

        <TaskList
          tasks={tasks}
          loading={loading}
          onToggleComplete={handleToggleComplete}
          onDeleteClick={handleDeleteClick}
        />
      </main>
    </div>
  );
}
