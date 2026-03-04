import {
  CROP_DATA,
  REFERENCE_FAN_AIRFLOW_M3S,
  REFERENCE_FAN_AIRFLOW,
} from './constants';
import {
  calcWetBulbTemp,
  calcWetBulbDepression,
  calcPadEfficiency,
  calcTemperatureDrop,
  calcCoolEndTemp,
  calcHotEndTemp,
  calcFloorArea,
  calcGreenhouseVolume,
  calcRequiredAirflow,
  calcPadFaceArea,
  calcPadFaceVelocity,
  calcPadVelocityStatus,
  calcFanCount,
  calcIndoorRH,
  calcTemperatureGradient,
} from './formulas';
import type { CalculatorInputs, CalculatorOutputs, CropSuitability } from './types';

export function calculatePadFanSystem(inputs: CalculatorInputs): CalculatorOutputs {
  const { greenhouse, climate, crop } = inputs;

  const wetBulbTemp = calcWetBulbTemp(climate.externalTemp, climate.externalRH);
  const wetBulbDepression = calcWetBulbDepression(climate.externalTemp, wetBulbTemp);
  const padEfficiency = calcPadEfficiency(greenhouse.padThickness);
  const temperatureDrop = calcTemperatureDrop(wetBulbDepression, padEfficiency);
  const indoorTempCoolEnd = calcCoolEndTemp(climate.externalTemp, temperatureDrop);

  const floorArea = calcFloorArea(greenhouse.width, greenhouse.length);
  const greenhouseVolume = calcGreenhouseVolume(
    greenhouse.width,
    greenhouse.length,
    greenhouse.eaveHeight,
    greenhouse.ridgeHeight,
  );

  let airflowRate: number;
  let cropOptimalMin: number;
  let cropOptimalMax: number;
  let cropStressThreshold: number;

  if (crop.cropType === 'custom') {
    airflowRate = 0.08;
    cropOptimalMin = crop.customTargetTemp ?? 25;
    cropOptimalMax = (crop.customTargetTemp ?? 25) + 3;
    cropStressThreshold = crop.customMaxTemp ?? 35;
  } else {
    const cropData = CROP_DATA[crop.cropType];
    airflowRate = cropData.airflowRate;
    cropOptimalMin = cropData.optimalMin;
    cropOptimalMax = cropData.optimalMax;
    cropStressThreshold = cropData.stressThreshold;
  }

  const requiredAirflow = calcRequiredAirflow(floorArea, airflowRate);
  const requiredAirflowPerHour = requiredAirflow * 3600;

  const padWallDimension = greenhouse.padWall === 'width'
    ? greenhouse.width
    : greenhouse.length;

  const airflowPathLength = greenhouse.padWall === 'width'
    ? greenhouse.length
    : greenhouse.width;

  const indoorTempHotEnd = calcHotEndTemp(
    indoorTempCoolEnd,
    climate.solarRadiation,
    greenhouse.coverMaterial,
    greenhouse.shadeScreen,
    greenhouse.shadePercent,
    airflowPathLength,
    padWallDimension,
    requiredAirflow,
  );

  const indoorTempMidPoint = (indoorTempCoolEnd + indoorTempHotEnd) / 2;

  const temperatureGradient = calcTemperatureGradient(indoorTempCoolEnd, indoorTempHotEnd);

  const padFaceArea = calcPadFaceArea(padWallDimension, greenhouse.padHeight);
  const padFaceVelocity = calcPadFaceVelocity(requiredAirflow, padFaceArea);
  const padVelocityStatus = calcPadVelocityStatus(padFaceVelocity);

  const estimatedFanCount = calcFanCount(requiredAirflow, REFERENCE_FAN_AIRFLOW_M3S);

  const avgIndoorTemp = (indoorTempCoolEnd + indoorTempHotEnd) / 2;
  const estimatedIndoorRH = calcIndoorRH(
    climate.externalTemp,
    climate.externalRH,
    avgIndoorTemp,
  );

  let cropSuitability: CropSuitability;
  if (indoorTempMidPoint <= cropOptimalMax) {
    cropSuitability = 'achievable';
  } else if (indoorTempMidPoint <= cropStressThreshold) {
    cropSuitability = 'marginal';
  } else {
    cropSuitability = 'not-achievable';
  }

  const airChangesPerMinute = (requiredAirflowPerHour / 60) / greenhouseVolume;

  return {
    wetBulbTemp,
    wetBulbDepression,
    padEfficiency,
    temperatureDrop,
    indoorTempCoolEnd,
    indoorTempHotEnd,
    indoorTempMidPoint,
    temperatureGradient,
    requiredAirflow,
    requiredAirflowPerHour,
    padFaceArea,
    padFaceVelocity,
    padVelocityStatus,
    estimatedFanCount,
    fanAirflowCapacity: REFERENCE_FAN_AIRFLOW,
    estimatedIndoorRH,
    floorArea,
    greenhouseVolume,
    cropSuitability,
    cropOptimalMin,
    cropOptimalMax,
    cropStressThreshold,
    airChangesPerMinute,
  };
}
