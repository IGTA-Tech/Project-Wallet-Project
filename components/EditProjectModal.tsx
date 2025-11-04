'use client';

import { Project, ProductionStage, CurrentStatus } from '@/types/project';
import { useState, useEffect } from 'react';

interface EditProjectModalProps {
  project: Project;
  onClose: () => void;
  onSave: (projectId: string, updates: Partial<Project>) => void;
}

export default function EditProjectModal({ project, onClose, onSave }: EditProjectModalProps) {
  const [formData, setFormData] = useState({
    name: project.name || '',
    tagline: project.tagline || '',
    description: project.description || '',
    primary_url: project.primary_url || '',
    custom_domain: project.custom_domain || '',
    production_stage: project.production_stage || 'Development',
    current_status: project.current_status || 'Active',
    category: project.category || '',
    is_public: project.is_public,
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    onSave(project.id, formData);
  }

  function handleChange(field: string, value: any) {
    setFormData({ ...formData, [field]: value });
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-blue-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <div>
              <h2 className="text-xl font-bold">Edit Project</h2>
              <p className="text-blue-100 text-sm">{project.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="e.g., Web App, Mobile, API"
                />
              </div>
            </div>

            {/* Tagline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tagline
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Short one-liner about the project"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                placeholder="Detailed description of the project"
              />
            </div>

            {/* URLs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary URL
                </label>
                <input
                  type="url"
                  value={formData.primary_url}
                  onChange={(e) => handleChange('primary_url', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Domain
                </label>
                <input
                  type="text"
                  value={formData.custom_domain}
                  onChange={(e) => handleChange('custom_domain', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="example.com"
                />
              </div>
            </div>

            {/* Status and Stage */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Production Stage
                </label>
                <select
                  value={formData.production_stage}
                  onChange={(e) => handleChange('production_stage', e.target.value as ProductionStage)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white"
                >
                  <option value="Production">Production</option>
                  <option value="Staging">Staging</option>
                  <option value="Development">Development</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Status
                </label>
                <select
                  value={formData.current_status}
                  onChange={(e) => handleChange('current_status', e.target.value as CurrentStatus)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white"
                >
                  <option value="Active">Active</option>
                  <option value="Paused">Paused</option>
                  <option value="Broken">Broken</option>
                  <option value="Needs Update">Needs Update</option>
                </select>
              </div>
            </div>

            {/* Visibility Toggle */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <label className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
                    formData.is_public ? 'bg-green-500' : 'bg-gray-400'
                  }`}>
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      {formData.is_public ? (
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      ) : (
                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                      )}
                    </svg>
                  </div>
                  <div>
                    <span className="block font-medium text-gray-900">
                      {formData.is_public ? 'Public Project' : 'Private Project'}
                    </span>
                    <span className="block text-sm text-gray-600">
                      {formData.is_public ? 'Visible on your portfolio' : 'Hidden from public view'}
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={formData.is_public}
                    onChange={(e) => handleChange('is_public', e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-14 h-8 rounded-full transition-colors ${
                    formData.is_public ? 'bg-green-500' : 'bg-gray-300'
                  }`}>
                    <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform absolute top-1 ${
                      formData.is_public ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                  </div>
                </div>
              </label>
            </div>

            {/* Read-only Info */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Platform URLs (Auto-synced)
              </h4>
              <div className="space-y-1 text-sm">
                {project.github_url && (
                  <p className="text-gray-700">
                    <span className="font-medium">GitHub:</span> {project.github_url}
                  </p>
                )}
                {project.netlify_url && (
                  <p className="text-gray-700">
                    <span className="font-medium">Netlify:</span> {project.netlify_url}
                  </p>
                )}
                {project.vercel_url && (
                  <p className="text-gray-700">
                    <span className="font-medium">Vercel:</span> {project.vercel_url}
                  </p>
                )}
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
