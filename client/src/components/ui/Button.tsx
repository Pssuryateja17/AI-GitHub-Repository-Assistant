import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export function Button({ isLoading, children, disabled, className, ...rest }: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={`flex w-full items-center justify-center rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60 ${
        className ?? ''
      }`}
      {...rest}
    >
      {isLoading ? 'Please wait...' : children}
    </button>
  );
}