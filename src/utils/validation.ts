import type { GreenhouseInputs, ClimateInputs } from '../engine/types';

export interface ValidationError {
  field: string;
  messageKey: string;
}

export function validateGreenhouseInputs(inputs: GreenhouseInputs): ValidationError[] {
  const errors: ValidationError[] = [];

  if (inputs.width <= 0) errors.push({ field: 'width', messageKey: 'validation.positiveNumber' });
  if (inputs.length <= 0) errors.push({ field: 'length', messageKey: 'validation.positiveNumber' });
  if (inputs.ridgeHeight <= 0) errors.push({ field: 'ridgeHeight', messageKey: 'validation.positiveNumber' });
  if (inputs.eaveHeight <= 0) errors.push({ field: 'eaveHeight', messageKey: 'validation.positiveNumber' });

  if (inputs.eaveHeight > inputs.ridgeHeight) {
    errors.push({ field: 'eaveHeight', messageKey: 'validation.eaveExceedsRidge' });
  }

  if (inputs.canopyHeight > inputs.eaveHeight) {
    errors.push({ field: 'canopyHeight', messageKey: 'validation.canopyExceedsEave' });
  }

  if (inputs.padHeight <= 0) {
    errors.push({ field: 'padHeight', messageKey: 'validation.positiveNumber' });
  } else if (inputs.padHeight > inputs.eaveHeight) {
    errors.push({ field: 'padHeight', messageKey: 'validation.padExceedsEave' });
  }

  if (inputs.padThickness <= 0 || inputs.padThickness > 30) {
    errors.push({ field: 'padThickness', messageKey: 'validation.padThicknessRange' });
  }

  if (inputs.shadeScreen !== 'none' && (inputs.shadePercent < 0 || inputs.shadePercent > 100)) {
    errors.push({ field: 'shadePercent', messageKey: 'validation.percentRange' });
  }

  if (inputs.ventType !== 'none' && inputs.ventArea < 0) {
    errors.push({ field: 'ventArea', messageKey: 'validation.positiveNumber' });
  }

  return errors;
}

export function validateClimateInputs(inputs: ClimateInputs): ValidationError[] {
  const errors: ValidationError[] = [];

  if (inputs.externalTemp < -10 || inputs.externalTemp > 60) {
    errors.push({ field: 'externalTemp', messageKey: 'validation.tempRange' });
  }

  if (inputs.externalRH < 1 || inputs.externalRH > 100) {
    errors.push({ field: 'externalRH', messageKey: 'validation.rhRange' });
  }

  if (inputs.solarRadiation < 0 || inputs.solarRadiation > 1400) {
    errors.push({ field: 'solarRadiation', messageKey: 'validation.solarRange' });
  }

  return errors;
}
