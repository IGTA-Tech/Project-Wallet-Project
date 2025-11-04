import { CurrentStatus } from '@/types/project';

interface StatusBadgeProps {
  status: CurrentStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    Active: { emoji: '🟢', color: 'bg-green-100 text-green-800', label: 'Active' },
    Paused: { emoji: '⚠️', color: 'bg-yellow-100 text-yellow-800', label: 'Paused' },
    Broken: { emoji: '🔴', color: 'bg-red-100 text-red-800', label: 'Broken' },
    'Needs Update': { emoji: '🔵', color: 'bg-blue-100 text-blue-800', label: 'Needs Update' },
  };

  const badge = config[status] || config.Active;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
      <span className="mr-1">{badge.emoji}</span>
      {badge.label}
    </span>
  );
}
