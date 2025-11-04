import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { scrapeGitHub } from '@/lib/scrapers/github';
import { scrapeNetlify } from '@/lib/scrapers/netlify';
import { scrapeVercel } from '@/lib/scrapers/vercel';
import { generateScreenshot } from '@/lib/screenshot';
import { generateSmartDescription } from '@/lib/ai-description';
import { isSameProject, getPrimaryUrl, generateSlug } from '@/lib/utils';

export async function POST() {
  try {
    const startTime = Date.now();
    let projectsSynced = 0;
    const errors: any[] = [];

    // 1. Scrape all platforms
    console.log('Scraping GitHub...');
    const githubProjects = await scrapeGitHub().catch(e => {
      errors.push({ platform: 'GitHub', error: e.message });
      return [];
    });

    console.log('Scraping Netlify...');
    const netlifyProjects = await scrapeNetlify().catch(e => {
      errors.push({ platform: 'Netlify', error: e.message });
      return [];
    });

    console.log('Scraping Vercel...');
    const vercelProjects = await scrapeVercel().catch(e => {
      errors.push({ platform: 'Vercel', error: e.message });
      return [];
    });

    // 2. Match projects across platforms
    const projectMap = new Map();

    // Add GitHub projects as base
    for (const ghProject of githubProjects) {
      projectMap.set(ghProject.slug, {
        ...ghProject,
        tech_stack: Object.keys(ghProject.github_languages),
      });
    }

    // Match Netlify projects
    for (const netlifyProject of netlifyProjects) {
      const slug = generateSlug(netlifyProject.name);
      let matched = false;

      for (const [existingSlug, project] of projectMap.entries()) {
        if (isSameProject(netlifyProject.name, project.name)) {
          project.netlify_url = netlifyProject.netlify_url;
          project.custom_domain = netlifyProject.custom_domain || project.custom_domain;
          project.last_deployed_at = netlifyProject.last_deployed_at;
          matched = true;
          break;
        }
      }

      if (!matched) {
        projectMap.set(slug, {
          name: netlifyProject.name,
          slug,
          netlify_url: netlifyProject.netlify_url,
          custom_domain: netlifyProject.custom_domain,
          last_deployed_at: netlifyProject.last_deployed_at,
          production_stage: 'Production',
          current_status: netlifyProject.current_status,
          is_public: false,
        });
      }
    }

    // Match Vercel projects
    for (const vercelProject of vercelProjects) {
      const slug = generateSlug(vercelProject.name);
      let matched = false;

      for (const [existingSlug, project] of projectMap.entries()) {
        if (isSameProject(vercelProject.name, project.name)) {
          project.vercel_url = vercelProject.vercel_url;
          project.custom_domain = vercelProject.custom_domain || project.custom_domain;
          project.last_deployed_at = vercelProject.last_deployed_at || project.last_deployed_at;
          matched = true;
          break;
        }
      }

      if (!matched) {
        projectMap.set(slug, {
          name: vercelProject.name,
          slug,
          vercel_url: vercelProject.vercel_url,
          custom_domain: vercelProject.custom_domain,
          last_deployed_at: vercelProject.last_deployed_at,
          production_stage: 'Production',
          current_status: 'Active',
          is_public: false,
        });
      }
    }

    // 3. Upsert projects to Supabase
    for (const [slug, project] of projectMap.entries()) {
      try {
        // Determine primary URL
        project.primary_url = getPrimaryUrl(project);

        // Generate AI description
        if (project.readme_content || project.description) {
          project.ai_description = generateSmartDescription(project);
        }

        // Generate screenshot for projects with deployment URLs
        if (project.primary_url && !project.github_url?.includes(project.primary_url)) {
          project.screenshot_url = generateScreenshot(project.primary_url);
          project.screenshot_updated_at = new Date().toISOString();
        }

        // Update last synced
        project.last_synced_at = new Date().toISOString();

        // Upsert to database
        const { error } = await supabaseAdmin
          .from('projects')
          .upsert(project, {
            onConflict: 'slug',
          });

        if (error) {
          errors.push({ project: project.name, error: error.message });
        } else {
          projectsSynced++;
        }
      } catch (error: any) {
        errors.push({ project: project.name, error: error.message });
      }
    }

    // 4. Log sync
    await supabaseAdmin.from('sync_logs').insert({
      sync_type: 'manual',
      status: errors.length > 0 ? 'error' : 'success',
      projects_synced: projectsSynced,
      errors: errors.length > 0 ? errors : null,
      started_at: new Date(startTime).toISOString(),
      completed_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      projectsSynced,
      errors,
      duration: Date.now() - startTime,
    });
  } catch (error: any) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
