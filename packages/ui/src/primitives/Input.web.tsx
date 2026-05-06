'use client';

import * as React from 'react';
import { TextInput, type TextInputProps } from 'react-native-web';

import { cn } from '../lib/cn';

type InputProps = TextInputProps & {
  className?: string;
};

export const Input = React.forwardRef<TextInput, InputProps>(function Input(
  { className, ...props },
  ref,
) {
  return (
    <TextInput
      ref={ref}
      className={cn(
        'min-h-10 w-full rounded-2xl border border-input bg-background px-3 py-2 text-foreground',
        'placeholder:text-muted-foreground focus:border-ring',
        className,
      )}
      placeholderTextColor="#7a7a7a"
      {...props}
    />
  );
});

