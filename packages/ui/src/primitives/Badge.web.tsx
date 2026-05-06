'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { Text, type TextProps } from 'react-native-web';

import { cn } from '../lib/cn';

const badgeVariants = cva('rounded-full px-2.5 py-1 text-xs font-medium', {
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground',
      secondary: 'bg-secondary text-secondary-foreground',
      destructive: 'bg-destructive/20 text-destructive',
      outline: 'border border-border text-foreground',
      ghost: 'bg-muted text-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

type BadgeProps = TextProps & VariantProps<typeof badgeVariants> & { className?: string };

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <Text className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { badgeVariants };

