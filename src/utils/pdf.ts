import jsPDF from 'jspdf';
import type { CalculatorInputs, CalculatorOutputs } from '../engine/types';
import type { TFunction } from 'i18next';

export function generatePDF(
  inputs: CalculatorInputs,
  results: CalculatorOutputs,
  t: TFunction,
) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  const addLine = (text: string, size = 10, bold = false) => {
    doc.setFontSize(size);
    if (bold) doc.setFont('helvetica', 'bold');
    else doc.setFont('helvetica', 'normal');

    const lines = doc.splitTextToSize(text, pageWidth - 40);
    doc.text(lines, 20, y);
    y += lines.length * (size * 0.5) + 4;

    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  };

  const addSpacer = (height = 6) => { y += height; };

  // Header
  doc.setFillColor(22, 163, 74);
  doc.rect(0, 0, pageWidth, 35, 'F');
  doc.setTextColor(255, 255, 255);
  addLine(t('app.title'), 16, true);
  addLine(t('app.brand'), 10);
  y = 45;
  doc.setTextColor(0, 0, 0);

  // Temperature Results
  addLine(t('results.temperature.title'), 14, true);
  addSpacer();
  addLine(`${t('results.temperature.coolEnd')}: ${results.indoorTempCoolEnd.toFixed(1)}°C`);
  addLine(`${t('results.temperature.midPoint')}: ${results.indoorTempMidPoint.toFixed(1)}°C`);
  addLine(`${t('results.temperature.hotEnd')}: ${results.indoorTempHotEnd.toFixed(1)}°C`);
  addSpacer();
  addLine(`${t('results.temperature.wetBulb')}: ${results.wetBulbTemp.toFixed(1)}°C`);
  addLine(`${t('results.temperature.wetBulbDepression')}: ${results.wetBulbDepression.toFixed(1)}°C`);
  addLine(`${t('results.temperature.tempDrop')}: ${results.temperatureDrop.toFixed(1)}°C`);
  addLine(`${t('results.temperature.padEfficiency')}: ${(results.padEfficiency * 100).toFixed(0)}%`);
  addSpacer(10);

  // Crop Suitability
  addLine(t('results.crop.title'), 14, true);
  addSpacer();
  const cropName = inputs.crop.cropType === 'custom'
    ? 'Custom'
    : t(`step2.cropOptions.${inputs.crop.cropType}`);
  const statusKey = results.cropSuitability === 'achievable' ? 'achievable'
    : results.cropSuitability === 'marginal' ? 'marginal' : 'notAchievable';
  addLine(t(`results.crop.${statusKey}`, { crop: cropName }));
  addLine(`${t('results.crop.optimalRange')}: ${results.cropOptimalMin}–${results.cropOptimalMax}°C`);
  addLine(`${t('results.crop.stressThreshold')}: ${results.cropStressThreshold}°C`);
  addSpacer(10);

  // System Sizing
  addLine(t('results.system.title'), 14, true);
  addSpacer();
  addLine(`${t('results.system.airflow')}: ${results.requiredAirflow.toFixed(1)} m³/s (${Math.round(results.requiredAirflowPerHour).toLocaleString()} m³/hr)`);
  addLine(`${t('results.system.padFaceArea')}: ${results.padFaceArea.toFixed(1)} m²`);
  addLine(`${t('results.system.padVelocity')}: ${results.padFaceVelocity.toFixed(2)} m/s`);
  addLine(`${t('results.system.fanCount')}: ${results.estimatedFanCount} (${t('results.system.fanCapacity', { capacity: Math.round(results.fanAirflowCapacity).toLocaleString() })})`);
  addLine(`${t('results.system.indoorRH')}: ${results.estimatedIndoorRH.toFixed(0)}%`);
  addLine(`${t('results.system.floorArea')}: ${results.floorArea.toFixed(0)} m²`);
  addLine(`${t('results.system.volume')}: ${Math.round(results.greenhouseVolume).toLocaleString()} m³`);
  addSpacer(10);

  // Input Summary
  addLine('Input Summary', 14, true);
  addSpacer();
  addLine(`Greenhouse: ${inputs.greenhouse.width}m × ${inputs.greenhouse.length}m, ${t(`step1.greenhouseTypeOptions.${inputs.greenhouse.greenhouseType}`)}`);
  addLine(`Cover: ${t(`step1.coverMaterialOptions.${inputs.greenhouse.coverMaterial}`)}, Pad: ${inputs.greenhouse.padThickness}cm`);
  addLine(`Location: ${inputs.climate.locationName || 'Manual input'}`);
  addLine(`Conditions: ${inputs.climate.externalTemp}°C, ${inputs.climate.externalRH}% RH, ${inputs.climate.solarRadiation} W/m²`);
  addLine(`Crop: ${cropName}`);
  addSpacer(10);

  // Disclaimer
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  const disclaimer = t('results.disclaimer');
  const disclaimerLines = doc.splitTextToSize(disclaimer, pageWidth - 40);
  doc.text(disclaimerLines, 20, y);

  doc.save('padfan-cooling-report.pdf');
}
