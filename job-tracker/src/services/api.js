import { getSupabase, isSupabaseConfigured } from '../lib/supabase';

// ============================================
// Supabase API (primary) + localStorage fallback
// ============================================

// ---- Supabase Operations ----

async function supabaseFetchApplications() {
  const supabase = getSupabase();
  if (!supabase) return null;

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error(userError?.message || 'Please sign in to fetch applications.');
  }

  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[Supabase] Fetch error:', error.message);
    throw new Error(error.message);
  }

  return (data || []).map(transformFromSupabase);
}

async function supabaseAddApplication(application) {
  const supabase = getSupabase();
  if (!supabase) return null;

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error(userError?.message || 'Please sign in before adding applications.');
  }

  const row = transformToSupabase(application);
  row.user_id = user.id;
  console.log('[Supabase] Adding application:', row);

  const { data, error } = await supabase
    .from('applications')
    .insert([row])
    .select()
    .single();

  if (error) {
    console.error('[Supabase] Insert error:', error.message, error.details);
    throw new Error(error.message);
  }

  return transformFromSupabase(data);
}

async function supabaseUpdateApplication(id, updates) {
  const supabase = getSupabase();
  if (!supabase) return null;

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error(userError?.message || 'Please sign in to update applications.');
  }

  const row = transformToSupabase(updates);
  console.log('[Supabase] Updating application:', id, row);

  const { data, error } = await supabase
    .from('applications')
    .update(row)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    console.error('[Supabase] Update error:', error.message);
    throw new Error(error.message);
  }

  return transformFromSupabase(data);
}

async function supabaseDeleteApplication(id) {
  const supabase = getSupabase();
  if (!supabase) return null;

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error(userError?.message || 'Please sign in to delete applications.');
  }

  const { error } = await supabase
    .from('applications')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('[Supabase] Delete error:', error.message);
    throw new Error(error.message);
  }

  return { success: true };
}

// ---- Data Transformers ----
// Supabase uses: id (uuid), date_applied, created_at, updated_at
// App expects:   id, dateApplied, createdAt, updatedAt

function transformFromSupabase(row) {
  return {
    id: row.id,
    company: row.company,
    role: row.role,
    status: row.status,
    dateApplied: row.date_applied,
    location: row.location || '',
    salary: row.salary || '',
    jobLink: row.url || '',
    notes: row.notes || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function transformToSupabase(app) {
  const row = {};
  if (app.company !== undefined) row.company = app.company;
  if (app.role !== undefined) row.role = app.role;
  if (app.status !== undefined) row.status = app.status;
  if (app.dateApplied !== undefined) row.date_applied = app.dateApplied || null;
  if (app.location !== undefined) row.location = app.location || '';
  if (app.salary !== undefined) row.salary = app.salary || '';
  if (app.jobLink !== undefined) row.url = app.jobLink || '';
  if (app.url !== undefined) row.url = app.url || '';
  if (app.notes !== undefined) row.notes = app.notes || '';
  return row;
}

// ---- Public API ----

export async function fetchApplications() {
  if (isSupabaseConfigured()) {
    return supabaseFetchApplications();
  }
  console.log('[API] Supabase not configured, using localStorage');
  return getLocalApplications();
}

export async function addApplication(application) {
  if (isSupabaseConfigured()) {
    return supabaseAddApplication(application);
  }
  console.log('[API] Supabase not configured, using localStorage');
  return addLocalApplication(application);
}

export async function updateApplication(id, application) {
  if (isSupabaseConfigured()) {
    return supabaseUpdateApplication(id, application);
  }
  return updateLocalApplication(id, application);
}

export async function deleteApplication(id) {
  if (isSupabaseConfigured()) {
    return supabaseDeleteApplication(id);
  }
  return deleteLocalApplication(id);
}

export function getConnectionMode() {
  if (isSupabaseConfigured()) return 'supabase';
  return 'local';
}

// ---- Local Storage Fallback ----

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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  apps.unshift(newApp);
  saveLocalApplications(apps);
  return newApp;
}

function updateLocalApplication(id, updates) {
  const apps = getLocalApplications();
  const index = apps.findIndex((app) => app.id === id);
  if (index !== -1) {
    apps[index] = { ...apps[index], ...updates, updatedAt: new Date().toISOString() };
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
