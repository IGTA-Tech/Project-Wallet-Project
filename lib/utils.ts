/**
 * Generate a URL-friendly slug from a project name
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Determine if two project names refer to the same project
 */
export function isSameProject(name1: string, name2: string): boolean {
  const slug1 = generateSlug(name1);
  const slug2 = generateSlug(name2);

  // Exact match
  if (slug1 === slug2) return true;

  // One contains the other
  if (slug1.includes(slug2) || slug2.includes(slug1)) return true;

  // Similar with common prefixes/suffixes removed
  const clean1 = slug1.replace(/-(app|tool|project|site|website|api|frontend|backend)$/, '');
  const clean2 = slug2.replace(/-(app|tool|project|site|website|api|frontend|backend)$/, '');

  return clean1 === clean2;
}

/**
 * Get the best deployment URL from a project
 */
export function getPrimaryUrl(project: any): string | null {
  return (
    project.custom_domain ||
    project.netlify_url ||
    project.vercel_url ||
    project.streamlit_url ||
    project.tiiny_url ||
    project.github_url ||
    null
  );
}

/**
 * Extract tech stack from package.json or requirements.txt content
 */
export function extractTechStack(content: string, filename: string): string[] {
  const stack: string[] = [];

  if (filename === 'package.json') {
    try {
      const pkg = JSON.parse(content);
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };

      if (deps.next) stack.push('Next.js');
      if (deps.react) stack.push('React');
      if (deps.vue) stack.push('Vue');
      if (deps.express) stack.push('Express');
      if (deps.fastapi) stack.push('FastAPI');
      if (deps.tailwindcss) stack.push('Tailwind CSS');
      if (deps.typescript) stack.push('TypeScript');
    } catch (e) {
      // Invalid JSON
    }
  } else if (filename === 'requirements.txt') {
    if (content.includes('streamlit')) stack.push('Streamlit');
    if (content.includes('fastapi')) stack.push('FastAPI');
    if (content.includes('flask')) stack.push('Flask');
    if (content.includes('django')) stack.push('Django');
    if (content.includes('pandas')) stack.push('Pandas');
  }

  return stack;
}
