import { Tooltip } from './Tooltip';

interface InputFieldProps {
  label: string;
  value: number | string;
  onChange: (value: number | string) => void;
  type?: 'number' | 'text';
  unit?: string;
  tooltip?: string;
  error?: string;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  disabled?: boolean;
}

export function InputField({
  label,
  value,
  onChange,
  type = 'number',
  unit,
  tooltip,
  error,
  min,
  max,
  step,
  placeholder,
  disabled,
}: InputFieldProps) {
  return (
    <div className="space-y-1">
      <label className="flex items-center text-sm font-medium text-gray-700">
        {label}
        {tooltip && <Tooltip content={tooltip} />}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) =>
            onChange(type === 'number' ? Number(e.target.value) : e.target.value)
          }
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full rounded-lg border px-3 py-2.5 text-sm transition-colors
            ${error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
              : 'border-gray-300 focus:border-geneina-500 focus:ring-geneina-200'
            }
            focus:outline-none focus:ring-2
            disabled:bg-gray-100 disabled:text-gray-500
            ${unit ? 'pe-12' : ''}
          `}
        />
        {unit && (
          <span className="absolute end-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 pointer-events-none">
            {unit}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
