import { ChangeEvent, useEffect, useRef, useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export function SearchBar({
  onSearch,
  placeholder = 'Search by repository name...',
  debounceMs = 300,
}: SearchBarProps) {
  const [value, setValue] = useState('');
  const debounceTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    return () => window.clearTimeout(debounceTimer.current);
  }, []);

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    const nextValue = event.target.value;
    setValue(nextValue);

    window.clearTimeout(debounceTimer.current);
    debounceTimer.current = window.setTimeout(() => {
      onSearch(nextValue.trim());
    }, debounceMs);
  }

  function handleClear(): void {
    setValue('');
    window.clearTimeout(debounceTimer.current);
    onSearch('');
  }

  return (
    <div className="relative w-full">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
      >
        <path
          fillRule="evenodd"
          d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11ZM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9Z"
          clipRule="evenodd"
        />
      </svg>

      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label="Search history"
        className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-9 text-sm text-slate-900 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
      />

      {value.length > 0 ? (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-slate-400 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
            className="h-4 w-4"
          >
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        </button>
      ) : null}
    </div>
  );
}
