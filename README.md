# Pad & Fan Greenhouse Cooling Calculator

A free, physics-based web tool that sizes evaporative cooling (pad & fan) systems for greenhouses. It calculates achievable indoor temperatures, required airflow and equipment, and crop suitability -- helping greenhouse growers, engineers, and contractors in the MENA region make informed design decisions before buying equipment.

**[Live Demo](https://SSalamaGeneina.github.io/PadFanCalculator/)**

---

## Why This Exists

Evaporative pad & fan cooling is the dominant active cooling method for greenhouses in hot, arid climates. Yet most growers and contractors in the Middle East and North Africa still size systems by rules of thumb or vendor recommendations, leading to undersized systems that fail during peak summer. This calculator provides transparent, standards-based engineering estimates so users can validate designs, compare options, and understand the physics before committing capital.

## What It Calculates

Given greenhouse dimensions, climate conditions, cover material, shade, and crop type, the calculator produces:

- **Indoor temperature profile** -- cool end (pad side), mid-point, and hot end (fan side)
- **Wet bulb analysis** -- wet bulb temperature, depression, and pad cooling efficiency
- **Required airflow** -- in m3/s and m3/hr, based on ASABE standards
- **Equipment sizing** -- pad face area, pad face velocity (with status warnings), estimated fan count
- **Crop suitability** -- achievable / marginal / not-achievable rating against crop-specific thresholds
- **Temperature gradient** -- visual map of temperature rise along the airflow path
- **Indoor humidity estimate** -- psychrometric approximation of post-pad RH
- **PDF report** -- branded, downloadable engineering report with all results
- **Shareable URL** -- all inputs encoded in the URL for easy sharing

## The Science

### Wet Bulb Temperature (Stull 2011)

The evaporative cooling limit is determined by wet bulb temperature. The calculator uses the Stull (2011) empirical approximation:

```
T_wb = T * atan(0.151977 * sqrt(RH + 8.313659))
     + atan(T + RH) - atan(RH - 1.676331)
     + 0.00391838 * RH^1.5 * atan(0.023101 * RH)
     - 4.686035
```

This is accurate within +/-0.3 degrees C for typical conditions (RH 5-99%, T 0-50 degrees C). Reference: Stull, R. (2011). "Wet-Bulb Temperature from Relative Humidity and Air Temperature." *Journal of Applied Meteorology and Climatology*, 50(11), 2267-2269.

### Pad Cooling Efficiency

Cellulose pad efficiency varies by thickness:

| Thickness | Efficiency | Use Case |
|-----------|-----------|----------|
| 5 cm | 70% | Light duty, mild climates |
| 10 cm | 85% | Standard MENA greenhouse |
| 15 cm | 92% | High performance, extreme heat (>45 degrees C) |

Intermediate thicknesses are linearly interpolated. Temperature drop = wet bulb depression x pad efficiency.

### Required Airflow (ASABE Standard)

Airflow rates follow ASABE (American Society of Agricultural and Biological Engineers) recommendations:

- **Warm-season crops** (tomato, cucumber, pepper): 0.08 m3/s per m2 of floor area
- **Cool-season crops** (lettuce, herbs): 0.05 m3/s per m2 of floor area

### Hot End Temperature (Solar Heat Gain)

Air temperature rises along the greenhouse as it absorbs solar radiation:

```
T_hot = T_cool + (Solar * SHGC * shade_factor * L * W) / (Q * rho * Cp)
```

Where:
- `Solar` = incoming solar radiation (W/m2)
- `SHGC` = solar heat gain coefficient of cover material (single-poly 0.775, double-poly 0.625, glass 0.875, polycarbonate 0.575)
- `shade_factor` = 1 - (shade_percent / 100) when shade screen is present
- `L, W` = greenhouse length and width (m)
- `Q` = airflow (m3/s)
- `rho` = air density (1.2 kg/m3)
- `Cp` = air specific heat (1006 J/kg/K)

### Indoor Humidity Estimate

Uses a simplified psychrometric approach based on the Tetens formula for saturation vapor pressure:

```
e_s = 0.6108 * exp(17.27 * T / (T + 237.3))
```

The indoor RH accounts for both the thermodynamic increase (cooler air at the same moisture content) and additional moisture from the pad.

### Crop Temperature Thresholds

| Crop | Optimal Range | Stress Threshold | Airflow Rate |
|------|--------------|------------------|-------------|
| Tomato | 21-27 degrees C | 32 degrees C | 0.08 m3/s/m2 |
| Cucumber | 24-28 degrees C | 35 degrees C | 0.08 m3/s/m2 |
| Pepper | 22-28 degrees C | 33 degrees C | 0.08 m3/s/m2 |
| Lettuce | 16-22 degrees C | 28 degrees C | 0.05 m3/s/m2 |
| Herbs | 18-24 degrees C | 30 degrees C | 0.05 m3/s/m2 |

### Pad Face Velocity

Optimal pad face velocity is 1.0-1.25 m/s. Below 1.0 m/s indicates oversized pads; above 1.25 m/s risks water carry-over and reduced efficiency.

## Features

- **3-step wizard** -- Greenhouse Configuration -> Climate & Crop -> Results
- **Weather auto-fill** -- Open-Meteo API integration (no API key needed) with peak summer toggle
- **Bilingual** -- Full Arabic (RTL) and English support via react-i18next
- **Email lead capture** -- Soft gate before full results (localStorage-based, skippable)
- **PDF report export** -- Client-side branded report via jsPDF
- **Shareable URLs** -- All inputs encoded in URL hash parameters
- **SEO optimized** -- FAQPage JSON-LD schema, OG tags, educational content
- **Temperature gradient visualization** -- Color-coded cool-to-hot gradient map

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Build | Vite 7 |
| Styling | Tailwind CSS v4 |
| i18n | react-i18next + i18next-browser-languagedetector |
| Weather | Open-Meteo API (geocoding + forecast + archive) |
| PDF | jsPDF (client-side) |
| Icons | Lucide React |
| SEO | react-helmet-async |
| Testing | Vitest |
| Deployment | GitHub Actions -> GitHub Pages |

## Architecture

```
src/
  engine/           # Pure TypeScript calculation engine (no React dependencies)
    types.ts        # All type definitions
    constants.ts    # Physical constants, crop data, MENA defaults
    formulas.ts     # Individual physics formulas
    calculator.ts   # Orchestrator: composes formulas into full system calculation
  components/
    layout/         # Header, Footer, StepIndicator
    wizard/         # Step1Greenhouse, Step2Climate, Step3Results, EmailGate
    results/        # TemperatureGradient, CropSuitability, SystemSizing
    seo/            # EducationalContent (FAQ sections for SEO)
    ui/             # Reusable primitives: Button, Badge, InputField, SelectField, Tooltip
  hooks/
    useWizard.ts    # Wizard state machine (steps, validation, calculation trigger)
    useWeather.ts   # Open-Meteo API integration with debounce
    useUrlState.ts  # URL encode/decode for shareable links
  services/
    weather.ts      # Open-Meteo geocoding, current weather, peak summer archive
  utils/
    pdf.ts          # jsPDF report generation
    validation.ts   # Input validation rules
  i18n/
    index.ts        # i18next configuration
    locales/
      en.json       # English translations (~250 keys)
      ar.json       # Arabic translations (~250 keys)
tests/
  engine/
    formulas.test.ts    # 27 unit tests for individual formulas
    calculator.test.ts  # 11 integration tests for the full calculation pipeline
```

## Development

### Prerequisites

- Node.js 20+
- npm

### Setup

```bash
git clone https://github.com/SSalamaGeneina/PadFanCalculator.git
cd PadFanCalculator
npm install
```

### Commands

```bash
npm run dev        # Start dev server (Vite HMR)
npm run build      # Type-check + production build
npm run test       # Run unit tests (Vitest)
npm run test:watch # Run tests in watch mode
npm run lint       # ESLint check
npm run preview    # Preview production build locally
```

### Testing

The project uses Vitest with 38 tests across two test files:

- `tests/engine/formulas.test.ts` -- 27 tests covering every individual formula (wet bulb, pad efficiency, temperature drop, airflow, velocity, fan count, humidity, gradients)
- `tests/engine/calculator.test.ts` -- 11 integration tests covering MENA defaults, Riyadh peak summer, pad thickness comparison, humidity effects, shade screens, crop suitability, custom crops, greenhouse length effects, and cover material comparisons

```bash
npm run test       # Run all tests once
npm run test:watch # Run in watch mode during development
```

## Deployment

The project deploys automatically to GitHub Pages via GitHub Actions on every push to `main`.

**Workflow:** `.github/workflows/deploy.yml`

1. Checkout code
2. Install dependencies (`npm ci`)
3. Build (`npm run build`)
4. Upload `dist/` as Pages artifact
5. Deploy to GitHub Pages

**Setup (first time):**

1. Push to a GitHub repository
2. Go to Settings -> Pages -> Source: GitHub Actions
3. The site will be live at `https://<username>.github.io/PadFanCalculator/`

The `vite.config.ts` sets `base: '/PadFanCalculator/'` for correct asset paths on GitHub Pages. A `public/404.html` handles SPA routing by redirecting to hash-based URLs.

## Internationalization (i18n)

The calculator is fully bilingual (English and Arabic) with RTL support.

### How It Works

- `src/i18n/index.ts` configures i18next with browser language detection
- Translation files: `src/i18n/locales/en.json` and `src/i18n/locales/ar.json`
- RTL/LTR direction is set dynamically on `<html>` based on the active language
- CSS uses logical properties (`start`/`end` instead of `left`/`right`) for RTL
- The gradient bar reverses direction in RTL mode

### Adding a New Language

1. Create `src/i18n/locales/<code>.json` (copy `en.json` as template)
2. Translate all ~250 keys
3. Register it in `src/i18n/index.ts`:
   ```typescript
   import newLang from './locales/<code>.json';
   // Add to resources:
   resources: {
     en: { translation: en },
     ar: { translation: ar },
     '<code>': { translation: newLang },
   },
   // Add to supportedLngs:
   supportedLngs: ['en', 'ar', '<code>'],
   ```
4. Add the language toggle option in `src/components/layout/Header.tsx`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Run tests: `npm run test`
5. Run linting: `npm run lint`
6. Commit with a descriptive message
7. Open a pull request against `main`

### Adding a New Crop

1. Add the crop type to `CropType` union in `src/engine/types.ts`
2. Add crop data (optimal range, stress threshold, airflow rate) in `src/engine/constants.ts` under `CROP_DATA`
3. Add translation keys in both `src/i18n/locales/en.json` and `src/i18n/locales/ar.json` under `step2.cropOptions`
4. Add the option to the crop select in `src/components/wizard/Step2Climate.tsx`

### Adding a New Formula

1. Add the formula function in `src/engine/formulas.ts`
2. Wire it into `calculatePadFanSystem()` in `src/engine/calculator.ts`
3. Add the output field to `CalculatorOutputs` in `src/engine/types.ts`
4. Add unit tests in `tests/engine/formulas.test.ts`
5. Display it in the results components

---

## Part of Geneina's Greenhouse Science Suite

This calculator is one of three free engineering tools for greenhouse professionals:

| Calculator | Description | Link |
|-----------|-------------|------|
| **Pad & Fan Calculator** | Evaporative cooling system sizing | [Live Demo](https://SSalamaGeneina.github.io/PadFanCalculator/) |
| **RTR Calculator** | 24-hour root temperature balance | [Live Demo](https://SSalamaGeneina.github.io/rtr-calculator/) |
| **Psychro Calculator** | Psychrometric / Mollier diagram | [Live Demo](https://SSalamaGeneina.github.io/Psychro-calculator/) |

All three share the same stack (React 19, TypeScript, Vite, Tailwind v4, react-i18next, Open-Meteo) and are deployed to GitHub Pages.

---

## License

Proprietary -- Geneina International B.V. All rights reserved.

## Powered by [Geneina International B.V.](https://geneina.org)

Geneina builds climate intelligence for protected agriculture -- sensors, software, and science tools for greenhouse growers across the Middle East and Africa.
