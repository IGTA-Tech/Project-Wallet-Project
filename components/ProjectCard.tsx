'use client';

import { Project } from '@/types/project';
import StatusBadge from './StatusBadge';
import Image from 'next/image';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
    >
      {/* Screenshot */}
      {project.screenshot_url ? (
        <div className="relative w-full h-48 bg-gray-200">
          <Image
            src={project.screenshot_url}
            alt={project.name}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <span className="text-6xl font-bold text-white">
            {project.name[0].toUpperCase()}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-1">{project.name}</h3>

        {project.tagline && (
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{project.tagline}</p>
        )}

        <div className="flex items-center gap-2 mb-3">
          <StatusBadge status={project.current_status || 'Active'} />
          {project.github_stars && project.github_stars > 0 && (
            <span className="text-xs text-gray-500">⭐ {project.github_stars}</span>
          )}
        </div>

        {/* Tech Stack */}
        {project.tech_stack && project.tech_stack.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {project.tech_stack.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
              >
                {tech}
              </span>
            ))}
            {project.tech_stack.length > 3 && (
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                +{project.tech_stack.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Platform Indicators */}
        <div className="flex gap-2 text-xs text-gray-500">
          {project.github_url && <span>🐙 GitHub</span>}
          {project.netlify_url && <span>🌐 Netlify</span>}
          {project.vercel_url && <span>▲ Vercel</span>}
          {project.custom_domain && <span>🔗 Custom</span>}
        </div>

        {/* CTA */}
        <button className="mt-4 w-full bg-primary text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
          View Project
        </button>
      </div>
    </div>
  );
}
