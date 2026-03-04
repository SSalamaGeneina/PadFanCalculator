export type GreenhouseType = 'single-span' | 'multi-span' | 'tunnel-polytunnel';
export type PadWall = 'width' | 'length';
export type PadThickness = 5 | 10 | 15;
export type CoverMaterial = 'single-poly' | 'double-poly' | 'glass' | 'polycarbonate';
export type ShadeScreen = 'none' | 'internal' | 'external';
export type Orientation = 'ns' | 'ew';
export type VentType = 'none' | 'ridge' | 'side' | 'both';
export type CropType = 'tomato' | 'cucumber' | 'pepper' | 'lettuce' | 'herbs' | 'custom';
export type GrowthStage = 'seedling' | 'vegetative' | 'flowering' | 'fruiting';
export type DesignScenario = 'peak-summer' | 'custom-date' | 'worst-case';

export interface GreenhouseInputs {
  greenhouseType: GreenhouseType;
  width: number;
  length: number;
  ridgeHeight: number;
  eaveHeight: number;
  canopyHeight: number;
  padWall: PadWall;
  padHeight: number;
  padThickness: PadThickness | number;
  coverMaterial: CoverMaterial;
  shadeScreen: ShadeScreen;
  shadePercent: number;
  orientation: Orientation;
  ventType: VentType;
  ventArea: number;
}

export interface ClimateInputs {
  locationName: string;
  latitude: number;
  longitude: number;
  externalTemp: number;
  externalRH: number;
  solarRadiation: number;
  designScenario: DesignScenario;
}

export interface CropInputs {
  cropType: CropType;
  growthStage: GrowthStage;
  customTargetTemp?: number;
  customMaxTemp?: number;
}

export interface CalculatorInputs {
  greenhouse: GreenhouseInputs;
  climate: ClimateInputs;
  crop: CropInputs;
}

export interface TemperatureGradientPoint {
  position: number;
  temperature: number;
}

export type CropSuitability = 'achievable' | 'marginal' | 'not-achievable';

export interface CalculatorOutputs {
  wetBulbTemp: number;
  wetBulbDepression: number;
  padEfficiency: number;
  temperatureDrop: number;
  indoorTempCoolEnd: number;
  indoorTempHotEnd: number;
  indoorTempMidPoint: number;
  temperatureGradient: TemperatureGradientPoint[];
  requiredAirflow: number;
  requiredAirflowPerHour: number;
  padFaceArea: number;
  padFaceVelocity: number;
  padVelocityStatus: 'low' | 'optimal' | 'high';
  estimatedFanCount: number;
  fanAirflowCapacity: number;
  estimatedIndoorRH: number;
  floorArea: number;
  greenhouseVolume: number;
  cropSuitability: CropSuitability;
  cropOptimalMin: number;
  cropOptimalMax: number;
  cropStressThreshold: number;
  airChangesPerMinute: number;
}
