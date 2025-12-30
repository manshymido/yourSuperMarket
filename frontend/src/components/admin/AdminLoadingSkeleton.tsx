'use client';

import { Skeleton } from '@/components/ui/skeleton';

interface AdminLoadingSkeletonProps {
  count?: number;
  className?: string;
}

export function AdminLoadingSkeleton({
  count = 5,
  className,
}: AdminLoadingSkeletonProps) {
  return (
    <div className={className || 'space-y-4'}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-24 w-full" />
      ))}
    </div>
  );
}

