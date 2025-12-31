import React from 'react';

import { cn } from '@/lib/utils';

export interface DashboardGridProps {
  children: React.ReactNode;
  className?: string;
  columns?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

/**
 * Responsive grid layout for dashboard cards
 *
 * @example
 * ```tsx
 * <DashboardGrid columns={{ md: 2, lg: 3 }}>
 *   <Card>Card 1</Card>
 *   <Card>Card 2</Card>
 *   <Card>Card 3</Card>
 * </DashboardGrid>
 * ```
 */
export const DashboardGrid: React.FC<DashboardGridProps> = ({
  children,
  className,
  columns = { default: 1, md: 2, lg: 3 },
}) => {
  const gridClasses = cn(
    'grid gap-6 auto-rows-fr',
    {
      'grid-cols-1': columns.default === 1,
      'grid-cols-2': columns.default === 2,
      'grid-cols-3': columns.default === 3,
      'grid-cols-4': columns.default === 4,
    },
    columns.sm && {
      'sm:grid-cols-1': columns.sm === 1,
      'sm:grid-cols-2': columns.sm === 2,
      'sm:grid-cols-3': columns.sm === 3,
      'sm:grid-cols-4': columns.sm === 4,
    },
    columns.md && {
      'md:grid-cols-1': columns.md === 1,
      'md:grid-cols-2': columns.md === 2,
      'md:grid-cols-3': columns.md === 3,
      'md:grid-cols-4': columns.md === 4,
    },
    columns.lg && {
      'lg:grid-cols-1': columns.lg === 1,
      'lg:grid-cols-2': columns.lg === 2,
      'lg:grid-cols-3': columns.lg === 3,
      'lg:grid-cols-4': columns.lg === 4,
    },
    columns.xl && {
      'xl:grid-cols-1': columns.xl === 1,
      'xl:grid-cols-2': columns.xl === 2,
      'xl:grid-cols-3': columns.xl === 3,
      'xl:grid-cols-4': columns.xl === 4,
    },
    className
  );

  return <div className={gridClasses}>{children}</div>;
};
