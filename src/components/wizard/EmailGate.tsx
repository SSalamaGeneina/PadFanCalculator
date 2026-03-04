import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';
import { Lock, Mail } from 'lucide-react';

interface EmailGateProps {
  onSubmit: (name: string, email: string, company?: string) => void;
  onSkip: () => void;
}

export function EmailGate({ onSubmit, onSkip }: EmailGateProps) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError(t('validation.required'));
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t('validation.invalidEmail'));
      return;
    }
    onSubmit(name, email, company || undefined);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-geneina-100 rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6 text-geneina-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">{t('results.emailGate.title')}</h3>
          <p className="text-sm text-gray-600">{t('results.emailGate.description')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('results.emailGate.name')}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              placeholder={t('results.emailGate.namePlaceholder')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-geneina-500 focus:ring-2 focus:ring-geneina-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('results.emailGate.email')}
            </label>
            <div className="relative">
              <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder={t('results.emailGate.emailPlaceholder')}
                className="w-full rounded-lg border border-gray-300 ps-10 pe-3 py-2.5 text-sm focus:border-geneina-500 focus:ring-2 focus:ring-geneina-200 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('results.emailGate.company')}
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder={t('results.emailGate.companyPlaceholder')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-geneina-500 focus:ring-2 focus:ring-geneina-200 focus:outline-none"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" fullWidth size="lg">
            {t('results.emailGate.submit')}
          </Button>
        </form>

        <div className="text-center space-y-3">
          <p className="text-xs text-gray-500">{t('results.emailGate.privacy')}</p>
          <button
            type="button"
            onClick={onSkip}
            className="text-sm text-gray-500 underline hover:text-gray-700"
          >
            {t('results.emailGate.skip')}
          </button>
        </div>
      </div>
    </div>
  );
}
