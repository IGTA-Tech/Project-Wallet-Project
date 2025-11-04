export interface VercelProject {
  name: string;
  vercel_url: string;
  custom_domain?: string;
  last_deployed_at?: string;
}

export async function scrapeVercel(): Promise<VercelProject[]> {
  const projects: VercelProject[] = [];

  try {
    const response = await fetch('https://api.vercel.com/v9/projects', {
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
      },
    });

    const data = await response.json();

    for (const project of data.projects || []) {
      const productionDomain = project.targets?.production?.alias?.[0] ||
                              `${project.name}.vercel.app`;

      projects.push({
        name: project.name,
        vercel_url: `https://${productionDomain}`,
        custom_domain: project.alias?.[0] ? `https://${project.alias[0]}` : undefined,
        last_deployed_at: project.updatedAt,
      });
    }

    return projects;
  } catch (error) {
    console.error('Error fetching Vercel projects:', error);
    throw error;
  }
}
