'use client';

import { SyncLog } from '@/types/project';
import { useState, useEffect } from 'react';

interface SyncLogsModalProps {
  adminPassword: string;
  onClose: () => void;
}

export default function SyncLogsModal({ adminPassword, onClose }: SyncLogsModalProps) {
  const [logs, setLogs] = useState<SyncLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    fetchLogs();

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  async function fetchLogs() {
    setLoading(true);
    try {
      const response = await fetch('/api/sync-logs', {
        headers: {
          'x-admin-password': adminPassword,
        },
      });
      const data = await response.json();
      setLogs(data.logs || []);
    } catch (error) {
      console.error('Error fetching sync logs:', error);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function getDuration(startedAt: string, completedAt?: string) {
    if (!completedAt) return 'In progress...';
    const start = new Date(startedAt).getTime();
    const end = new Date(completedAt).getTime();
    const seconds = Math.floor((end - start) / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div>
              <h2 className="text-xl font-bold">Sync Logs</h2>
              <p className="text-purple-100 text-sm">View synchronization history</p>
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

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-600">No sync logs found</p>
              <p className="text-sm text-gray-500 mt-1">Run your first sync to see logs here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className={`border-2 rounded-xl p-4 transition-all hover:shadow-md ${
                    log.status === 'success'
                      ? 'border-green-200 bg-green-50'
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        log.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                      }`}>
                        {log.status === 'success' ? (
                          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <h3 className={`font-semibold ${
                          log.status === 'success' ? 'text-green-900' : 'text-red-900'
                        }`}>
                          {log.sync_type === 'manual' ? 'Manual Sync' : 'Automated Sync (Cron)'}
                        </h3>
                        <p className={`text-sm ${
                          log.status === 'success' ? 'text-green-700' : 'text-red-700'
                        }`}>
                          {formatDate(log.started_at)}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        log.status === 'success'
                          ? 'bg-green-200 text-green-800'
                          : 'bg-red-200 text-red-800'
                      }`}>
                        {log.status === 'success' ? '✓ Success' : '✗ Failed'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div className={`bg-white rounded-lg p-3 border ${
                      log.status === 'success' ? 'border-green-200' : 'border-red-200'
                    }`}>
                      <p className="text-xs text-gray-600 mb-1">Projects Synced</p>
                      <p className={`text-2xl font-bold ${
                        log.status === 'success' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {log.projects_synced}
                      </p>
                    </div>

                    <div className={`bg-white rounded-lg p-3 border ${
                      log.status === 'success' ? 'border-green-200' : 'border-red-200'
                    }`}>
                      <p className="text-xs text-gray-600 mb-1">Duration</p>
                      <p className={`text-2xl font-bold ${
                        log.status === 'success' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {getDuration(log.started_at, log.completed_at)}
                      </p>
                    </div>
                  </div>

                  {log.errors && Object.keys(log.errors).length > 0 && (
                    <div className="bg-white rounded-lg p-3 border border-red-300">
                      <h4 className="font-medium text-red-900 mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Errors
                      </h4>
                      <div className="space-y-1">
                        {Object.entries(log.errors).map(([platform, error]) => (
                          <p key={platform} className="text-sm text-red-700">
                            <span className="font-medium">{platform}:</span> {String(error)}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t">
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="flex items-center gap-2 text-primary hover:text-blue-700 font-medium transition-colors disabled:opacity-50"
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Close
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
