'use client';

import { useState, useEffect } from 'react';
import { Project, SyncLog } from '@/types/project';
import AdminProjectCard from '@/components/AdminProjectCard';
import EditProjectModal from '@/components/EditProjectModal';
import SyncLogsModal from '@/components/SyncLogsModal';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'public' | 'private'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showSyncLogs, setShowSyncLogs] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string>('');

  // Check if already authenticated (from session storage)
  useEffect(() => {
    const savedPassword = sessionStorage.getItem('admin_password');
    if (savedPassword) {
      setPassword(savedPassword);
      verifyPassword(savedPassword);
    }
  }, []);

  async function verifyPassword(pwd: string) {
    try {
      const response = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: pwd }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        sessionStorage.setItem('admin_password', pwd);
        fetchProjects(pwd);
      } else {
        setAuthError('Invalid password');
        sessionStorage.removeItem('admin_password');
      }
    } catch (error) {
      setAuthError('Authentication failed');
    }
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError('');
    verifyPassword(password);
  }

  function handleLogout() {
    setIsAuthenticated(false);
    setPassword('');
    sessionStorage.removeItem('admin_password');
  }

  async function fetchProjects(adminPassword: string) {
    setLoading(true);
    try {
      const response = await fetch('/api/projects', {
        headers: {
          'x-admin-password': adminPassword,
        },
      });
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleVisibility(projectId: string, isPublic: boolean) {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password,
        },
        body: JSON.stringify({ is_public: !isPublic }),
      });

      if (response.ok) {
        setProjects(projects.map(p =>
          p.id === projectId ? { ...p, is_public: !isPublic } : p
        ));
      }
    } catch (error) {
      console.error('Error toggling visibility:', error);
    }
  }

  async function handleUpdateProject(projectId: string, updates: Partial<Project>) {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password,
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const updated = await response.json();
        setProjects(projects.map(p =>
          p.id === projectId ? { ...p, ...updated.project } : p
        ));
        setEditingProject(null);
      }
    } catch (error) {
      console.error('Error updating project:', error);
    }
  }

  async function handleSyncAll() {
    setSyncing(true);
    setSyncStatus('Syncing all platforms...');

    try {
      const response = await fetch('/api/scrape/all', {
        method: 'POST',
        headers: {
          'x-admin-password': password,
        },
      });

      if (response.ok) {
        const result = await response.json();
        setSyncStatus(`✅ Synced ${result.projectsSynced} projects successfully!`);
        fetchProjects(password);

        setTimeout(() => setSyncStatus(''), 5000);
      } else {
        setSyncStatus('❌ Sync failed. Check console for details.');
      }
    } catch (error) {
      console.error('Sync error:', error);
      setSyncStatus('❌ Sync error occurred');
    } finally {
      setSyncing(false);
    }
  }

  async function handleRegenerateScreenshot(projectId: string) {
    try {
      const response = await fetch(`/api/projects/${projectId}/screenshot`, {
        method: 'POST',
        headers: {
          'x-admin-password': password,
        },
      });

      if (response.ok) {
        const result = await response.json();
        setProjects(projects.map(p =>
          p.id === projectId ? { ...p, screenshot_url: result.screenshot_url } : p
        ));
      }
    } catch (error) {
      console.error('Error regenerating screenshot:', error);
    }
  }

  const filteredProjects = projects.filter(project => {
    // Visibility filter
    if (filter === 'public' && !project.is_public) return false;
    if (filter === 'private' && project.is_public) return false;

    // Status filter
    if (statusFilter !== 'all' && project.current_status !== statusFilter) return false;

    // Stage filter
    if (stageFilter !== 'all' && project.production_stage !== stageFilter) return false;

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        project.name.toLowerCase().includes(search) ||
        project.tagline?.toLowerCase().includes(search) ||
        project.description?.toLowerCase().includes(search)
      );
    }

    return true;
  });

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Access</h1>
            <p className="text-gray-600 mt-2">Enter password to manage your projects</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Enter admin password"
                autoFocus
              />
            </div>

            {authError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {authError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">
                {projects.length} total projects · {projects.filter(p => p.is_public).length} public
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSyncAll}
                disabled={syncing}
                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className={`w-5 h-5 ${syncing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {syncing ? 'Syncing...' : 'Sync All'}
              </button>

              <button
                onClick={() => setShowSyncLogs(true)}
                className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Sync Logs
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>

          {syncStatus && (
            <div className="mt-3 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
              {syncStatus}
            </div>
          )}
        </div>
      </header>

      {/* Filters */}
      <div className="bg-white border-b sticky top-[73px] z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-3">
            {/* Visibility Filter */}
            <div className="flex gap-2">
              {(['all', 'public', 'private'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filter === f
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Paused">Paused</option>
              <option value="Broken">Broken</option>
              <option value="Needs Update">Needs Update</option>
            </select>

            {/* Stage Filter */}
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary bg-white"
            >
              <option value="all">All Stages</option>
              <option value="Production">Production</option>
              <option value="Staging">Staging</option>
              <option value="Development">Development</option>
              <option value="Archived">Archived</option>
            </select>

            <div className="ml-auto text-sm text-gray-600 self-center">
              Showing {filteredProjects.length} of {projects.length} projects
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-gray-600">No projects found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <AdminProjectCard
                key={project.id}
                project={project}
                onToggleVisibility={handleToggleVisibility}
                onEdit={() => setEditingProject(project)}
                onRegenerateScreenshot={handleRegenerateScreenshot}
              />
            ))}
          </div>
        )}
      </main>

      {/* Edit Project Modal */}
      {editingProject && (
        <EditProjectModal
          project={editingProject}
          onClose={() => setEditingProject(null)}
          onSave={handleUpdateProject}
        />
      )}

      {/* Sync Logs Modal */}
      {showSyncLogs && (
        <SyncLogsModal
          adminPassword={password}
          onClose={() => setShowSyncLogs(false)}
        />
      )}
    </div>
  );
}
