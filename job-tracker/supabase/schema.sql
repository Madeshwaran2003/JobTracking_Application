-- =============================================
-- Job Application Tracker - Supabase Schema
-- =============================================
-- Run this SQL in your Supabase SQL Editor
-- =============================================

-- 1. Create the applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'Applied',
  date_applied DATE,
  location TEXT,
  salary TEXT,
  url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE applications
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. Add comments for documentation
COMMENT ON TABLE applications IS 'Stores job application tracking data';
COMMENT ON COLUMN applications.id IS 'Unique identifier for each application';
COMMENT ON COLUMN applications.user_id IS 'Supabase Auth user who owns this application';
COMMENT ON COLUMN applications.company IS 'Company name';
COMMENT ON COLUMN applications.role IS 'Job role/title';
COMMENT ON COLUMN applications.status IS 'Application status: Applied, Assessment, Interview, HR Round, Rejected, Offer Received';
COMMENT ON COLUMN applications.date_applied IS 'Date when the application was submitted';
COMMENT ON COLUMN applications.location IS 'Job location (remote, city, etc.)';
COMMENT ON COLUMN applications.salary IS 'Salary information';
COMMENT ON COLUMN applications.url IS 'URL to the job posting';
COMMENT ON COLUMN applications.notes IS 'Additional notes about the application';

-- 3. Create index for faster searches
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_date ON applications(date_applied DESC);
CREATE INDEX IF NOT EXISTS idx_applications_company ON applications(company);
CREATE INDEX IF NOT EXISTS idx_applications_user ON applications(user_id);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- 5. Create policies - users can only access their own applications
DROP POLICY IF EXISTS "Allow full access to applications" ON applications;
DROP POLICY IF EXISTS "Users can view own applications" ON applications;
DROP POLICY IF EXISTS "Users can insert own applications" ON applications;
DROP POLICY IF EXISTS "Users can update own applications" ON applications;
DROP POLICY IF EXISTS "Users can delete own applications" ON applications;

CREATE POLICY "Users can view own applications" ON applications
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert own applications" ON applications
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update own applications" ON applications
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete own applications" ON applications
  FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- 6. Create a function to auto-update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Create trigger for auto-updating updated_at
DROP TRIGGER IF EXISTS update_applications_updated_at ON applications;
CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- DONE! Your table is ready.
-- =============================================
