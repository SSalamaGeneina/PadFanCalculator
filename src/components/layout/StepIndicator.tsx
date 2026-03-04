import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

export function StepIndicator({ currentStep, onStepClick }: StepIndicatorProps) {
  const { t } = useTranslation();

  const steps = [
    { num: 1, label: t('steps.step1') },
    { num: 2, label: t('steps.step2') },
    { num: 3, label: t('steps.step3') },
  ];

  return (
    <div className="bg-white border-b border-gray-200 sticky top-[57px] z-30">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {steps.map((step, idx) => (
            <div key={step.num} className="flex items-center flex-1">
              <button
                onClick={() => step.num < currentStep && onStepClick(step.num)}
                disabled={step.num > currentStep}
                className={`flex items-center gap-2 transition-colors
                  ${step.num < currentStep ? 'cursor-pointer' : ''}
                  ${step.num > currentStep ? 'cursor-default' : ''}
                `}
              >
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all
                    ${step.num < currentStep
                      ? 'bg-geneina-600 text-white'
                      : step.num === currentStep
                        ? 'bg-geneina-600 text-white ring-4 ring-geneina-100'
                        : 'bg-gray-200 text-gray-500'
                    }
                  `}
                >
                  {step.num < currentStep ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    step.num
                  )}
                </span>
                <span
                  className={`text-sm font-medium hidden sm:block
                    ${step.num === currentStep ? 'text-geneina-700' : 'text-gray-500'}
                  `}
                >
                  {step.label}
                </span>
              </button>
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-3
                    ${step.num < currentStep ? 'bg-geneina-500' : 'bg-gray-200'}
                  `}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
