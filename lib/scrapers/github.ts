import { Octokit } from '@octokit/rest';
import { generateSlug } from '../utils';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export interface GitHubProject {
  name: string;
  slug: string;
  description?: string;
  github_url: string;
  github_stars: number;
  github_languages: Record<string, number>;
  github_topics: string[];
  readme_content?: string;
  last_commit_date: string;
  production_stage: 'Production' | 'Staging' | 'Development' | 'Archived';
  current_status: 'Active' | 'Paused' | 'Broken' | 'Needs Update';
  is_private: boolean;
}

export async function scrapeGitHub(org: string = 'IGTA-Tech'): Promise<GitHubProject[]> {
  const projects: GitHubProject[] = [];

  try {
    // Fetch all repos from organization
    const { data: repos } = await octokit.repos.listForOrg({
      org,
      type: 'all',
      per_page: 100,
    });

    for (const repo of repos) {
      try {
        // Get languages
        const { data: languages } = await octokit.repos.listLanguages({
          owner: org,
          repo: repo.name,
        });

        // Get README
        let readmeContent = '';
        try {
          const { data: readme } = await octokit.repos.getReadme({
            owner: org,
            repo: repo.name,
          });
          readmeContent = Buffer.from(readme.content, 'base64').toString('utf-8');
        } catch (e) {
          // No README
        }

        // Get last commit
        const { data: commits } = await octokit.repos.listCommits({
          owner: org,
          repo: repo.name,
          per_page: 1,
        });

        const lastCommitDate = commits[0]?.commit.author?.date || repo.updated_at;
        const daysSinceUpdate = Math.floor(
          (Date.now() - new Date(lastCommitDate).getTime()) / (1000 * 60 * 60 * 24)
        );

        // Determine production stage
        let productionStage: 'Production' | 'Staging' | 'Development' | 'Archived' = 'Development';
        if (repo.archived) {
          productionStage = 'Archived';
        } else if (daysSinceUpdate > 90) {
          productionStage = 'Archived';
        } else if (repo.default_branch === 'main' || repo.default_branch === 'master') {
          productionStage = 'Production';
        }

        // Determine current status
        let currentStatus: 'Active' | 'Paused' | 'Broken' | 'Needs Update' = 'Active';
        if (daysSinceUpdate > 30 && daysSinceUpdate <= 90) {
          currentStatus = 'Paused';
        } else if (daysSinceUpdate > 90) {
          currentStatus = 'Paused';
        }

        projects.push({
          name: repo.name,
          slug: generateSlug(repo.name),
          description: repo.description || undefined,
          github_url: repo.html_url,
          github_stars: repo.stargazers_count || 0,
          github_languages: languages,
          github_topics: repo.topics || [],
          readme_content: readmeContent,
          last_commit_date: lastCommitDate,
          production_stage: productionStage,
          current_status: currentStatus,
          is_private: repo.private,
        });
      } catch (error) {
        console.error(`Error processing repo ${repo.name}:`, error);
      }
    }

    return projects;
  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    throw error;
  }
}
