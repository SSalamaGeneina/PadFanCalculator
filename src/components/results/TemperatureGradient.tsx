import { useTranslation } from 'react-i18next';

interface TemperatureGradientProps {
  coolEnd: number;
  midPoint: number;
  hotEnd: number;
}

export function TemperatureGradient({ coolEnd, midPoint, hotEnd }: TemperatureGradientProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-700">
        {t('results.temperature.gradient')}
      </h4>

      <div className="relative">
        <div className="gradient-bar h-10 rounded-xl relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-between px-4">
            <span className="text-white text-xs font-bold drop-shadow-md">
              {coolEnd.toFixed(1)}°C
            </span>
            <span className="text-white text-xs font-bold drop-shadow-md">
              {midPoint.toFixed(1)}°C
            </span>
            <span className="text-white text-xs font-bold drop-shadow-md">
              {hotEnd.toFixed(1)}°C
            </span>
          </div>
        </div>

        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>{t('results.temperature.padSide')}</span>
          <span>{t('results.temperature.fanSide')}</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-1 mt-2">
        <svg viewBox="0 0 200 40" className="w-full max-w-sm h-10">
          <rect x="10" y="5" width="180" height="30" rx="4" fill="none" stroke="#d1d5db" strokeWidth="1" />
          <line x1="10" y1="20" x2="190" y2="20" stroke="#9ca3af" strokeWidth="0.5" strokeDasharray="4 2" />
          <rect x="5" y="5" width="8" height="30" rx="2" fill="#3b82f6" opacity="0.3" />
          <rect x="187" y="5" width="8" height="30" rx="2" fill="#ef4444" opacity="0.3" />
          <text x="9" y="3" fontSize="6" fill="#6b7280" textAnchor="middle">PAD</text>
          <text x="191" y="3" fontSize="6" fill="#6b7280" textAnchor="middle">FAN</text>
        </svg>
      </div>
    </div>
  );
}
