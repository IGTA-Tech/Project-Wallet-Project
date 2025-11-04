export type ProductionStage = 'Production' | 'Staging' | 'Development' | 'Archived';
export type CurrentStatus = 'Active' | 'Paused' | 'Broken' | 'Needs Update';

export interface Project {
  id: string;
  name: string;
  slug: string;
  tagline?: string;
  description?: string;

  // URLs
  github_url?: string;
  netlify_url?: string;
  vercel_url?: string;
  streamlit_url?: string;
  tiiny_url?: string;
  custom_domain?: string;
  primary_url?: string;

  // Status
  production_stage?: ProductionStage;
  current_status?: CurrentStatus;
  is_public: boolean;

  // Metadata
  tech_stack?: string[];
  category?: string;
  tags?: string[];

  // GitHub data
  github_stars?: number;
  github_languages?: Record<string, number>;
  github_topics?: string[];
  readme_content?: string;
  last_commit_date?: string;

  // Screenshots
  screenshot_url?: string;
  screenshot_updated_at?: string;

  // AI Generated
  ai_description?: string;
  ai_tags?: string[];

  // Timestamps
  created_at?: string;
  updated_at?: string;
  last_deployed_at?: string;
  last_synced_at?: string;

  notes?: string;
}

export interface DeploymentHistory {
  id: string;
  project_id: string;
  platform: string;
  status: string;
  url: string;
  deployed_at: string;
}

export interface SyncLog {
  id: string;
  sync_type: 'manual' | 'cron';
  status: 'success' | 'error';
  projects_synced: number;
  errors?: Record<string, any>;
  started_at: string;
  completed_at?: string;
}
