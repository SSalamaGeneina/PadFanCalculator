import { useCallback } from 'react';
import type { CalculatorInputs } from '../engine/types';

export function encodeInputsToUrl(inputs: CalculatorInputs): string {
  const params = new URLSearchParams();
  const g = inputs.greenhouse;
  const c = inputs.climate;
  const cr = inputs.crop;

  params.set('gt', g.greenhouseType);
  params.set('w', g.width.toString());
  params.set('l', g.length.toString());
  params.set('rh', g.ridgeHeight.toString());
  params.set('eh', g.eaveHeight.toString());
  params.set('ch', g.canopyHeight.toString());
  params.set('pw', g.padWall);
  params.set('ph', g.padHeight.toString());
  params.set('pt', g.padThickness.toString());
  params.set('cm', g.coverMaterial);
  params.set('ss', g.shadeScreen);
  params.set('sp', g.shadePercent.toString());
  params.set('or', g.orientation);
  params.set('vt', g.ventType);
  params.set('va', g.ventArea.toString());

  params.set('loc', c.locationName);
  params.set('lat', c.latitude.toString());
  params.set('lon', c.longitude.toString());
  params.set('et', c.externalTemp.toString());
  params.set('erh', c.externalRH.toString());
  params.set('sr', c.solarRadiation.toString());
  params.set('ds', c.designScenario);

  params.set('ct', cr.cropType);
  params.set('gs', cr.growthStage);
  if (cr.customTargetTemp !== undefined) params.set('ctt', cr.customTargetTemp.toString());
  if (cr.customMaxTemp !== undefined) params.set('cmt', cr.customMaxTemp.toString());

  return params.toString();
}

export function decodeUrlToInputs(search: string): Partial<CalculatorInputs> | null {
  const params = new URLSearchParams(search);

  if (!params.has('gt')) return null;

  try {
    return {
      greenhouse: {
        greenhouseType: params.get('gt') as CalculatorInputs['greenhouse']['greenhouseType'],
        width: Number(params.get('w')),
        length: Number(params.get('l')),
        ridgeHeight: Number(params.get('rh')),
        eaveHeight: Number(params.get('eh')),
        canopyHeight: Number(params.get('ch')),
        padWall: params.get('pw') as CalculatorInputs['greenhouse']['padWall'],
        padHeight: Number(params.get('ph')),
        padThickness: Number(params.get('pt')),
        coverMaterial: params.get('cm') as CalculatorInputs['greenhouse']['coverMaterial'],
        shadeScreen: params.get('ss') as CalculatorInputs['greenhouse']['shadeScreen'],
        shadePercent: Number(params.get('sp')),
        orientation: params.get('or') as CalculatorInputs['greenhouse']['orientation'],
        ventType: params.get('vt') as CalculatorInputs['greenhouse']['ventType'],
        ventArea: Number(params.get('va')),
      },
      climate: {
        locationName: params.get('loc') || '',
        latitude: Number(params.get('lat')),
        longitude: Number(params.get('lon')),
        externalTemp: Number(params.get('et')),
        externalRH: Number(params.get('erh')),
        solarRadiation: Number(params.get('sr')),
        designScenario: params.get('ds') as CalculatorInputs['climate']['designScenario'],
      },
      crop: {
        cropType: params.get('ct') as CalculatorInputs['crop']['cropType'],
        growthStage: params.get('gs') as CalculatorInputs['crop']['growthStage'],
        customTargetTemp: params.has('ctt') ? Number(params.get('ctt')) : undefined,
        customMaxTemp: params.has('cmt') ? Number(params.get('cmt')) : undefined,
      },
    };
  } catch {
    return null;
  }
}

export function useUrlState() {
  const getShareableUrl = useCallback((inputs: CalculatorInputs) => {
    const base = window.location.origin + window.location.pathname;
    const hash = window.location.hash.split('?')[0];
    return `${base}${hash}?${encodeInputsToUrl(inputs)}`;
  }, []);

  const copyShareableUrl = useCallback(async (inputs: CalculatorInputs) => {
    const url = getShareableUrl(inputs);
    await navigator.clipboard.writeText(url);
    return url;
  }, [getShareableUrl]);

  return { getShareableUrl, copyShareableUrl };
}
