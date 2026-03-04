import type { CoverMaterial, CropType, PadThickness } from './types';

export const PAD_EFFICIENCY: Record<PadThickness, number> = {
  5: 0.70,
  10: 0.85,
  15: 0.92,
};

export function getPadEfficiency(thickness: number): number {
  if (thickness in PAD_EFFICIENCY) {
    return PAD_EFFICIENCY[thickness as PadThickness];
  }
  if (thickness <= 5) return 0.70;
  if (thickness <= 10) return 0.70 + ((thickness - 5) / 5) * (0.85 - 0.70);
  if (thickness <= 15) return 0.85 + ((thickness - 10) / 5) * (0.92 - 0.85);
  return 0.92;
}

export const SHGC: Record<CoverMaterial, number> = {
  'single-poly': 0.775,
  'double-poly': 0.625,
  'glass': 0.875,
  'polycarbonate': 0.575,
};

export interface CropData {
  optimalMin: number;
  optimalMax: number;
  stressThreshold: number;
  airflowRate: number;
}

export const CROP_DATA: Record<Exclude<CropType, 'custom'>, CropData> = {
  tomato: { optimalMin: 21, optimalMax: 27, stressThreshold: 32, airflowRate: 0.08 },
  cucumber: { optimalMin: 24, optimalMax: 28, stressThreshold: 35, airflowRate: 0.08 },
  pepper: { optimalMin: 22, optimalMax: 28, stressThreshold: 33, airflowRate: 0.08 },
  lettuce: { optimalMin: 16, optimalMax: 22, stressThreshold: 28, airflowRate: 0.05 },
  herbs: { optimalMin: 18, optimalMax: 24, stressThreshold: 30, airflowRate: 0.05 },
};

export const AIR_DENSITY = 1.2;       // kg/m³
export const AIR_SPECIFIC_HEAT = 1006; // J/(kg·K)

export const REFERENCE_FAN_AIRFLOW = 40000; // m³/hr per fan (typical large greenhouse fan)
export const REFERENCE_FAN_AIRFLOW_M3S = REFERENCE_FAN_AIRFLOW / 3600;

export const PAD_VELOCITY_MIN = 0.75;
export const PAD_VELOCITY_OPTIMAL_MIN = 1.0;
export const PAD_VELOCITY_OPTIMAL_MAX = 1.25;
export const PAD_VELOCITY_MAX = 1.5;

export const MENA_DEFAULTS = {
  greenhouse: {
    greenhouseType: 'single-span' as const,
    width: 9,
    length: 50,
    ridgeHeight: 5.5,
    eaveHeight: 4,
    canopyHeight: 2,
    padWall: 'width' as const,
    padHeight: 2,
    padThickness: 10 as const,
    coverMaterial: 'single-poly' as const,
    shadeScreen: 'none' as const,
    shadePercent: 0,
    orientation: 'ns' as const,
    ventType: 'none' as const,
    ventArea: 0,
  },
  climate: {
    locationName: '',
    latitude: 24.7136,
    longitude: 46.6753,
    externalTemp: 44,
    externalRH: 20,
    solarRadiation: 900,
    designScenario: 'peak-summer' as const,
  },
  crop: {
    cropType: 'tomato' as const,
    growthStage: 'flowering' as const,
  },
};
