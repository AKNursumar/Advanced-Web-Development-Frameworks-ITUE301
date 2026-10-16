/**
 * Central API Client with JWT Bearer Token Injection
 * Course: AWDF (ITUE301) | Practical 7
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export function getStoredToken() {
  return localStorage.getItem('awdf_jwt_token');
}

export function setStoredToken(token) {
  if (token) {
    localStorage.setItem('awdf_jwt_token', token);
  } else {
    localStorage.removeItem('awdf_jwt_token');
  }
}

export function removeStoredToken() {
  localStorage.removeItem('awdf_jwt_token');
}

function getAuthHeaders() {
  const token = getStoredToken();
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401) {
      // Clear token upon 401 Unauthorized
      removeStoredToken();
    }
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }
  return data;
}

// Auth API Calls
export async function registerUser({ name, email, password }) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  return handleResponse(res);
}

export async function loginUser({ email, password }) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return handleResponse(res);
}

export async function fetchCurrentUser() {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  const data = await handleResponse(res);
  return data.user;
}

// Task API Calls (Protected)
export async function fetchTasks() {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  const data = await handleResponse(res);
  return data.data || [];
}

export async function createTask(taskData) {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(taskData)
  });
  const data = await handleResponse(res);
  return data.data;
}

export async function updateTask(id, updates) {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updates)
  });
  const data = await handleResponse(res);
  return data.data;
}

export async function deleteTask(id) {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  const data = await handleResponse(res);
  return data.data;
}
