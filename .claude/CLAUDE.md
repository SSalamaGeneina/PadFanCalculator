# PadFanCalculator

Evaporative cooling (pad & fan) system sizing calculator for greenhouses. Part of Geneina's Greenhouse Science Suite alongside [rtr-calculator](https://github.com/SSalamaGeneina/rtr-calculator) and [Psychro-calculator](https://github.com/SSalamaGeneina/Psychro-calculator).

## Key Files

### Calculation Engine (`src/engine/`)
- `types.ts` — All type definitions (inputs, outputs, crop types, cover materials)
- `constants.ts` — Physical constants, crop data (optimal temps, stress thresholds, airflow rates), MENA defaults, pad efficiency lookup
- `formulas.ts` — Individual physics formulas: Stull wet bulb, pad efficiency, temperature drop, hot end (solar gain), airflow, fan count, indoor RH, temperature gradient
- `calculator.ts` — Orchestrator: composes all formulas into `calculatePadFanSystem(inputs) -> outputs`

### Components (`src/components/`)
- `wizard/` — 3-step wizard: Step1Greenhouse, Step2Climate, Step3Results, EmailGate
- `results/` — TemperatureGradient, CropSuitability, SystemSizing
- `layout/` — Header, Footer, StepIndicator
- `seo/` — EducationalContent (FAQ sections for search engine indexing)
- `ui/` — Button, Badge, InputField, SelectField, Tooltip

### Hooks (`src/hooks/`)
- `useWizard.ts` — Wizard state machine, validation, calculation trigger, email capture
- `useWeather.ts` — Open-Meteo API with debounce + peak summer archive
- `useUrlState.ts` — URL encode/decode for shareable links

### i18n (`src/i18n/`)
- `locales/en.json` and `locales/ar.json` — ~250 keys each, must stay in sync
- `index.ts` — i18next config with browser language detection

### Tests (`tests/engine/`)
- `formulas.test.ts` — 27 unit tests for individual formulas
- `calculator.test.ts` — 11 integration tests for full calculation pipeline

## Adding a New Crop

1. Add type to `CropType` union in `src/engine/types.ts`
2. Add crop data in `src/engine/constants.ts` under `CROP_DATA`
3. Add i18n keys in both `en.json` and `ar.json` under `step2.cropOptions`
4. Add select option in `src/components/wizard/Step2Climate.tsx`

## Adding a New Formula

1. Add function in `src/engine/formulas.ts`
2. Wire into `calculatePadFanSystem()` in `src/engine/calculator.ts`
3. Add output field to `CalculatorOutputs` in `src/engine/types.ts`
4. Add tests in `tests/engine/formulas.test.ts`
5. Display in result components

## Deployment

GitHub Actions (`.github/workflows/deploy.yml`) deploys to GitHub Pages on every push to `main`:
1. `npm ci` + `npm run build`
2. Upload `dist/` as Pages artifact
3. Deploy to GitHub Pages

`vite.config.ts` sets `base: '/PadFanCalculator/'` for correct asset paths. `public/404.html` handles SPA routing.

## Email Lead Capture

- Soft gate before full results (skippable)
- Leads stored in browser `localStorage` under key `padfan_lead` (name, email, company, timestamp)
- No server-side storage yet — leads should eventually flow to Odoo CRM via webhook or API

## Commands

```bash
npm run dev        # Vite dev server with HMR
npm run build      # Type-check + production build
npm run test       # 38 tests via Vitest
npm run lint       # ESLint
npm run preview    # Preview production build
```
