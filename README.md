# 🎨 Project Wallet - Automated Portfolio Gallery System

A comprehensive project portfolio system that automatically scrapes, organizes, and displays all your deployed projects from GitHub, Netlify, Vercel, and more in a beautiful App Store-style gallery.

## ✨ Features

- 🔄 **Automated Syncing**: Daily cron job automatically updates your project portfolio
- 📸 **Screenshot Generation**: Automatically captures screenshots of live deployments
- 🤖 **Smart Descriptions**: Extracts meaningful descriptions from GitHub READMEs
- 🎨 **App Store Design**: Beautiful, responsive gallery interface
- 👨‍💼 **Admin Dashboard**: Toggle project visibility and manage your portfolio
- 🔍 **Platform Detection**: Automatically matches projects across GitHub, Netlify, and Vercel
- 🏷️ **Tech Stack Recognition**: Automatically detects technologies used in each project
- 📊 **Project Status**: Intelligent status detection (Active, Paused, Broken, etc.)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- GitHub personal access token
- Netlify API token
- Vercel API token
- ScreenshotOne API key (optional)

### 1. Clone and Install

```bash
git clone https://github.com/IGTA-Tech/Project-Wallet-Project.git
cd Project-Wallet-Project
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the SQL schema:
   - Go to SQL Editor in your Supabase dashboard
   - Copy and paste the contents of `supabase-schema.sql`
   - Click "Run"
3. Get your credentials from Settings > API

### 3. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Platform APIs
GITHUB_TOKEN=your_github_personal_access_token
NETLIFY_TOKEN=your_netlify_access_token
VERCEL_TOKEN=your_vercel_access_token

# Screenshot API (optional)
SCREENSHOTONE_API_KEY=your_screenshotone_api_key

# Admin Access
ADMIN_PASSWORD=your_secure_admin_password

# For cron jobs
NEXT_PUBLIC_SITE_URL=https://your-deployment-url.vercel.app
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your gallery.

### 5. Initial Sync

Trigger your first project sync:

```bash
curl -X POST http://localhost:3000/api/scrape/all
```

This will:
- Fetch all GitHub repositories
- Fetch all Netlify sites
- Fetch all Vercel projects
- Match projects across platforms
- Generate screenshots
- Store everything in Supabase

## 📖 Usage

### Public Gallery

Visit `/` to see your public project gallery. Only projects with `is_public = true` will be displayed.

### Admin Dashboard

Visit `/admin` (coming soon) to:
- View all projects (public and private)
- Toggle project visibility
- Manually trigger syncs
- Edit project details
- Regenerate screenshots

### API Endpoints

#### Sync All Projects

```bash
POST /api/scrape/all
```

Scrapes all platforms and syncs to database.

#### Get Projects

```bash
GET /api/projects?public=true&status=Active&stage=Production
```

Query parameters:
- `public`: Filter by visibility (true/false)
- `status`: Filter by status (Active, Paused, Broken, Needs Update)
- `stage`: Filter by stage (Production, Staging, Development, Archived)

#### Update Project

```bash
PATCH /api/projects/[id]
Headers: x-admin-password: your_admin_password
Body: { "is_public": true, "tagline": "New tagline" }
```

## 🔧 Configuration

### API Tokens

#### GitHub
1. Go to Settings > Developer settings > Personal access tokens
2. Generate new token with `repo` scope
3. Copy token to `.env.local`

#### Netlify
1. Go to User settings > Applications > Personal access tokens
2. Create new access token
3. Copy token to `.env.local`

#### Vercel
1. Go to Account Settings > Tokens
2. Create new token
3. Copy token to `.env.local`

#### ScreenshotOne (Optional)
1. Sign up at [screenshotone.com](https://screenshotone.com)
2. Get your API key from dashboard
3. Copy to `.env.local`

### Cron Job

The system includes a Vercel cron job that runs daily at 6 AM UTC. It automatically:
- Syncs all projects
- Updates screenshots (if needed)
- Logs sync results

Configure in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron",
      "schedule": "0 6 * * *"
    }
  ]
}
```

## 🎨 Customization

### Colors

Edit `tailwind.config.ts` to customize colors:

```typescript
colors: {
  primary: '#1a73e8',  // Google Blue
  success: '#34a853',  // Green
  warning: '#fbbc04',  // Yellow
  error: '#ea4335',    // Red
}
```

### Project Card

Customize the project card design in `components/ProjectCard.tsx`.

### Gallery Layout

Modify the grid layout in `app/page.tsx`:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

## 📊 Database Schema

### Projects Table

Main table storing all project information:

- Basic info: `name`, `slug`, `tagline`, `description`
- URLs: `github_url`, `netlify_url`, `vercel_url`, `custom_domain`, `primary_url`
- Status: `production_stage`, `current_status`, `is_public`
- Metadata: `tech_stack`, `category`, `tags`
- GitHub data: `github_stars`, `github_languages`, `readme_content`
- Screenshots: `screenshot_url`, `screenshot_updated_at`
- AI data: `ai_description`, `ai_tags`
- Timestamps: `created_at`, `updated_at`, `last_deployed_at`, `last_synced_at`

### Deployment History Table

Tracks deployment history across platforms.

### Sync Logs Table

Logs all sync operations for debugging and monitoring.

## 🚀 Deployment

### Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

The cron job will automatically be configured from `vercel.json`.

### Post-Deployment

1. Trigger initial sync:
   ```bash
   curl -X POST https://your-app.vercel.app/api/scrape/all
   ```

2. Set projects to public in Supabase:
   ```sql
   UPDATE projects SET is_public = true WHERE name IN ('project1', 'project2');
   ```

3. Visit your gallery at `https://your-app.vercel.app`

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **Backend**: Next.js API Routes (Serverless Functions)
- **Database**: Supabase (PostgreSQL)
- **APIs**: GitHub (Octokit), Netlify, Vercel
- **Screenshots**: ScreenshotOne API
- **Deployment**: Vercel
- **Cron**: Vercel Cron Jobs

## 📝 Project Structure

```
project-wallet/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── scrape/       # Scraping endpoints
│   │   ├── projects/     # CRUD endpoints
│   │   └── cron/         # Cron job endpoint
│   ├── admin/            # Admin dashboard
│   ├── page.tsx          # Public gallery
│   └── layout.tsx        # Root layout
├── components/            # React components
│   ├── ProjectCard.tsx   # App Store-style card
│   ├── StatusBadge.tsx   # Status indicators
│   └── ...
├── lib/                   # Utilities
│   ├── supabase.ts       # Supabase client
│   ├── scrapers/         # Platform scrapers
│   │   ├── github.ts
│   │   ├── netlify.ts
│   │   └── vercel.ts
│   ├── screenshot.ts     # Screenshot generation
│   └── ai-description.ts # Description extraction
├── types/                 # TypeScript types
│   └── project.ts
├── supabase-schema.sql   # Database schema
├── .env.example          # Environment template
└── README.md             # This file
```

## 🤝 Contributing

This is a personal project, but feel free to fork and customize for your own use!

## 📄 License

MIT

## 🙋‍♂️ Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ using Next.js, Supabase, and Claude Code**
