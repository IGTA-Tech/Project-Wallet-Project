/**
 * Extract description from README content
 */
export function extractDescriptionFromReadme(readme: string): string {
  // Remove badges
  let content = readme.replace(/!\[.*?\]\(.*?\)/g, '');

  // Remove HTML comments
  content = content.replace(/<!--[\s\S]*?-->/g, '');

  // Split into sections
  const lines = content.split('\n').filter(line => line.trim());

  // Find description (usually after title, before installation)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip headers
    if (line.startsWith('#')) continue;

    // Skip if it's installation or setup related
    if (line.toLowerCase().includes('install') ||
        line.toLowerCase().includes('setup') ||
        line.toLowerCase().includes('getting started')) {
      break;
    }

    // If we found a meaningful paragraph
    if (line.length > 50) {
      return line.trim();
    }
  }

  // Fallback: first non-empty paragraph
  const firstParagraph = lines.find(line => !line.startsWith('#') && line.length > 20);
  return firstParagraph || '';
}

/**
 * Generate smart description for a project
 */
export function generateSmartDescription(project: any): string {
  // 1. Try README
  if (project.readme_content) {
    const desc = extractDescriptionFromReadme(project.readme_content);
    if (desc) return desc;
  }

  // 2. Use GitHub description
  if (project.description) {
    return project.description;
  }

  // 3. Generate from tech stack
  if (project.tech_stack && project.tech_stack.length > 0) {
    return `A ${project.tech_stack.join(', ')} project`;
  }

  return `${project.name} project`;
}
