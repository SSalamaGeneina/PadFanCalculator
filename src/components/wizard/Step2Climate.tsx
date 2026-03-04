import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { InputField } from '../ui/InputField';
import { SelectField } from '../ui/SelectField';
import { Button } from '../ui/Button';
import { useWeather } from '../../hooks/useWeather';
import type { ClimateInputs, CropInputs } from '../../engine/types';
import type { GeocodingResult } from '../../services/weather';
import type { ValidationError } from '../../utils/validation';
import { ArrowLeft, ArrowRight, MapPin, Loader2, Sun } from 'lucide-react';

interface Step2Props {
  climateValues: ClimateInputs;
  cropValues: CropInputs;
  errors: ValidationError[];
  onUpdateClimate: (updates: Partial<ClimateInputs>) => void;
  onUpdateCrop: (updates: Partial<CropInputs>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function Step2Climate({
  climateValues,
  cropValues,
  errors,
  onUpdateClimate,
  onUpdateCrop,
  onNext,
  onPrev,
}: Step2Props) {
  const { t } = useTranslation();
  const { suggestions, loading, search, fetchWeather, clearSuggestions } = useWeather();
  const [locationQuery, setLocationQuery] = useState(climateValues.locationName);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [peakSummer, setPeakSummer] = useState(false);
  const [weatherStatus, setWeatherStatus] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const getError = (field: string) => {
    const err = errors.find((e) => e.field === field);
    return err ? t(err.messageKey) : undefined;
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocationInput = (value: string | number) => {
    const q = String(value);
    setLocationQuery(q);
    search(q);
    setShowSuggestions(true);
  };

  const handleSelectLocation = async (loc: GeocodingResult) => {
    const label = `${loc.name}, ${loc.admin1 ? loc.admin1 + ', ' : ''}${loc.country}`;
    setLocationQuery(label);
    setShowSuggestions(false);
    clearSuggestions();
    onUpdateClimate({
      locationName: label,
      latitude: loc.latitude,
      longitude: loc.longitude,
    });

    setWeatherStatus(t('step2.fetchingWeather'));
    const data = await fetchWeather(loc.latitude, loc.longitude, peakSummer);
    if (data) {
      onUpdateClimate({
        externalTemp: data.temperature,
        externalRH: data.humidity,
        solarRadiation: data.solarRadiation,
      });
      setWeatherStatus(t('step2.weatherLoaded', { location: loc.name }));
    }
  };

  const handlePeakSummerToggle = async () => {
    const newVal = !peakSummer;
    setPeakSummer(newVal);
    if (climateValues.latitude && climateValues.longitude) {
      setWeatherStatus(t('step2.fetchingWeather'));
      const data = await fetchWeather(climateValues.latitude, climateValues.longitude, newVal);
      if (data) {
        onUpdateClimate({
          externalTemp: data.temperature,
          externalRH: data.humidity,
          solarRadiation: data.solarRadiation,
        });
        setWeatherStatus(
          t('step2.weatherLoaded', { location: climateValues.locationName }),
        );
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{t('step2.title')}</h2>
        <p className="text-gray-600 mt-1">{t('step2.description')}</p>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-geneina-600" />
          {t('step2.locationSection')}
        </h3>

        <div ref={containerRef} className="relative">
          <InputField
            label={t('step2.location')}
            value={locationQuery}
            onChange={handleLocationInput}
            type="text"
            placeholder={t('step2.locationPlaceholder')}
            tooltip={t('step2.locationTooltip')}
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {suggestions.map((loc, i) => (
                <li key={i}>
                  <button
                    type="button"
                    className="w-full text-start px-4 py-2.5 hover:bg-geneina-50 text-sm transition-colors"
                    onClick={() => handleSelectLocation(loc)}
                  >
                    <span className="font-medium">{loc.name}</span>
                    <span className="text-gray-500">
                      {loc.admin1 ? `, ${loc.admin1}` : ''}, {loc.country}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {(loading || weatherStatus) && (
            <p className="mt-1 text-xs text-geneina-600 flex items-center gap-1">
              {loading && <Loader2 className="w-3 h-3 animate-spin" />}
              {weatherStatus}
            </p>
          )}
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={peakSummer}
            onChange={handlePeakSummerToggle}
            className="w-4 h-4 rounded border-gray-300 text-geneina-600 focus:ring-geneina-500"
          />
          <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
            <Sun className="w-4 h-4 text-amber-500" />
            {t('step2.peakSummer')}
          </span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <InputField
            label={t('step2.externalTemp')}
            value={climateValues.externalTemp}
            onChange={(v) => onUpdateClimate({ externalTemp: v as number })}
            unit={t('step2.externalTempUnit')}
            tooltip={t('step2.externalTempTooltip')}
            error={getError('externalTemp')}
            step={0.5}
          />
          <InputField
            label={t('step2.externalRH')}
            value={climateValues.externalRH}
            onChange={(v) => onUpdateClimate({ externalRH: v as number })}
            unit={t('step2.externalRHUnit')}
            tooltip={t('step2.externalRHTooltip')}
            error={getError('externalRH')}
            min={1}
            max={100}
          />
          <InputField
            label={t('step2.solarRadiation')}
            value={climateValues.solarRadiation}
            onChange={(v) => onUpdateClimate({ solarRadiation: v as number })}
            unit={t('step2.solarRadiationUnit')}
            tooltip={t('step2.solarRadiationTooltip')}
            error={getError('solarRadiation')}
            min={0}
            max={1400}
          />
        </div>

        <SelectField
          label={t('step2.designScenario')}
          value={climateValues.designScenario}
          onChange={(v) => onUpdateClimate({ designScenario: v as ClimateInputs['designScenario'] })}
          options={[
            { value: 'peak-summer', label: t('step2.designScenarioOptions.peak-summer') },
            { value: 'custom-date', label: t('step2.designScenarioOptions.custom-date') },
            { value: 'worst-case', label: t('step2.designScenarioOptions.worst-case') },
          ]}
          tooltip={t('step2.designScenarioTooltip')}
        />
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Sun className="w-5 h-5 text-geneina-600" />
          {t('step2.cropSection')}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <SelectField
            label={t('step2.crop')}
            value={cropValues.cropType}
            onChange={(v) => onUpdateCrop({ cropType: v as CropInputs['cropType'] })}
            options={[
              { value: 'tomato', label: t('step2.cropOptions.tomato') },
              { value: 'cucumber', label: t('step2.cropOptions.cucumber') },
              { value: 'pepper', label: t('step2.cropOptions.pepper') },
              { value: 'lettuce', label: t('step2.cropOptions.lettuce') },
              { value: 'herbs', label: t('step2.cropOptions.herbs') },
              { value: 'custom', label: t('step2.cropOptions.custom') },
            ]}
            tooltip={t('step2.cropTooltip')}
          />
          <SelectField
            label={t('step2.growthStage')}
            value={cropValues.growthStage}
            onChange={(v) => onUpdateCrop({ growthStage: v as CropInputs['growthStage'] })}
            options={[
              { value: 'seedling', label: t('step2.growthStageOptions.seedling') },
              { value: 'vegetative', label: t('step2.growthStageOptions.vegetative') },
              { value: 'flowering', label: t('step2.growthStageOptions.flowering') },
              { value: 'fruiting', label: t('step2.growthStageOptions.fruiting') },
            ]}
            tooltip={t('step2.growthStageTooltip')}
          />

          {cropValues.cropType === 'custom' && (
            <>
              <InputField
                label={t('step2.customTargetTemp')}
                value={cropValues.customTargetTemp ?? 25}
                onChange={(v) => onUpdateCrop({ customTargetTemp: v as number })}
                unit={t('step2.customTargetTempUnit')}
                min={5}
                max={45}
              />
              <InputField
                label={t('step2.customMaxTemp')}
                value={cropValues.customMaxTemp ?? 35}
                onChange={(v) => onUpdateCrop({ customMaxTemp: v as number })}
                unit={t('step2.customMaxTempUnit')}
                min={10}
                max={55}
              />
            </>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onPrev}>
          <ArrowLeft className="w-4 h-4 rtl-flip" />
          {t('nav.back')}
        </Button>
        <Button onClick={onNext} size="lg">
          {t('nav.calculate')}
          <ArrowRight className="w-4 h-4 rtl-flip" />
        </Button>
      </div>
    </div>
  );
}
