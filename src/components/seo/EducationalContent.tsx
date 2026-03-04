import { useTranslation } from 'react-i18next';
import { BookOpen } from 'lucide-react';

export function EducationalContent() {
  const { t } = useTranslation();

  const sections = [
    { title: t('education.section1Title'), body: t('education.section1') },
    { title: t('education.section2Title'), body: t('education.section2') },
    { title: t('education.section3Title'), body: t('education.section3') },
    { title: t('education.section4Title'), body: t('education.section4') },
  ];

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <BookOpen className="w-6 h-6 text-geneina-600" />
        <h2 className="text-2xl font-bold text-gray-900">{t('education.title')}</h2>
      </div>

      <div className="space-y-8">
        {sections.map((section, i) => (
          <article key={i} className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">{section.title}</h3>
            <p className="text-gray-600 leading-relaxed text-sm">{section.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
