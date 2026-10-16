import React, { useState, useEffect, useCallback } from 'react';
import AuthModal from './components/AuthModal';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import ConfirmDialog from './components/ConfirmDialog';
import Toast from './components/Toast';
import {
  getStoredToken,
  removeStoredToken,
  fetchCurrentUser,
  fetchTasks,
  createTask,
  updateTask,
  deleteTask
} from './api';

export default function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authChecking, setAuthChecking] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Check existing session on mount
  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setAuthChecking(false);
      setLoading(false);
      return;
    }

    fetchCurrentUser()
      .then((userData) => {
        setUser(userData);
      })
      .catch(() => {
        removeStoredToken();
        setUser(null);
      })
      .finally(() => {
        setAuthChecking(false);
      });
  }, []);

  // Load user's tasks
  const loadTasks = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (err) {
      showToast(err.message, 'error');
      if (err.message.includes('401') || err.message.includes('expired')) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user, loadTasks]);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    showToast(`Welcome back, ${userData.name}!`, 'success');
  };

  const handleLogout = () => {
    removeStoredToken();
    setUser(null);
    setTasks([]);
    showToast('You have been logged out.', 'success');
  };

  const handleCreateTask = async (taskData) => {
    setIsSubmitting(true);
    try {
      const created = await createTask(taskData);
      setTasks((prev) => [created, ...prev]);
      showToast(`Protected task "${created.title}" saved.`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleComplete = async (task) => {
    const originalState = [...tasks];
    const newCompleted = !task.completed;

    setTasks((prev) =>
      prev.map((t) => (t._id === task._id ? { ...t, completed: newCompleted } : t))
    );

    try {
      const updated = await updateTask(task._id, { completed: newCompleted });
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? updated : t))
      );
      showToast(
        newCompleted ? `Completed "${task.title}"!` : `Reopened "${task.title}"!`,
        'success'
      );
    } catch (err) {
      setTasks(originalState);
      showToast(`Update failed: ${err.message}`, 'error');
    }
  };

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

  if (authChecking) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: '6rem' }}>
        <div className="spinner" role="status" aria-label="Verifying JWT session"></div>
        <p style={{ color: 'var(--text-secondary)' }}>Verifying authentication session...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

      <ConfirmDialog
        isOpen={Boolean(taskToDelete)}
        task={taskToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => setTaskToDelete(null)}
        isDeleting={isDeleting}
      />

      <header className="app-header">
        <div className="app-title-group">
          <h1>
            <span>🔐</span> Secure Task Manager
            <span className="app-title-badge">Practical 7</span>
          </h1>
          <p className="app-meta">
            JWT Authentication Pipeline | Student: <strong>Abdulkadir Nursumar</strong>
          </p>
        </div>

        {user && (
          <div className="user-profile-badge">
            <div className="user-info">
              <div className="user-name">{user.name}</div>
              <div className="user-email">{user.email}</div>
            </div>
            <button onClick={handleLogout} className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}>
              Logout ⎋
            </button>
          </div>
        )}
      </header>

      <main>
        {!user ? (
          <AuthModal onAuthSuccess={handleAuthSuccess} />
        ) : (
          <>
            <TaskForm onTaskCreated={handleCreateTask} isSubmitting={isSubmitting} />
            <TaskList
              tasks={tasks}
              loading={loading}
              onToggleComplete={handleToggleComplete}
              onDeleteClick={handleDeleteClick}
            />
          </>
        )}
      </main>
    </div>
  );
}
