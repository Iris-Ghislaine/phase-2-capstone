'use client';

import Image from 'next/image';
import { User } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Avatar({ src, alt = 'User avatar', size = 'md', className }: AvatarProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div className={cn('relative rounded-full overflow-hidden bg-gray-200', sizes[size], className)}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-400 to-blue-900">
          <User className="text-white" size={size === 'sm' ? 16 : size === 'md' ? 20 : size === 'lg' ? 24 : 32} />
        </div>
      )}
    </div>
  );
}