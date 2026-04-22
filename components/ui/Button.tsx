'use client';

import React from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
};

const variants: Record<Variant, string> = {
  primary: 'bg-fluxa-red hover:bg-fluxa-red-dark text-white',
  secondary: 'bg-fluxa-beige hover:bg-fluxa-beige/80 text-fluxa-brown border border-fluxa-brown/20',
  danger: 'bg-orange-500 hover:bg-orange-600 text-white',
  success: 'bg-emerald-500 hover:bg-emerald-600 text-white',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-600 border border-gray-200',
};

const sizes: Record<Size, string> = {
  sm: 'px-3 py-2 text-xs font-semibold min-h-[36px]',
  md: 'px-4 py-3 text-sm font-bold min-h-[48px]',
  lg: 'px-6 py-4 text-base font-bold min-h-[56px]',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading,
  fullWidth,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-xl transition-all duration-150 active:scale-95',
        'disabled:opacity-60 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
