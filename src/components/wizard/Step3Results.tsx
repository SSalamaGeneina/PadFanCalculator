import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TemperatureGradient } from '../results/TemperatureGradient';
import { CropSuitability } from '../results/CropSuitability';
import { SystemSizing } from '../results/SystemSizing';
import { EmailGate } from './EmailGate';
import { Button } from '../ui/Button';
import { useUrlState } from '../../hooks/useUrlState';
import { generatePDF } from '../../utils/pdf';
import type { CalculatorInputs, CalculatorOutputs } from '../../engine/types';
import { Download, Link2, RotateCcw, MessageSquare, Thermometer, Gauge } from 'lucide-react';

interface Step3Props {
  inputs: CalculatorInputs;
  results: CalculatorOutputs;
  emailCaptured: boolean;
  onCaptureEmail: (name: string, email: string, company?: string) => void;
  onSkipEmail: () => void;
  onReset: () => void;
}

export function Step3Results({
  inputs,
  results,
  emailCaptured,
  onCaptureEmail,
  onSkipEmail,
  onReset,
}: Step3Props) {
  const { t } = useTranslation();
  const { copyShareableUrl } = useUrlState();
  const [linkCopied, setLinkCopied] = useState(false);

  const cropName = inputs.crop.cropType === 'custom'
    ? 'Custom'
    : t(`step2.cropOptions.${inputs.crop.cropType}`);

  const handleCopyLink = async () => {
    await copyShareableUrl(inputs);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 3000);
  };

  const handleDownloadPDF = () => {
    generatePDF(inputs, results, t);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{t('results.title')}</h2>
      </div>

      {/* Temperature Preview — always shown */}
      <div className="bg-gradient-to-br from-geneina-50 to-blue-50 rounded-2xl border border-geneina-200 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Thermometer className="w-5 h-5 text-geneina-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            {t('results.preview.title')}
          </h3>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold text-geneina-700">
            {results.indoorTempCoolEnd.toFixed(1)}°C
          </span>
          <span className="text-sm text-gray-500">{t('results.preview.coolEnd')}</span>
        </div>
      </div>

      {!emailCaptured ? (
        <>
          <p className="text-center text-gray-500 text-sm">
            {t('results.preview.unlockFull')}
          </p>
          <EmailGate onSubmit={onCaptureEmail} onSkip={onSkipEmail} />
        </>
      ) : (
        <>
          {/* Full Results */}
          <div id="results-content" className="space-y-8">
            {/* Temperature Details */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
              <div className="flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-geneina-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  {t('results.temperature.title')}
                </h3>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">{t('results.temperature.coolEnd')}</p>
                  <p className="text-3xl font-bold text-blue-700">{results.indoorTempCoolEnd.toFixed(1)}°</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">{t('results.temperature.midPoint')}</p>
                  <p className="text-3xl font-bold text-amber-700">{results.indoorTempMidPoint.toFixed(1)}°</p>
                </div>
                <div className="bg-red-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">{t('results.temperature.hotEnd')}</p>
                  <p className="text-3xl font-bold text-red-700">{results.indoorTempHotEnd.toFixed(1)}°</p>
                </div>
              </div>

              <TemperatureGradient
                coolEnd={results.indoorTempCoolEnd}
                midPoint={results.indoorTempMidPoint}
                hotEnd={results.indoorTempHotEnd}
              />

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="text-center">
                  <p className="text-xs text-gray-500">{t('results.temperature.wetBulb')}</p>
                  <p className="text-lg font-semibold">{results.wetBulbTemp.toFixed(1)}°C</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">{t('results.temperature.wetBulbDepression')}</p>
                  <p className="text-lg font-semibold">{results.wetBulbDepression.toFixed(1)}°C</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">{t('results.temperature.tempDrop')}</p>
                  <p className="text-lg font-semibold">{results.temperatureDrop.toFixed(1)}°C</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">{t('results.temperature.padEfficiency')}</p>
                  <p className="text-lg font-semibold">{(results.padEfficiency * 100).toFixed(0)}%</p>
                </div>
              </div>
            </div>

            {/* Crop Suitability */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <CropSuitability
                suitability={results.cropSuitability}
                cropName={cropName}
                optimalMin={results.cropOptimalMin}
                optimalMax={results.cropOptimalMax}
                stressThreshold={results.cropStressThreshold}
                midPointTemp={results.indoorTempMidPoint}
              />
            </div>

            {/* System Sizing */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Gauge className="w-5 h-5 text-geneina-600" />
              </div>
              <SystemSizing results={results} />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Button variant="primary" onClick={handleDownloadPDF}>
              <Download className="w-4 h-4" />
              {t('results.actions.downloadPDF')}
            </Button>
            <Button variant="outline" onClick={handleCopyLink}>
              <Link2 className="w-4 h-4" />
              {linkCopied ? t('results.actions.linkCopied') : t('results.actions.shareLink')}
            </Button>
            <Button variant="ghost" onClick={onReset}>
              <RotateCcw className="w-4 h-4" />
              {t('results.actions.startOver')}
            </Button>
          </div>

          {/* CTA */}
          <div className="bg-geneina-600 rounded-2xl p-6 text-center text-white space-y-3">
            <h3 className="text-xl font-bold">{t('results.actions.cta')}</h3>
            <p className="text-geneina-100 text-sm">{t('results.actions.ctaDescription')}</p>
            <a
              href="https://geneina.com/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-geneina-700 font-semibold px-6 py-3 rounded-lg hover:bg-geneina-50 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              {t('results.actions.cta')}
            </a>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-gray-500 text-center leading-relaxed max-w-2xl mx-auto">
            {t('results.disclaimer')}
          </p>
        </>
      )}
    </div>
  );
}
