import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:transform-none',
  {
    variants: {
      variant: {
        primary:
          'bg-primary-600 text-white shadow-sm hover:bg-primary-700 hover:shadow-md active:bg-primary-800 active:scale-[0.98]',
        secondary:
          'border-2 border-primary-600 text-primary-600 bg-transparent hover:bg-primary-50 hover:shadow-sm active:bg-primary-100 active:scale-[0.98]',
        ghost:
          'text-primary-600 bg-transparent hover:bg-primary-50 active:bg-primary-100 active:scale-[0.98]',
        destructive:
          'bg-error-600 text-white shadow-sm hover:bg-error-700 hover:shadow-md active:bg-error-800 active:scale-[0.98]',
        success:
          'bg-success-600 text-white shadow-sm hover:bg-success-700 hover:shadow-md active:bg-success-800 active:scale-[0.98]',
        warning:
          'bg-warning-600 text-white shadow-sm hover:bg-warning-700 hover:shadow-md active:bg-warning-800 active:scale-[0.98]',
      },
      size: {
        sm: 'px-3 py-2 text-sm min-h-[36px]',
        md: 'px-5 py-2.5 text-base min-h-[42px]',
        lg: 'px-6 py-3 text-lg min-h-[48px]',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/**
 * Button component with multiple variants and states
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md">Click me</Button>
 * <Button variant="secondary" loading>Loading...</Button>
 * <Button variant="ghost" leftIcon={<Icon />}>With Icon</Button>
 * ```
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      loading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ms-1 me-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && leftIcon && <span className="me-2">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="ms-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
