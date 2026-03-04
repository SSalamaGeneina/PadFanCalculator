import { useState, useCallback } from 'react';
import type { CalculatorInputs, CalculatorOutputs } from '../engine/types';
import { MENA_DEFAULTS } from '../engine/constants';
import { calculatePadFanSystem } from '../engine/calculator';
import { validateGreenhouseInputs, validateClimateInputs } from '../utils/validation';
import type { ValidationError } from '../utils/validation';

export interface WizardState {
  currentStep: number;
  inputs: CalculatorInputs;
  results: CalculatorOutputs | null;
  errors: ValidationError[];
  emailCaptured: boolean;
}

export function useWizard() {
  const [state, setState] = useState<WizardState>({
    currentStep: 1,
    inputs: {
      greenhouse: { ...MENA_DEFAULTS.greenhouse },
      climate: { ...MENA_DEFAULTS.climate },
      crop: { ...MENA_DEFAULTS.crop },
    },
    results: null,
    errors: [],
    emailCaptured: localStorage.getItem('padfan_email_captured') === 'true',
  });

  const updateGreenhouse = useCallback(
    (updates: Partial<CalculatorInputs['greenhouse']>) => {
      setState((prev) => ({
        ...prev,
        inputs: {
          ...prev.inputs,
          greenhouse: { ...prev.inputs.greenhouse, ...updates },
        },
        errors: [],
      }));
    },
    [],
  );

  const updateClimate = useCallback(
    (updates: Partial<CalculatorInputs['climate']>) => {
      setState((prev) => ({
        ...prev,
        inputs: {
          ...prev.inputs,
          climate: { ...prev.inputs.climate, ...updates },
        },
        errors: [],
      }));
    },
    [],
  );

  const updateCrop = useCallback(
    (updates: Partial<CalculatorInputs['crop']>) => {
      setState((prev) => ({
        ...prev,
        inputs: {
          ...prev.inputs,
          crop: { ...prev.inputs.crop, ...updates },
        },
        errors: [],
      }));
    },
    [],
  );

  const goToStep = useCallback((step: number) => {
    setState((prev) => ({ ...prev, currentStep: step, errors: [] }));
  }, []);

  const nextStep = useCallback(() => {
    setState((prev) => {
      let errors: ValidationError[] = [];

      if (prev.currentStep === 1) {
        errors = validateGreenhouseInputs(prev.inputs.greenhouse);
      } else if (prev.currentStep === 2) {
        errors = validateClimateInputs(prev.inputs.climate);
      }

      if (errors.length > 0) {
        return { ...prev, errors };
      }

      const nextStepNum = Math.min(prev.currentStep + 1, 3);

      if (nextStepNum === 3) {
        const results = calculatePadFanSystem(prev.inputs);
        return { ...prev, currentStep: nextStepNum, results, errors: [] };
      }

      return { ...prev, currentStep: nextStepNum, errors: [] };
    });
  }, []);

  const prevStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 1),
      errors: [],
    }));
  }, []);

  const captureEmail = useCallback((name: string, email: string, company?: string) => {
    localStorage.setItem('padfan_email_captured', 'true');
    localStorage.setItem(
      'padfan_lead',
      JSON.stringify({ name, email, company, timestamp: new Date().toISOString() }),
    );
    setState((prev) => ({ ...prev, emailCaptured: true }));
  }, []);

  const skipEmail = useCallback(() => {
    setState((prev) => ({ ...prev, emailCaptured: true }));
  }, []);

  const reset = useCallback(() => {
    setState({
      currentStep: 1,
      inputs: {
        greenhouse: { ...MENA_DEFAULTS.greenhouse },
        climate: { ...MENA_DEFAULTS.climate },
        crop: { ...MENA_DEFAULTS.crop },
      },
      results: null,
      errors: [],
      emailCaptured: localStorage.getItem('padfan_email_captured') === 'true',
    });
  }, []);

  return {
    ...state,
    updateGreenhouse,
    updateClimate,
    updateCrop,
    goToStep,
    nextStep,
    prevStep,
    captureEmail,
    skipEmail,
    reset,
  };
}
