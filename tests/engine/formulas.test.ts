import { describe, it, expect } from 'vitest';
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
} from '../../src/engine/formulas';

describe('calcWetBulbTemp (Stull 2011)', () => {
  it('returns ~22°C for Riyadh peak summer (48°C, 10% RH)', () => {
    const wb = calcWetBulbTemp(48, 10);
    expect(wb).toBeGreaterThan(19);
    expect(wb).toBeLessThan(25);
  });

  it('returns ~27°C for Dubai conditions (42°C, 40% RH)', () => {
    const wb = calcWetBulbTemp(42, 40);
    expect(wb).toBeGreaterThan(25);
    expect(wb).toBeLessThan(32);
  });

  it('returns ~14°C for moderate conditions (20°C, 50% RH)', () => {
    const wb = calcWetBulbTemp(20, 50);
    expect(wb).toBeGreaterThan(12);
    expect(wb).toBeLessThan(16);
  });

  it('wet bulb is always less than or equal to dry bulb', () => {
    const testCases = [
      [35, 20], [45, 10], [30, 80], [50, 5], [25, 60],
    ];
    for (const [t, rh] of testCases) {
      expect(calcWetBulbTemp(t, rh)).toBeLessThanOrEqual(t);
    }
  });
});

describe('calcPadEfficiency', () => {
  it('returns 0.70 for 5cm pad', () => {
    expect(calcPadEfficiency(5)).toBeCloseTo(0.70, 2);
  });

  it('returns 0.85 for 10cm pad', () => {
    expect(calcPadEfficiency(10)).toBeCloseTo(0.85, 2);
  });

  it('returns 0.92 for 15cm pad', () => {
    expect(calcPadEfficiency(15)).toBeCloseTo(0.92, 2);
  });

  it('interpolates for 7.5cm pad', () => {
    const eff = calcPadEfficiency(7.5);
    expect(eff).toBeGreaterThan(0.70);
    expect(eff).toBeLessThan(0.85);
    expect(eff).toBeCloseTo(0.775, 2);
  });
});

describe('calcTemperatureDrop', () => {
  it('calculates correctly for known values', () => {
    expect(calcTemperatureDrop(26, 0.85)).toBeCloseTo(22.1, 1);
  });
});

describe('calcCoolEndTemp', () => {
  it('subtracts drop from dry bulb', () => {
    expect(calcCoolEndTemp(48, 22.1)).toBeCloseTo(25.9, 1);
  });
});

describe('calcHotEndTemp', () => {
  it('adds solar heat gain to cool end', () => {
    const hotEnd = calcHotEndTemp(25, 900, 'single-poly', 'none', 0, 50, 9, 36);
    expect(hotEnd).toBeGreaterThan(25);
    expect(hotEnd).toBeLessThan(40);
  });

  it('shade screen reduces heat gain', () => {
    const noShade = calcHotEndTemp(25, 900, 'single-poly', 'none', 0, 50, 9, 36);
    const withShade = calcHotEndTemp(25, 900, 'single-poly', 'external', 50, 50, 9, 36);
    expect(withShade).toBeLessThan(noShade);
  });
});

describe('calcFloorArea', () => {
  it('returns width × length', () => {
    expect(calcFloorArea(9, 50)).toBe(450);
  });
});

describe('calcGreenhouseVolume', () => {
  it('returns correct volume with average height', () => {
    expect(calcGreenhouseVolume(9, 50, 4, 5.5)).toBeCloseTo(2137.5, 0);
  });
});

describe('calcRequiredAirflow', () => {
  it('calculates warm-season airflow for 450m²', () => {
    expect(calcRequiredAirflow(450, 0.08)).toBeCloseTo(36, 0);
  });

  it('calculates cool-season airflow for 450m²', () => {
    expect(calcRequiredAirflow(450, 0.05)).toBeCloseTo(22.5, 0);
  });
});

describe('calcPadFaceArea', () => {
  it('returns width × height', () => {
    expect(calcPadFaceArea(9, 2)).toBe(18);
  });
});

describe('calcPadFaceVelocity', () => {
  it('calculates velocity correctly', () => {
    expect(calcPadFaceVelocity(36, 18)).toBeCloseTo(2.0, 1);
  });

  it('returns 0 for zero pad area', () => {
    expect(calcPadFaceVelocity(36, 0)).toBe(0);
  });
});

describe('calcPadVelocityStatus', () => {
  it('returns low for < 1.0', () => {
    expect(calcPadVelocityStatus(0.8)).toBe('low');
  });

  it('returns optimal for 1.0-1.25', () => {
    expect(calcPadVelocityStatus(1.1)).toBe('optimal');
  });

  it('returns high for > 1.25', () => {
    expect(calcPadVelocityStatus(1.5)).toBe('high');
  });
});

describe('calcFanCount', () => {
  it('rounds up to nearest fan', () => {
    const fanCapacity = 40000 / 3600;
    expect(calcFanCount(36, fanCapacity)).toBe(4);
  });
});

describe('calcIndoorRH', () => {
  it('increases relative humidity when air cools', () => {
    const rh = calcIndoorRH(48, 10, 26);
    expect(rh).toBeGreaterThan(10);
    expect(rh).toBeLessThan(96);
  });
});

describe('calcTemperatureGradient', () => {
  it('returns correct number of points', () => {
    const gradient = calcTemperatureGradient(25, 35, 10);
    expect(gradient).toHaveLength(11);
  });

  it('starts at cool end and ends at hot end', () => {
    const gradient = calcTemperatureGradient(25, 35, 10);
    expect(gradient[0].temperature).toBeCloseTo(25);
    expect(gradient[10].temperature).toBeCloseTo(35);
  });

  it('increases linearly', () => {
    const gradient = calcTemperatureGradient(20, 30, 4);
    expect(gradient[2].temperature).toBeCloseTo(25);
  });
});
