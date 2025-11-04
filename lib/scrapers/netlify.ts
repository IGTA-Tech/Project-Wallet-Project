export interface NetlifyProject {
  name: string;
  netlify_url: string;
  custom_domain?: string;
  last_deployed_at: string;
  current_status: 'Active' | 'Paused' | 'Broken';
}

export async function scrapeNetlify(): Promise<NetlifyProject[]> {
  const projects: NetlifyProject[] = [];

  try {
    const response = await fetch('https://api.netlify.com/api/v1/sites', {
      headers: {
        Authorization: `Bearer ${process.env.NETLIFY_TOKEN}`,
      },
    });

    const sites = await response.json();

    for (const site of sites) {
      projects.push({
        name: site.name,
        netlify_url: site.ssl_url || site.url,
        custom_domain: site.custom_domain || undefined,
        last_deployed_at: site.published_deploy?.published_at || site.updated_at,
        current_status: site.published_deploy?.state === 'ready' ? 'Active' : 'Broken',
      });
    }

    return projects;
  } catch (error) {
    console.error('Error fetching Netlify sites:', error);
    throw error;
  }
}
