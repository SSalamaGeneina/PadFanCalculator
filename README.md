# Pad & Fan Greenhouse Cooling Calculator

A free, public-facing web tool for greenhouse growers, engineers, and contractors across the MENA region to accurately estimate achievable indoor temperatures, required airflow, equipment sizing, and crop suitability for evaporative cooling systems.

**Built by [Geneina Solutions](https://geneina.com)**

## Features

- **3-step wizard**: Greenhouse Configuration → Climate & Crop → Results
- **Physics-based calculation engine**: Stull (2011) wet-bulb approximation, ASABE airflow standards
- **Weather auto-fill**: Open-Meteo integration (no API key needed) with peak summer toggle
- **Bilingual**: Full Arabic and English support with RTL layout
- **Crop suitability assessment**: Tomato, cucumber, pepper, lettuce, herbs, and custom targets
- **Temperature gradient visualization**: Color-coded cool-end to hot-end map
- **PDF report export**: Downloadable branded report with all outputs
- **Shareable URLs**: All inputs encoded in URL for easy sharing
- **SEO optimized**: FAQPage schema, meta tags, educational content
- **Email lead capture**: Soft gate before full results (localStorage-based)

## Tech Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- react-i18next (Arabic/English)
- Open-Meteo API (free, no key)
- jsPDF (client-side PDF)
- Vitest (unit testing)
- GitHub Pages (deployment)

## Development

```bash
npm install
npm run dev        # Start dev server
npm run build      # Production build
npm run test       # Run unit tests
npm run preview    # Preview production build
```

## Deployment

The project deploys automatically to GitHub Pages via GitHub Actions on push to `main`.

To configure:
1. Create a GitHub repository named `PadFanCalculator`
2. Push this codebase to `main`
3. Enable GitHub Pages in repository Settings → Pages → Source: GitHub Actions
4. The site will be live at `https://<username>.github.io/PadFanCalculator/`

## Calculation Engine

All calculations are performed client-side in a pure TypeScript module (`src/engine/`).

### Key Formulas

- **Wet Bulb Temperature**: Stull (2011) approximation, accurate within ±0.3°C
- **Pad Efficiency**: 5cm → 70%, 10cm → 85%, 15cm → 92% (interpolated for custom)
- **Required Airflow**: ASABE standard — 0.05 m³/s/m² (cool-season), 0.08 m³/s/m² (warm-season)
- **Hot End Temperature**: Solar heat gain adjusted for cover material, shade, and airflow path length

### Exported Function

```typescript
calculatePadFanSystem(inputs: CalculatorInputs): CalculatorOutputs
```

## License

Proprietary — Geneina Solutions
