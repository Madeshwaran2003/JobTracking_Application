import { API_BASE_URL } from '../utils/constants';

const API_URL = API_BASE_URL;

async function apiRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'text/plain',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

export async function fetchApplications() {
  if (!API_URL) {
    return getLocalApplications();
  }
  const url = `${API_URL}?action=read`;
  const data = await apiRequest(url);
  return data.records || [];
}

export async function addApplication(application) {
  if (!API_URL) {
    return addLocalApplication(application);
  }
  const url = `${API_URL}?action=create`;
  const data = await apiRequest(url, {
    method: 'POST',
    body: JSON.stringify(application),
  });
  return data.record;
}

export async function updateApplication(id, application) {
  if (!API_URL) {
    return updateLocalApplication(id, application);
  }
  const url = `${API_URL}?action=update&id=${id}`;
  const data = await apiRequest(url, {
    method: 'PUT',
    body: JSON.stringify(application),
  });
  return data.record;
}

export async function deleteApplication(id) {
  if (!API_URL) {
    return deleteLocalApplication(id);
  }
  const url = `${API_URL}?action=delete&id=${id}`;
  const data = await apiRequest(url, {
    method: 'DELETE',
  });
  return data;
}

// ---- Local Storage Fallback (when no Google Apps Script URL is provided) ----

const STORAGE_KEY = 'job-tracker-applications';

function getLocalApplications() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveLocalApplications(applications) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
}

function addLocalApplication(application) {
  const apps = getLocalApplications();
  const newApp = {
    ...application,
    id: Date.now().toString(36) + Math.random().toString(36).substring(2),
  };
  apps.unshift(newApp);
  saveLocalApplications(apps);
  return newApp;
}

function updateLocalApplication(id, updates) {
  const apps = getLocalApplications();
  const index = apps.findIndex((app) => app.id === id);
  if (index !== -1) {
    apps[index] = { ...apps[index], ...updates };
    saveLocalApplications(apps);
    return apps[index];
  }
  throw new Error('Application not found');
}

function deleteLocalApplication(id) {
  const apps = getLocalApplications();
  const filtered = apps.filter((app) => app.id !== id);
  saveLocalApplications(filtered);
  return { success: true };
}
