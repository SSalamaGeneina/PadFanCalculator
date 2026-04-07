import { useTranslation } from 'react-i18next';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 text-gray-400 py-8 mt-16">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        {/* Cross-calculator links */}
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-3">
            {t('footer.suiteTitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a
              href="https://SSalamaGeneina.github.io/rtr-calculator/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors underline underline-offset-2"
            >
              {t('footer.rtrCalc')}
            </a>
            <a
              href="https://SSalamaGeneina.github.io/Psychro-calculator/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors underline underline-offset-2"
            >
              {t('footer.psychroCalc')}
            </a>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-4 text-center space-y-2">
          <p className="text-sm">{t('footer.disclaimer')}</p>
          <p className="text-xs">
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>
          <a
            href="https://geneina.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-xs text-gray-500 hover:text-white transition-colors"
          >
            {t('footer.poweredBy')}
          </a>
        </div>
      </div>
    </footer>
  );
}
