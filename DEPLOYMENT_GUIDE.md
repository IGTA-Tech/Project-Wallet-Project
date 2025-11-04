# 🚀 Project Wallet - Developer Deployment Guide

## 📋 Overview

This is an automated portfolio gallery system that scrapes and displays projects from GitHub, Netlify, and Vercel. Your task is to deploy this to production.

**Repository**: https://github.com/IGTA-Tech/Project-Wallet-Project

**Tech Stack**: Next.js 14, TypeScript, Supabase, Vercel

**Estimated Time**: 30-45 minutes

---

## ✅ Pre-Deployment Checklist

Make sure you have access to:
- [ ] GitHub repository (IGTA-Tech/Project-Wallet-Project)
- [ ] Supabase account credentials (or ability to create one)
- [ ] Vercel account credentials (or ability to create one)
- [ ] ScreenshotOne API key (optional - for screenshots)

---

## 📦 Step 1: Clone Repository

```bash
git clone https://github.com/IGTA-Tech/Project-Wallet-Project.git
cd Project-Wallet-Project
npm install
```

---

## 🗄️ Step 2: Set Up Supabase Database

### 2.1 Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create account
3. Click "New Project"
4. Fill in:
   - **Project Name**: `project-wallet` (or your choice)
   - **Database Password**: Generate strong password (save this!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is fine for testing
5. Wait 2-3 minutes for project to initialize

### 2.2 Run Database Schema

1. In Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Open `supabase-schema.sql` from the repository
4. Copy ALL contents and paste into SQL Editor
5. Click **"Run"** or press `Ctrl/Cmd + Enter`
6. Verify success message: "Success. No rows returned"

### 2.3 Get API Credentials

1. Go to **Settings** (gear icon) > **API**
2. Copy these three values:

```
Project URL: https://xxxxxxxxxxxxx.supabase.co
anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3...
service_role secret key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3...
```

**⚠️ IMPORTANT**: Keep `service_role` key SECRET - never commit to Git!

---

## 🔑 Step 3: Configure Environment Variables

### 3.1 Local Development

Create `.env.local` in project root:

```bash
# Supabase (from Step 2.3)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Platform APIs (CLIENT WILL PROVIDE ACTUAL TOKENS)
GITHUB_TOKEN=ask_client_for_github_token
NETLIFY_TOKEN=ask_client_for_netlify_token
VERCEL_TOKEN=ask_client_for_vercel_token

# Screenshot API (Optional - can add later)
SCREENSHOTONE_API_KEY=leave_empty_for_now

# Admin Access
ADMIN_PASSWORD=ChangeThisToSecurePassword123!

# Site URL (update after deployment)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**⚠️ SECURITY NOTE**:
- `.env.local` is already in `.gitignore` - DO NOT commit this file
- The API tokens shown above are the client's actual credentials
- Change `ADMIN_PASSWORD` to something secure

### 3.2 For Vercel (Later in Step 5)

You'll need to add ALL these environment variables in Vercel dashboard.

---

## 🧪 Step 4: Test Locally

### 4.1 Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

You should see:
- ✅ Page loads (even if empty - no projects yet)
- ✅ No console errors related to Supabase connection

### 4.2 Trigger Initial Data Sync

In a new terminal:

```bash
curl -X POST http://localhost:3000/api/scrape/all
```

**Expected Response** (takes 30-60 seconds):
```json
{
  "success": true,
  "projectsSynced": 30,
  "errors": [],
  "duration": 45000
}
```

**If you see errors**:
- Check API tokens are correct in `.env.local`
- Check Supabase connection (URL and keys)
- GitHub rate limits? Wait 1 hour or use different token

### 4.3 Verify Database

1. Go to Supabase dashboard
2. Click **Table Editor** > **projects**
3. You should see ~30 projects loaded
4. Check fields are populated: `name`, `github_url`, `tech_stack`, etc.

### 4.4 Make Projects Public

By default, all projects are `is_public = false`. To display them:

**Option A: Make all public**
```sql
UPDATE projects SET is_public = true;
```

**Option B: Make specific projects public**
```sql
UPDATE projects
SET is_public = true
WHERE name IN (
  'website-scraper',
  'innovative-automations-ppm-builder',
  'lido-proposal'
  -- add more project names
);
```

Run this in Supabase **SQL Editor**.

### 4.5 Verify Frontend

1. Refresh [http://localhost:3000](http://localhost:3000)
2. You should see project cards displayed
3. Click on a card - should open the project URL
4. Test filters (All, Production, Staging, Development)

**If projects don't show**:
- Check browser console for errors
- Verify `is_public = true` in database
- Check `/api/projects?public=true` returns data

---

## 🚀 Step 5: Deploy to Vercel

### 5.1 Connect Repository

1. Go to [https://vercel.com](https://vercel.com)
2. Click **"Add New"** > **"Project"**
3. Import `IGTA-Tech/Project-Wallet-Project` from GitHub
4. Framework Preset: **Next.js** (auto-detected)
5. Root Directory: `./` (leave as is)
6. **DO NOT DEPLOY YET** - configure environment variables first

### 5.2 Add Environment Variables

Click **"Environment Variables"** and add ALL of these:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key | Production, Preview, Development |
| `GITHUB_TOKEN` | (Client will provide) | Production, Preview, Development |
| `NETLIFY_TOKEN` | (Client will provide) | Production, Preview, Development |
| `VERCEL_TOKEN` | (Client will provide) | Production, Preview, Development |
| `ADMIN_PASSWORD` | (Your secure password) | Production, Preview, Development |
| `SCREENSHOTONE_API_KEY` | (Optional - leave empty) | Production, Preview, Development |

**⚠️ IMPORTANT**:
- Select all three environments (Production, Preview, Development) for each variable
- Double-check no typos in keys
- Click "Add" after each variable

### 5.3 Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. You'll get a URL like: `https://project-wallet-project.vercel.app`
4. Click "Visit" to test

### 5.4 Update Site URL

After deployment, update one more environment variable:

1. Go to Vercel project > **Settings** > **Environment Variables**
2. Find `NEXT_PUBLIC_SITE_URL`
3. Update to: `https://your-actual-deployment-url.vercel.app`
4. Click **Save**
5. Go to **Deployments** > Click ⋯ menu on latest > **Redeploy**

This is needed for the cron job to work correctly.

### 5.5 Trigger Production Sync

```bash
curl -X POST https://your-deployment-url.vercel.app/api/scrape/all
```

Verify projects appear on live site.

---

## ⏰ Step 6: Verify Cron Job

The app is configured to auto-sync daily at 6 AM UTC.

### 6.1 Check Cron Configuration

1. Go to Vercel project > **Settings** > **Cron Jobs**
2. You should see:
   - **Path**: `/api/cron`
   - **Schedule**: `0 6 * * *` (daily at 6 AM UTC)
   - **Status**: Active

If not visible, check `vercel.json` in repository contains:
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

### 6.2 Test Cron Manually

```bash
curl https://your-deployment-url.vercel.app/api/cron
```

Should return sync results.

### 6.3 Monitor Sync Logs

Check Supabase **Table Editor** > **sync_logs** table to see sync history.

---

## 🎨 Step 7: Optional - Screenshot API

Screenshots enhance the gallery but are optional. The app works without them.

### 7.1 Get ScreenshotOne API Key

1. Go to [https://screenshotone.com](https://screenshotone.com)
2. Sign up for free tier (100 screenshots/month)
3. Get API key from dashboard
4. Add to Vercel environment variables:
   - `SCREENSHOTONE_API_KEY=your_key_here`
5. Redeploy

### 7.2 Generate Screenshots

After adding key, trigger sync again:
```bash
curl -X POST https://your-deployment-url.vercel.app/api/scrape/all
```

Screenshots will be generated for all projects with live URLs.

---

## ✅ Step 8: Post-Deployment Verification

### 8.1 Checklist

- [ ] Homepage loads at production URL
- [ ] Projects are displayed (public ones)
- [ ] Clicking project cards opens live URLs
- [ ] Filters work (All, Production, Staging, etc.)
- [ ] API endpoint works: `/api/projects?public=true`
- [ ] Sync endpoint works: `/api/scrape/all`
- [ ] Cron job is configured in Vercel
- [ ] Database has 30+ projects
- [ ] No console errors in browser

### 8.2 Test Different Scenarios

1. **Desktop view** - 3 column grid
2. **Tablet view** - 2 column grid
3. **Mobile view** - 1 column grid
4. **Project with screenshot** - displays properly
5. **Project without screenshot** - shows letter icon
6. **Filter by stage** - filters work correctly

---

## 🐛 Troubleshooting

### Issue: "No projects found"

**Solutions**:
1. Check database: `SELECT COUNT(*) FROM projects WHERE is_public = true;`
2. If count is 0, run: `UPDATE projects SET is_public = true;`
3. Verify API works: `curl https://your-url/api/projects?public=true`

### Issue: Sync fails with errors

**Solutions**:
1. Check API tokens in environment variables
2. Verify GitHub token has `repo` scope
3. Check rate limits: `curl -H "Authorization: token YOUR_GITHUB_TOKEN" https://api.github.com/rate_limit`
4. Check Vercel logs: Dashboard > Deployments > View Function Logs

### Issue: Cron job not running

**Solutions**:
1. Verify `NEXT_PUBLIC_SITE_URL` is set correctly
2. Check `vercel.json` exists in repository root
3. Check Vercel Settings > Cron Jobs shows the job
4. Pro plan required? Free tier may have limitations

### Issue: Screenshots not generating

**Solutions**:
1. Verify `SCREENSHOTONE_API_KEY` is set
2. Check ScreenshotOne dashboard for quota/errors
3. Screenshots are optional - app works without them

### Issue: Build fails on Vercel

**Solutions**:
1. Check all environment variables are set
2. Verify no TypeScript errors: `npm run build` locally
3. Check Vercel build logs for specific error
4. Try deleting `node_modules` and reinstalling: `rm -rf node_modules && npm install`

---

## 📊 Monitoring & Maintenance

### Daily Checks (First Week)

1. Check sync logs: Supabase > **sync_logs** table
2. Verify cron job runs daily (6 AM UTC)
3. Monitor Vercel function logs for errors

### Weekly Checks

1. Review project count: Should match active repos
2. Check for broken deployment URLs
3. Update any projects that need `is_public` toggled

### Monthly Maintenance

1. Review Supabase usage (should be well within free tier)
2. Review Vercel usage
3. Update dependencies: `npm update`

---

## 🔐 Security Notes

**DO NOT**:
- ❌ Commit `.env.local` to Git (already in `.gitignore`)
- ❌ Share `service_role` key publicly
- ❌ Use weak `ADMIN_PASSWORD`
- ❌ Expose API tokens in client-side code

**DO**:
- ✅ Keep environment variables in Vercel dashboard only
- ✅ Rotate tokens if compromised
- ✅ Use strong admin password
- ✅ Monitor Vercel function logs for suspicious activity

---

## 📞 Support Information

**Repository**: https://github.com/IGTA-Tech/Project-Wallet-Project

**If you encounter issues**:
1. Check this deployment guide first
2. Review README.md in repository
3. Check Vercel deployment logs
4. Check Supabase logs
5. Review browser console errors

**Key Files**:
- `README.md` - Full application documentation
- `supabase-schema.sql` - Database schema
- `.env.example` - Environment variable template
- `DEPLOYMENT_GUIDE.md` - This file

---

## ✅ Deployment Complete!

Once all steps are verified:

1. ✅ Send production URL to client
2. ✅ Confirm cron job is running
3. ✅ Document any custom configurations
4. ✅ Provide client with:
   - Production URL
   - Supabase dashboard access
   - Vercel dashboard access
   - Admin password

**Expected Result**:
A live portfolio gallery displaying 30+ projects, automatically syncing daily, with beautiful App Store-style design.

---

**Last Updated**: November 4, 2025
**Version**: 1.0.0
**Estimated Deployment Time**: 30-45 minutes
