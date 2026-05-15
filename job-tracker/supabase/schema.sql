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
  status TEXT NOT NULL DEFAULT 'Applied',
  date_applied DATE,
  location TEXT,
  salary TEXT,
  url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add comments for documentation
COMMENT ON TABLE applications IS 'Stores job application tracking data';
COMMENT ON COLUMN applications.id IS 'Unique identifier for each application';
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

-- 4. Enable Row Level Security (RLS)
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- 5. Create policy - allow all operations for authenticated users
-- (For personal use, you can also allow anonymous access)
CREATE POLICY "Allow full access to applications" ON applications
  FOR ALL
  USING (true)
  WITH CHECK (true);

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
