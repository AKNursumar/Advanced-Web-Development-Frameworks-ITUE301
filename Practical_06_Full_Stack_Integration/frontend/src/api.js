/**
 * Central API Client for Task Management
 * Course: AWDF (ITUE301) | Practical 6
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/tasks';

export async function fetchTasks() {
  const res = await fetch(BASE_URL);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch tasks (HTTP ${res.status})`);
  }
  const data = await res.json();
  return data.data || [];
}

export async function createTask(taskData) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(taskData)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `Failed to create task (HTTP ${res.status})`);
  }
  return data.data;
}

export async function updateTask(id, updates) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `Failed to update task (HTTP ${res.status})`);
  }
  return data.data;
}

export async function deleteTask(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE'
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `Failed to delete task (HTTP ${res.status})`);
  }
  return data.data;
}
