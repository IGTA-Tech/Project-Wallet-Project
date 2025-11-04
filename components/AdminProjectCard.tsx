'use client';

import { Project } from '@/types/project';
import StatusBadge from './StatusBadge';
import Image from 'next/image';
import { useState } from 'react';

interface AdminProjectCardProps {
  project: Project;
  onToggleVisibility: (projectId: string, currentState: boolean) => void;
  onEdit: () => void;
  onRegenerateScreenshot: (projectId: string) => void;
}

export default function AdminProjectCard({
  project,
  onToggleVisibility,
  onEdit,
  onRegenerateScreenshot,
}: AdminProjectCardProps) {
  const [regenerating, setRegenerating] = useState(false);

  async function handleRegenerateScreenshot() {
    setRegenerating(true);
    try {
      await onRegenerateScreenshot(project.id);
    } finally {
      setTimeout(() => setRegenerating(false), 2000);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-primary">
      {/* Screenshot */}
      <div className="relative group">
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

        {/* Screenshot Overlay Actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button
            onClick={handleRegenerateScreenshot}
            disabled={regenerating}
            className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <svg
              className={`w-4 h-4 ${regenerating ? 'animate-spin' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {regenerating ? 'Regenerating...' : 'Regenerate'}
          </button>
        </div>

        {/* Visibility Badge */}
        <div className="absolute top-3 right-3">
          <button
            onClick={() => onToggleVisibility(project.id, project.is_public)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              project.is_public
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gray-500 text-white hover:bg-gray-600'
            }`}
          >
            {project.is_public ? (
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                Public
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                  <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                </svg>
                Private
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1">{project.name}</h3>
            {project.tagline && (
              <p className="text-sm text-gray-600 line-clamp-2">{project.tagline}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <StatusBadge status={project.current_status || 'Active'} />
          {project.production_stage && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
              {project.production_stage}
            </span>
          )}
          {project.github_stars && project.github_stars > 0 && (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {project.github_stars}
            </span>
          )}
        </div>

        {/* Tech Stack */}
        {project.tech_stack && project.tech_stack.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {project.tech_stack.slice(0, 3).map((tech) => (
                <span key={tech} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  {tech}
                </span>
              ))}
              {project.tech_stack.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
                  +{project.tech_stack.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* URLs */}
        <div className="mb-3 space-y-1">
          {project.primary_url && (
            <a
              href={project.primary_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Visit Site
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-600 hover:underline flex items-center gap-1"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              GitHub
            </a>
          )}
        </div>

        {/* Last Synced */}
        {project.last_synced_at && (
          <p className="text-xs text-gray-500 mb-3">
            Synced: {new Date(project.last_synced_at).toLocaleDateString()}
          </p>
        )}

        {/* Action Button */}
        <button
          onClick={onEdit}
          className="w-full bg-gray-900 text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit Project
        </button>
      </div>
    </div>
  );
}
