-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT,
  description TEXT,

  -- URLs
  github_url TEXT,
  netlify_url TEXT,
  vercel_url TEXT,
  streamlit_url TEXT,
  tiiny_url TEXT,
  custom_domain TEXT,
  primary_url TEXT,

  -- Status
  production_stage TEXT CHECK (production_stage IN ('Production', 'Staging', 'Development', 'Archived')),
  current_status TEXT CHECK (current_status IN ('Active', 'Paused', 'Broken', 'Needs Update')),
  is_public BOOLEAN DEFAULT false,

  -- Metadata
  tech_stack TEXT[],
  category TEXT,
  tags TEXT[],

  -- GitHub data
  github_stars INTEGER DEFAULT 0,
  github_languages JSONB DEFAULT '{}',
  github_topics TEXT[],
  readme_content TEXT,
  last_commit_date TIMESTAMP,

  -- Screenshots
  screenshot_url TEXT,
  screenshot_updated_at TIMESTAMP,

  -- AI Generated
  ai_description TEXT,
  ai_tags TEXT[],

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_deployed_at TIMESTAMP,
  last_synced_at TIMESTAMP,

  notes TEXT
);

-- Deployment history
CREATE TABLE deployment_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  platform TEXT,
  status TEXT,
  url TEXT,
  deployed_at TIMESTAMP DEFAULT NOW()
);

-- Sync logs
CREATE TABLE sync_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sync_type TEXT, -- 'manual' or 'cron'
  status TEXT, -- 'success' or 'error'
  projects_synced INTEGER DEFAULT 0,
  errors JSONB,
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_projects_is_public ON projects(is_public);
CREATE INDEX idx_projects_stage ON projects(production_stage);
CREATE INDEX idx_projects_status ON projects(current_status);
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_deployment_history_project ON deployment_history(project_id);

-- Update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
