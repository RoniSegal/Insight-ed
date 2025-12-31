import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva('bg-white rounded-lg', {
  variants: {
    variant: {
      default: 'shadow',
      bordered: 'border border-neutral-200',
      elevated: 'shadow-md',
      insight: 'card-insight',
    },
    padding: {
      none: '',
      compact: 'p-4',
      default: 'p-6',
      spacious: 'p-8',
    },
  },
  defaultVariants: {
    variant: 'default',
    padding: 'default',
  },
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  as?: 'div' | 'section' | 'article';
}

/**
 * Card component with multiple variants
 *
 * @example
 * ```tsx
 * <Card>Basic card content</Card>
 * <Card variant="elevated" padding="spacious">Elevated card</Card>
 * <Card variant="insight">Highlighted insight with glow effect</Card>
 * ```
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, as: Component = 'div', children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(cardVariants({ variant, padding }), className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Card.displayName = 'Card';

// Card sub-components for common patterns
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, title, description, action, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-start justify-between mb-4', className)}
        {...props}
      >
        <div className="flex-1">
          {title && <h3 className="text-xl font-semibold text-neutral-800">{title}</h3>}
          {description && <p className="text-sm text-neutral-500 mt-1">{description}</p>}
          {children}
        </div>
        {action && <div className="ms-4">{action}</div>}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn('', className)} {...props} />;
  }
);

CardContent.displayName = 'CardContent';

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('mt-4 pt-4 border-t border-neutral-200', className)}
        {...props}
      />
    );
  }
);

CardFooter.displayName = 'CardFooter';
