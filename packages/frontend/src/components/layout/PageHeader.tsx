import React from 'react';

import { cn } from '@/lib/utils';

export interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  breadcrumbs?: React.ReactNode;
  className?: string;
}

/**
 * Page header component with title, description, and optional action button
 *
 * @example
 * ```tsx
 * <PageHeader
 *   title="תלמידים"
 *   description="נהל את רשימת התלמידים שלך"
 *   action={<Button>הוסף תלמיד</Button>}
 * />
 * ```
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  action,
  breadcrumbs,
  className,
}) => {
  return (
    <div className={cn('mb-8', className)}>
      {breadcrumbs && <div className="mb-4">{breadcrumbs}</div>}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-neutral-800">{title}</h1>
          {description && <p className="mt-2 text-lg text-neutral-600">{description}</p>}
        </div>
        {action && <div className="ms-4">{action}</div>}
      </div>
    </div>
  );
};
