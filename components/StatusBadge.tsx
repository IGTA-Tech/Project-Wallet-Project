import { CurrentStatus } from '@/types/project';

interface StatusBadgeProps {
  status: CurrentStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    Active: { emoji: '🟢', color: 'bg-green-100 text-green-800 border-green-200', label: 'Active' },
    Paused: { emoji: '⚠️', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Paused' },
    Broken: { emoji: '🔴', color: 'bg-red-100 text-red-800 border-red-200', label: 'Broken' },
    'Needs Update': { emoji: '🔵', color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Needs Update' },
  };

  const badge = config[status] || config.Active;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-all duration-200 hover:scale-105 ${badge.color}`}>
      <span className="mr-1 animate-pulse-subtle">{badge.emoji}</span>
      {badge.label}
    </span>
  );
}
