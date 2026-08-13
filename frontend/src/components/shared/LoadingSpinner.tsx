// ============================================================================
// LOADING SPINNER COMPONENT
// ============================================================================
// Reusable loading spinner component

import { cn } from '@/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingSpinner = ({ size = 'md', className }: LoadingSpinnerProps) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };
  
  return (
    <div className={cn('animate-spin rounded-full border-2 border-gray-300 border-t-primary-600', sizes[size], className)} />
  );
};

export default LoadingSpinner;
