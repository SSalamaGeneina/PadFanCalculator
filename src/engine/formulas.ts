import {
  AIR_DENSITY,
  AIR_SPECIFIC_HEAT,
  PAD_VELOCITY_OPTIMAL_MAX,
  PAD_VELOCITY_OPTIMAL_MIN,
  SHGC,
  getPadEfficiency,
} from './constants';
import type { CoverMaterial, ShadeScreen } from './types';

/**
 * Stull (2011) approximation for wet bulb temperature.
 * Accurate within ±0.3°C for typical MENA conditions.
 */
export function calcWetBulbTemp(tempC: number, rhPercent: number): number {
  const T = tempC;
  const RH = rhPercent;
  return (
    T * Math.atan(0.151977 * Math.sqrt(RH + 8.313659)) +
    Math.atan(T + RH) -
    Math.atan(RH - 1.676331) +
    0.00391838 * Math.pow(RH, 1.5) * Math.atan(0.023101 * RH) -
    4.686035
  );
}

export function calcWetBulbDepression(dryBulb: number, wetBulb: number): number {
  return dryBulb - wetBulb;
}

export function calcPadEfficiency(thicknessCm: number): number {
  return getPadEfficiency(thicknessCm);
}

export function calcTemperatureDrop(wetBulbDepression: number, padEfficiency: number): number {
  return wetBulbDepression * padEfficiency;
}

export function calcCoolEndTemp(dryBulb: number, tempDrop: number): number {
  return dryBulb - tempDrop;
}

/**
 * Hot end temperature accounts for solar heat gain along the airflow path.
 * Formula: T_hot = T_cool + (Solar × SHGC × shade_factor × L × W) / (Q × ρ × Cp)
 */
export function calcHotEndTemp(
  coolEndTemp: number,
  solarRadiation: number,
  coverMaterial: CoverMaterial,
  shadeScreen: ShadeScreen,
  shadePercent: number,
  length: number,
  width: number,
  airflowM3s: number,
): number {
  const shgc = SHGC[coverMaterial];
  const shadeFactor = shadeScreen === 'none' ? 1.0 : 1.0 - shadePercent / 100;
  const effectiveSolar = solarRadiation * shgc * shadeFactor;
  const heatGain = effectiveSolar * length * width;
  const airCooling = airflowM3s * AIR_DENSITY * AIR_SPECIFIC_HEAT;

  if (airCooling === 0) return coolEndTemp + 20;
  return coolEndTemp + heatGain / airCooling;
}

export function calcFloorArea(width: number, length: number): number {
  return width * length;
}

export function calcGreenhouseVolume(
  width: number,
  length: number,
  eaveHeight: number,
  ridgeHeight: number,
): number {
  const avgHeight = (eaveHeight + ridgeHeight) / 2;
  return width * length * avgHeight;
}

/**
 * Required airflow per ASABE: rate (m³/s/m²) × floor area.
 */
export function calcRequiredAirflow(floorArea: number, airflowRate: number): number {
  return airflowRate * floorArea;
}

export function calcPadFaceArea(padWidth: number, padHeight: number): number {
  return padWidth * padHeight;
}

export function calcPadFaceVelocity(airflowM3s: number, padFaceArea: number): number {
  if (padFaceArea === 0) return 0;
  return airflowM3s / padFaceArea;
}

export function calcPadVelocityStatus(velocity: number): 'low' | 'optimal' | 'high' {
  if (velocity < PAD_VELOCITY_OPTIMAL_MIN) return 'low';
  if (velocity > PAD_VELOCITY_OPTIMAL_MAX) return 'high';
  return 'optimal';
}

export function calcFanCount(airflowM3s: number, fanCapacityM3s: number): number {
  if (fanCapacityM3s === 0) return 0;
  return Math.ceil(airflowM3s / fanCapacityM3s);
}

/**
 * Estimates indoor RH based on the temperature drop through the pad.
 * As air cools through the pad, its RH increases significantly.
 * Uses a simplified psychrometric approximation.
 */
export function calcIndoorRH(
  externalTemp: number,
  externalRH: number,
  indoorTemp: number,
): number {
  const satVapPressExt = 0.6108 * Math.exp((17.27 * externalTemp) / (externalTemp + 237.3));
  const actualVapPress = (externalRH / 100) * satVapPressExt;
  const satVapPressIndoor = 0.6108 * Math.exp((17.27 * indoorTemp) / (indoorTemp + 237.3));
  const indoorRH = (actualVapPress / satVapPressIndoor) * 100;

  const padMoistureAdd = ((externalTemp - indoorTemp) / externalTemp) * 30;
  return Math.min(95, indoorRH + padMoistureAdd);
}

export function calcTemperatureGradient(
  coolEnd: number,
  hotEnd: number,
  points: number = 10,
): { position: number; temperature: number }[] {
  const gradient: { position: number; temperature: number }[] = [];
  for (let i = 0; i <= points; i++) {
    const fraction = i / points;
    gradient.push({
      position: fraction,
      temperature: coolEnd + (hotEnd - coolEnd) * fraction,
    });
  }
  return gradient;
}
