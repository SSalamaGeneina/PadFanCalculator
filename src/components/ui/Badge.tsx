import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import type { CropSuitability } from '../../engine/types';

interface BadgeProps {
  status: CropSuitability;
  label: string;
}

const config: Record<
  CropSuitability,
  { bg: string; text: string; icon: typeof CheckCircle }
> = {
  achievable: { bg: 'bg-green-50 border-green-200', text: 'text-green-800', icon: CheckCircle },
  marginal: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-800', icon: AlertTriangle },
  'not-achievable': { bg: 'bg-red-50 border-red-200', text: 'text-red-800', icon: XCircle },
};

export function Badge({ status, label }: BadgeProps) {
  const { bg, text, icon: Icon } = config[status];

  return (
    <div className={`flex items-start gap-3 rounded-xl border p-4 ${bg}`}>
      <Icon className={`w-6 h-6 flex-shrink-0 mt-0.5 ${text}`} />
      <p className={`text-sm font-medium leading-relaxed ${text}`}>{label}</p>
    </div>
  );
}
