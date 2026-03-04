import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { Header } from './components/layout/Header';
import { StepIndicator } from './components/layout/StepIndicator';
import { Footer } from './components/layout/Footer';
import { Step1Greenhouse } from './components/wizard/Step1Greenhouse';
import { Step2Climate } from './components/wizard/Step2Climate';
import { Step3Results } from './components/wizard/Step3Results';
import { EducationalContent } from './components/seo/EducationalContent';
import { useWizard } from './hooks/useWizard';
import { decodeUrlToInputs } from './hooks/useUrlState';

export default function App() {
  const { t, i18n } = useTranslation();
  const wizard = useWizard();

  useEffect(() => {
    const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  useEffect(() => {
    const hash = window.location.hash;
    const queryIdx = hash.indexOf('?');
    if (queryIdx !== -1) {
      const search = hash.substring(queryIdx);
      const restored = decodeUrlToInputs(search);
      if (restored) {
        if (restored.greenhouse) wizard.updateGreenhouse(restored.greenhouse);
        if (restored.climate) wizard.updateClimate(restored.climate);
        if (restored.crop) wizard.updateCrop(restored.crop);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <HelmetProvider>
      <Helmet>
        <title>{t('app.title')} | {t('app.brand')}</title>
        <meta name="description" content={t('app.subtitle')} />
        <html lang={i18n.language} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'} />
        <link rel="alternate" hrefLang="en" href={`${window.location.origin}${window.location.pathname}#/en`} />
        <link rel="alternate" hrefLang="ar" href={`${window.location.origin}${window.location.pathname}#/ar`} />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <StepIndicator currentStep={wizard.currentStep} onStepClick={wizard.goToStep} />

        <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
            {wizard.currentStep === 1 && (
              <Step1Greenhouse
                values={wizard.inputs.greenhouse}
                errors={wizard.errors}
                onUpdate={wizard.updateGreenhouse}
                onNext={wizard.nextStep}
              />
            )}

            {wizard.currentStep === 2 && (
              <Step2Climate
                climateValues={wizard.inputs.climate}
                cropValues={wizard.inputs.crop}
                errors={wizard.errors}
                onUpdateClimate={wizard.updateClimate}
                onUpdateCrop={wizard.updateCrop}
                onNext={wizard.nextStep}
                onPrev={wizard.prevStep}
              />
            )}

            {wizard.currentStep === 3 && wizard.results && (
              <Step3Results
                inputs={wizard.inputs}
                results={wizard.results}
                emailCaptured={wizard.emailCaptured}
                onCaptureEmail={wizard.captureEmail}
                onSkipEmail={wizard.skipEmail}
                onReset={wizard.reset}
              />
            )}
          </div>
        </main>

        <EducationalContent />
        <Footer />
      </div>
    </HelmetProvider>
  );
}
