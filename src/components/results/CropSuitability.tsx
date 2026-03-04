import { useTranslation } from 'react-i18next';
import { Badge } from '../ui/Badge';
import type { CropSuitability as CropSuitabilityType } from '../../engine/types';

interface CropSuitabilityProps {
  suitability: CropSuitabilityType;
  cropName: string;
  optimalMin: number;
  optimalMax: number;
  stressThreshold: number;
  midPointTemp: number;
}

export function CropSuitability({
  suitability,
  cropName,
  optimalMin,
  optimalMax,
  stressThreshold,
  midPointTemp,
}: CropSuitabilityProps) {
  const { t } = useTranslation();

  const statusMessages = {
    achievable: t('results.crop.achievable', { crop: cropName }),
    marginal: t('results.crop.marginal', { crop: cropName }),
    'not-achievable': t('results.crop.notAchievable', { crop: cropName }),
  };

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-700">{t('results.crop.title')}</h4>

      <Badge status={suitability} label={statusMessages[suitability]} />

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-green-50 rounded-lg p-3">
          <p className="text-xs text-gray-500">{t('results.crop.optimalRange')}</p>
          <p className="text-sm font-bold text-green-700">
            {optimalMin}–{optimalMax}°C
          </p>
        </div>
        <div className="bg-amber-50 rounded-lg p-3">
          <p className="text-xs text-gray-500">{t('results.crop.stressThreshold')}</p>
          <p className="text-sm font-bold text-amber-700">{stressThreshold}°C</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-3">
          <p className="text-xs text-gray-500">{t('results.crop.yourTemp')}</p>
          <p className="text-sm font-bold text-blue-700">{midPointTemp.toFixed(1)}°C</p>
        </div>
      </div>
    </div>
  );
}
