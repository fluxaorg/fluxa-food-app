'use client';

import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function Input({ label, error, className = '', id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={[
          'w-full px-4 py-3 rounded-xl border border-[#E5E0D8] bg-white text-[#333]',
          'text-base outline-none transition-colors duration-150',
          'focus:border-fluxa-red placeholder:text-gray-400',
          'disabled:bg-gray-50 disabled:text-gray-400',
          error ? 'border-red-400 focus:border-red-500' : '',
          className,
        ].join(' ')}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

export function Textarea({ label, error, className = '', id, ...props }: TextareaProps) {
  const inputId = id || label?.toLowerCase().replace(/\s/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={[
          'w-full px-4 py-3 rounded-xl border border-[#E5E0D8] bg-white text-[#333] resize-none',
          'text-base outline-none transition-colors duration-150',
          'focus:border-fluxa-red placeholder:text-gray-400',
          error ? 'border-red-400' : '',
          className,
        ].join(' ')}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
};

export function Select({ label, error, options, className = '', id, ...props }: SelectProps) {
  const inputId = id || label?.toLowerCase().replace(/\s/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          {label}
        </label>
      )}
      <select
        id={inputId}
        className={[
          'w-full px-4 py-3 rounded-xl border border-[#E5E0D8] bg-white text-[#333]',
          'text-base outline-none transition-colors duration-150 cursor-pointer',
          'focus:border-fluxa-red',
          error ? 'border-red-400' : '',
          className,
        ].join(' ')}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
