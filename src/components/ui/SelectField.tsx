import { Tooltip } from './Tooltip';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  tooltip?: string;
  error?: string;
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  tooltip,
  error,
}: SelectFieldProps) {
  return (
    <div className="space-y-1">
      <label className="flex items-center text-sm font-medium text-gray-700">
        {label}
        {tooltip && <Tooltip content={tooltip} />}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-lg border px-3 py-2.5 text-sm transition-colors appearance-none bg-white
          ${error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
            : 'border-gray-300 focus:border-geneina-500 focus:ring-geneina-200'
          }
          focus:outline-none focus:ring-2
        `}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
