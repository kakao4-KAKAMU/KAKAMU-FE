'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { Text, View, type TextProps, type ViewProps } from 'react-native-web';

import { cn } from '../lib/cn';

const alertVariants = cva('w-full rounded-2xl border p-3', {
  variants: {
    variant: {
      default: 'border-border bg-card',
      destructive: 'border-destructive/30 bg-destructive/10',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

type AlertProps = ViewProps & VariantProps<typeof alertVariants> & { className?: string };
type AlertTextProps = TextProps & { className?: string };

export function Alert({ className, variant, ...props }: AlertProps) {
  return <View className={cn(alertVariants({ variant }), className)} {...props} />;
}

export function AlertTitle({ className, ...props }: AlertTextProps) {
  return <Text className={cn('text-sm font-semibold text-foreground', className)} {...props} />;
}

export function AlertDescription({ className, ...props }: AlertTextProps) {
  return <Text className={cn('mt-1 text-sm text-muted-foreground', className)} {...props} />;
}

