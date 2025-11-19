'use client';


import { cn } from '../../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-orange-100 text-orange-800',
    secondary: 'bg-blue-900 text-white',
  };

  return (
    <span className={cn('inline-flex items-center px-3 py-1 rounded-full text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  );
}