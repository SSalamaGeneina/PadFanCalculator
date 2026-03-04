import { useTranslation } from 'react-i18next';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 text-gray-400 py-8 mt-16">
      <div className="max-w-4xl mx-auto px-4 text-center space-y-2">
        <p className="text-sm">{t('footer.disclaimer')}</p>
        <p className="text-xs">
          {t('footer.copyright', { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
