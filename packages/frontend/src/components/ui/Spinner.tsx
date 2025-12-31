import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const spinnerVariants = cva('animate-spin', {
  variants: {
    size: {
      sm: 'h-4 w-4',
      md: 'h-6 w-6',
      lg: 'h-8 w-8',
      xl: 'h-12 w-12',
    },
    color: {
      primary: 'text-primary-600',
      white: 'text-white',
      current: 'text-current',
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'primary',
  },
});

export interface SpinnerProps
  extends React.SVGAttributes<SVGSVGElement>,
    VariantProps<typeof spinnerVariants> {
  label?: string;
}

/**
 * Loading spinner component
 *
 * @example
 * ```tsx
 * <Spinner size="md" />
 * <Spinner size="lg" color="white" />
 * <Spinner size="sm" label="Loading..." />
 * ```
 */
export const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
  ({ className, size, color, label = 'Loading...', ...props }, ref) => {
    return (
      <>
        <svg
          ref={ref}
          className={cn(spinnerVariants({ size, color }), className)}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-label={label}
          role="status"
          {...props}
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
        <span className="sr-only">{label}</span>
      </>
    );
  }
);

Spinner.displayName = 'Spinner';

// Full page loading spinner
export const LoadingPage: React.FC<{ message?: string }> = ({
  message = 'טוען...',
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="text-center animate-fadeIn">
        <Spinner size="xl" />
        {message && <p className="mt-6 text-lg text-neutral-700 font-medium">{message}</p>}
      </div>
    </div>
  );
};

// Inline loading spinner for content areas
export const LoadingContent: React.FC<{ message?: string }> = ({
  message = 'טוען...',
}) => {
  return (
    <div className="flex items-center justify-center py-12 animate-fadeIn">
      <div className="text-center">
        <Spinner size="lg" />
        {message && <p className="mt-4 text-base text-neutral-700 font-medium">{message}</p>}
      </div>
    </div>
  );
};
