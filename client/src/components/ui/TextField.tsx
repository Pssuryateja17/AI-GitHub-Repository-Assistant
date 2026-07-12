import { InputHTMLAttributes, forwardRef } from 'react';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, id, ...rest }, ref) => {
    const fieldId = id ?? rest.name;
    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={fieldId} className="text-sm font-medium text-slate-700">
          {label}
        </label>
        <input
          id={fieldId}
          ref={ref}
          className={`rounded-lg border px-3 py-2 text-sm shadow-sm outline-none transition focus:ring-2 focus:ring-brand-500 ${
            error ? 'border-red-400' : 'border-slate-300'
          }`}
          {...rest}
        />
        {error ? <p className="text-xs text-red-500">{error}</p> : null}
      </div>
    );
  },
);

TextField.displayName = 'TextField';