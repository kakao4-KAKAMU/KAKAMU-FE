'use client';

import { View, type ViewProps } from 'react-native-web';

import { cn } from '../lib/cn';

type SeparatorProps = ViewProps & {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
};

export function Separator({
  className,
  orientation = 'horizontal',
  ...props
}: SeparatorProps) {
  return (
    <View
      accessibilityRole="none"
      className={cn(
        'bg-border',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className,
      )}
      {...props}
    />
  );
}

