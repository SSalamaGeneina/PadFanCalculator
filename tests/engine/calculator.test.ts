import { describe, it, expect } from 'vitest';
import { calculatePadFanSystem } from '../../src/engine/calculator';
import type { CalculatorInputs } from '../../src/engine/types';
import { MENA_DEFAULTS } from '../../src/engine/constants';

function makeInputs(overrides?: Partial<{
  greenhouse: Partial<CalculatorInputs['greenhouse']>;
  climate: Partial<CalculatorInputs['climate']>;
  crop: Partial<CalculatorInputs['crop']>;
}>): CalculatorInputs {
  return {
    greenhouse: { ...MENA_DEFAULTS.greenhouse, ...overrides?.greenhouse },
    climate: { ...MENA_DEFAULTS.climate, ...overrides?.climate },
    crop: { ...MENA_DEFAULTS.crop, ...overrides?.crop },
  };
}

describe('calculatePadFanSystem', () => {
  it('produces valid results with MENA defaults', () => {
    const results = calculatePadFanSystem(makeInputs());

    expect(results.wetBulbTemp).toBeLessThan(44);
    expect(results.wetBulbDepression).toBeGreaterThan(0);
    expect(results.padEfficiency).toBeCloseTo(0.85, 2);
    expect(results.temperatureDrop).toBeGreaterThan(10);
    expect(results.indoorTempCoolEnd).toBeLessThan(44);
    expect(results.indoorTempHotEnd).toBeGreaterThan(results.indoorTempCoolEnd);
    expect(results.indoorTempMidPoint).toBeGreaterThan(results.indoorTempCoolEnd);
    expect(results.indoorTempMidPoint).toBeLessThan(results.indoorTempHotEnd);
    expect(results.requiredAirflow).toBeGreaterThan(0);
    expect(results.padFaceArea).toBeGreaterThan(0);
    expect(results.estimatedFanCount).toBeGreaterThan(0);
    expect(results.estimatedIndoorRH).toBeGreaterThan(0);
    expect(results.temperatureGradient).toHaveLength(11);
  });

  it('Riyadh peak summer: achieves meaningful cooling with 10cm pad', () => {
    const results = calculatePadFanSystem(makeInputs({
      climate: { externalTemp: 48, externalRH: 10, solarRadiation: 950 },
    }));

    expect(results.indoorTempCoolEnd).toBeLessThan(30);
    expect(results.temperatureDrop).toBeGreaterThan(20);
  });

  it('15cm pad provides better cooling than 10cm', () => {
    const base = { climate: { externalTemp: 48, externalRH: 10, solarRadiation: 900 } };
    const r10 = calculatePadFanSystem(makeInputs({
      ...base,
      greenhouse: { padThickness: 10 },
    }));
    const r15 = calculatePadFanSystem(makeInputs({
      ...base,
      greenhouse: { padThickness: 15 },
    }));

    expect(r15.indoorTempCoolEnd).toBeLessThan(r10.indoorTempCoolEnd);
    expect(r15.temperatureDrop).toBeGreaterThan(r10.temperatureDrop);
  });

  it('higher humidity reduces cooling potential', () => {
    const dry = calculatePadFanSystem(makeInputs({
      climate: { externalTemp: 40, externalRH: 10 },
    }));
    const humid = calculatePadFanSystem(makeInputs({
      climate: { externalTemp: 40, externalRH: 60 },
    }));

    expect(dry.temperatureDrop).toBeGreaterThan(humid.temperatureDrop);
  });

  it('shade screen reduces hot end temperature', () => {
    const noShade = calculatePadFanSystem(makeInputs());
    const withShade = calculatePadFanSystem(makeInputs({
      greenhouse: { shadeScreen: 'external', shadePercent: 50 },
    }));

    expect(withShade.indoorTempHotEnd).toBeLessThan(noShade.indoorTempHotEnd);
  });

  it('crop suitability is correct for lettuce in extreme heat', () => {
    const results = calculatePadFanSystem(makeInputs({
      climate: { externalTemp: 50, externalRH: 5, solarRadiation: 1000 },
      crop: { cropType: 'lettuce', growthStage: 'vegetative' },
    }));

    expect(results.cropStressThreshold).toBe(28);
    expect(['marginal', 'not-achievable']).toContain(results.cropSuitability);
  });

  it('cucumber in moderate conditions is achievable', () => {
    const results = calculatePadFanSystem(makeInputs({
      climate: { externalTemp: 38, externalRH: 15, solarRadiation: 700 },
      crop: { cropType: 'cucumber' },
    }));

    expect(results.cropOptimalMax).toBe(28);
    expect(results.cropSuitability).toBe('achievable');
  });

  it('pad velocity is flagged when too high', () => {
    const results = calculatePadFanSystem(makeInputs({
      greenhouse: { width: 9, padWall: 'width', padHeight: 1 },
    }));

    expect(results.padFaceVelocity).toBeGreaterThan(1.25);
    expect(results.padVelocityStatus).toBe('high');
  });

  it('custom crop uses user-defined thresholds', () => {
    const results = calculatePadFanSystem(makeInputs({
      crop: { cropType: 'custom', customTargetTemp: 20, customMaxTemp: 25 },
    }));

    expect(results.cropOptimalMin).toBe(20);
    expect(results.cropStressThreshold).toBe(25);
  });

  it('longer greenhouse increases hot end temperature', () => {
    const short = calculatePadFanSystem(makeInputs({
      greenhouse: { length: 30 },
    }));
    const long = calculatePadFanSystem(makeInputs({
      greenhouse: { length: 100 },
    }));

    expect(long.indoorTempHotEnd).toBeGreaterThan(short.indoorTempHotEnd);
  });

  it('polycarbonate cover reduces heat gain vs glass', () => {
    const glass = calculatePadFanSystem(makeInputs({
      greenhouse: { coverMaterial: 'glass' },
    }));
    const pc = calculatePadFanSystem(makeInputs({
      greenhouse: { coverMaterial: 'polycarbonate' },
    }));

    expect(pc.indoorTempHotEnd).toBeLessThan(glass.indoorTempHotEnd);
  });
});
