import { useTranslation } from 'react-i18next';
import { InputField } from '../ui/InputField';
import { SelectField } from '../ui/SelectField';
import { Button } from '../ui/Button';
import type { GreenhouseInputs } from '../../engine/types';
import type { ValidationError } from '../../utils/validation';
import { ArrowRight } from 'lucide-react';

interface Step1Props {
  values: GreenhouseInputs;
  errors: ValidationError[];
  onUpdate: (updates: Partial<GreenhouseInputs>) => void;
  onNext: () => void;
}

export function Step1Greenhouse({ values, errors, onUpdate, onNext }: Step1Props) {
  const { t } = useTranslation();

  const getError = (field: string) => {
    const err = errors.find((e) => e.field === field);
    return err ? t(err.messageKey) : undefined;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{t('step1.title')}</h2>
        <p className="text-gray-600 mt-1">{t('step1.description')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2">
          <SelectField
            label={t('step1.greenhouseType')}
            value={values.greenhouseType}
            onChange={(v) => onUpdate({ greenhouseType: v as GreenhouseInputs['greenhouseType'] })}
            options={[
              { value: 'single-span', label: t('step1.greenhouseTypeOptions.single-span') },
              { value: 'multi-span', label: t('step1.greenhouseTypeOptions.multi-span') },
              { value: 'tunnel-polytunnel', label: t('step1.greenhouseTypeOptions.tunnel-polytunnel') },
            ]}
          />
        </div>

        <InputField
          label={t('step1.width')}
          value={values.width}
          onChange={(v) => onUpdate({ width: v as number })}
          unit={t('step1.widthUnit')}
          tooltip={t('step1.widthTooltip')}
          error={getError('width')}
          min={1}
          step={0.5}
        />
        <InputField
          label={t('step1.length')}
          value={values.length}
          onChange={(v) => onUpdate({ length: v as number })}
          unit={t('step1.lengthUnit')}
          tooltip={t('step1.lengthTooltip')}
          error={getError('length')}
          min={1}
          step={0.5}
        />
        <InputField
          label={t('step1.ridgeHeight')}
          value={values.ridgeHeight}
          onChange={(v) => onUpdate({ ridgeHeight: v as number })}
          unit={t('step1.ridgeHeightUnit')}
          tooltip={t('step1.ridgeHeightTooltip')}
          error={getError('ridgeHeight')}
          min={1}
          step={0.1}
        />
        <InputField
          label={t('step1.eaveHeight')}
          value={values.eaveHeight}
          onChange={(v) => onUpdate({ eaveHeight: v as number })}
          unit={t('step1.eaveHeightUnit')}
          tooltip={t('step1.eaveHeightTooltip')}
          error={getError('eaveHeight')}
          min={1}
          step={0.1}
        />
        <InputField
          label={t('step1.canopyHeight')}
          value={values.canopyHeight}
          onChange={(v) => onUpdate({ canopyHeight: v as number })}
          unit={t('step1.canopyHeightUnit')}
          tooltip={t('step1.canopyHeightTooltip')}
          error={getError('canopyHeight')}
          min={0}
          step={0.1}
        />

        <div className="sm:col-span-2">
          <SelectField
            label={t('step1.padWall')}
            value={values.padWall}
            onChange={(v) => onUpdate({ padWall: v as GreenhouseInputs['padWall'] })}
            options={[
              { value: 'width', label: t('step1.padWallOptions.width') },
              { value: 'length', label: t('step1.padWallOptions.length') },
            ]}
            tooltip={t('step1.padWallTooltip')}
          />
        </div>

        <InputField
          label={t('step1.padHeight')}
          value={values.padHeight}
          onChange={(v) => onUpdate({ padHeight: v as number })}
          unit={t('step1.padHeightUnit')}
          tooltip={t('step1.padHeightTooltip')}
          error={getError('padHeight')}
          min={0.5}
          step={0.1}
        />

        <SelectField
          label={t('step1.padThickness')}
          value={values.padThickness.toString()}
          onChange={(v) => onUpdate({ padThickness: Number(v) as GreenhouseInputs['padThickness'] })}
          options={[
            { value: '5', label: t('step1.padThicknessOptions.5') },
            { value: '10', label: t('step1.padThicknessOptions.10') },
            { value: '15', label: t('step1.padThicknessOptions.15') },
          ]}
          tooltip={t('step1.padThicknessTooltip')}
        />

        <SelectField
          label={t('step1.coverMaterial')}
          value={values.coverMaterial}
          onChange={(v) => onUpdate({ coverMaterial: v as GreenhouseInputs['coverMaterial'] })}
          options={[
            { value: 'single-poly', label: t('step1.coverMaterialOptions.single-poly') },
            { value: 'double-poly', label: t('step1.coverMaterialOptions.double-poly') },
            { value: 'glass', label: t('step1.coverMaterialOptions.glass') },
            { value: 'polycarbonate', label: t('step1.coverMaterialOptions.polycarbonate') },
          ]}
          tooltip={t('step1.coverMaterialTooltip')}
        />

        <SelectField
          label={t('step1.shadeScreen')}
          value={values.shadeScreen}
          onChange={(v) => onUpdate({ shadeScreen: v as GreenhouseInputs['shadeScreen'] })}
          options={[
            { value: 'none', label: t('step1.shadeScreenOptions.none') },
            { value: 'internal', label: t('step1.shadeScreenOptions.internal') },
            { value: 'external', label: t('step1.shadeScreenOptions.external') },
          ]}
          tooltip={t('step1.shadeScreenTooltip')}
        />

        {values.shadeScreen !== 'none' && (
          <InputField
            label={t('step1.shadePercent')}
            value={values.shadePercent}
            onChange={(v) => onUpdate({ shadePercent: v as number })}
            unit={t('step1.shadePercentUnit')}
            tooltip={t('step1.shadePercentTooltip')}
            error={getError('shadePercent')}
            min={0}
            max={100}
          />
        )}

        <SelectField
          label={t('step1.orientation')}
          value={values.orientation}
          onChange={(v) => onUpdate({ orientation: v as GreenhouseInputs['orientation'] })}
          options={[
            { value: 'ns', label: t('step1.orientationOptions.ns') },
            { value: 'ew', label: t('step1.orientationOptions.ew') },
          ]}
          tooltip={t('step1.orientationTooltip')}
        />

        <SelectField
          label={t('step1.ventType')}
          value={values.ventType}
          onChange={(v) => onUpdate({ ventType: v as GreenhouseInputs['ventType'] })}
          options={[
            { value: 'none', label: t('step1.ventTypeOptions.none') },
            { value: 'ridge', label: t('step1.ventTypeOptions.ridge') },
            { value: 'side', label: t('step1.ventTypeOptions.side') },
            { value: 'both', label: t('step1.ventTypeOptions.both') },
          ]}
          tooltip={t('step1.ventTypeTooltip')}
        />

        {values.ventType !== 'none' && (
          <InputField
            label={t('step1.ventArea')}
            value={values.ventArea}
            onChange={(v) => onUpdate({ ventArea: v as number })}
            unit={t('step1.ventAreaUnit')}
            tooltip={t('step1.ventAreaTooltip')}
            error={getError('ventArea')}
            min={0}
          />
        )}
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={onNext} size="lg">
          {t('nav.next')}
          <ArrowRight className="w-4 h-4 rtl-flip" />
        </Button>
      </div>
    </div>
  );
}
