---
Task ID: 1
Agent: Main Agent
Task: Integrate Supabase as backend for Job Application Tracker

Work Log:
- Reviewed existing project structure and data model (api.js, constants.js, useApplications.js, SettingsPage.jsx)
- Installed @supabase/supabase-js package
- Created supabase/schema.sql with full database schema (table, indexes, RLS policy, trigger)
- Created src/lib/supabase.js as Supabase client singleton with isSupabaseConfigured() check
- Rewrote src/services/api.js to use Supabase as primary backend with localStorage fallback
  - Added transformToSupabase/transformFromSupabase for column name mapping (date_applied ↔ dateApplied)
  - Supabase auto-generates UUID ids and timestamps
- Completely rewrote SettingsPage.jsx with:
  - Supabase connection status indicator (green checkmark when connected, yellow when not)
  - Environment variable display (masked anon key)
  - Test Connection button that queries the applications table
  - Step-by-step Setup Guide with SQL schema copy button
  - "Why Supabase?" benefits card with 6 benefits
  - Data management (clear local data, export JSON)
  - Storage mode indicator
- Updated .env with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY placeholders
- Fixed dynamic import warning (changed to static import of getSupabase)
- Built successfully with no warnings

Stage Summary:
- Supabase is fully integrated as backend option
- App works in two modes: localStorage (default) or Supabase cloud (when env vars configured)
- Settings page provides complete setup guide and connection testing
- All files saved in /home/z/my-project/job-tracker/
