import { useTranslation } from 'react-i18next';
import { Wind, Fan, Droplets, Maximize, Box } from 'lucide-react';
import type { CalculatorOutputs } from '../../engine/types';

interface SystemSizingProps {
  results: CalculatorOutputs;
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  warning,
}: {
  icon: typeof Wind;
  label: string;
  value: string;
  sub?: string;
  warning?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-1">
      <div className="flex items-center gap-2 text-gray-500">
        <Icon className="w-4 h-4" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-500">{sub}</p>}
      {warning && <p className="text-xs text-amber-600 font-medium">{warning}</p>}
    </div>
  );
}

export function SystemSizing({ results }: SystemSizingProps) {
  const { t } = useTranslation();

  const velocityWarning = results.padVelocityStatus === 'low'
    ? t('results.system.padVelocityLow')
    : results.padVelocityStatus === 'high'
      ? t('results.system.padVelocityHigh')
      : undefined;

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-700">{t('results.system.title')}</h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <StatCard
          icon={Wind}
          label={t('results.system.airflow')}
          value={`${results.requiredAirflow.toFixed(1)} m³/s`}
          sub={`${Math.round(results.requiredAirflowPerHour).toLocaleString()} m³/hr ${t('results.system.airflowPerHour')}`}
        />
        <StatCard
          icon={Maximize}
          label={t('results.system.padFaceArea')}
          value={`${results.padFaceArea.toFixed(1)} m²`}
        />
        <StatCard
          icon={Wind}
          label={t('results.system.padVelocity')}
          value={`${results.padFaceVelocity.toFixed(2)} m/s`}
          sub={results.padVelocityStatus === 'optimal' ? t('results.system.padVelocityOptimal') : undefined}
          warning={velocityWarning}
        />
        <StatCard
          icon={Fan}
          label={t('results.system.fanCount')}
          value={results.estimatedFanCount.toString()}
          sub={t('results.system.fanCapacity', { capacity: Math.round(results.fanAirflowCapacity).toLocaleString() })}
        />
        <StatCard
          icon={Droplets}
          label={t('results.system.indoorRH')}
          value={`${results.estimatedIndoorRH.toFixed(0)}%`}
        />
        <StatCard
          icon={Box}
          label={t('results.system.volume')}
          value={`${Math.round(results.greenhouseVolume).toLocaleString()} m³`}
          sub={`${results.airChangesPerMinute.toFixed(1)} ${t('results.system.airChanges')}/min`}
        />
      </div>
    </div>
  );
}
