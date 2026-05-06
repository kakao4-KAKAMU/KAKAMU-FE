import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Pressable, Text, type PressableProps } from "react-native";
import { cn } from "../lib/cn";

const buttonVariants = cva(
  "flex-row items-center justify-center rounded-2xl px-4 py-2.5",
  {
    variants: {
      variant: {
        default: "bg-primary",
        outline: "border border-border bg-transparent",
        secondary: "bg-secondary",
        ghost: "bg-transparent",
        destructive: "bg-destructive",
      },
      size: {
        default: "min-h-10",
        sm: "min-h-9 px-3 py-2",
        lg: "min-h-11 px-5 py-3",
      },
      disabled: {
        true: "opacity-50",
        false: "opacity-100",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      disabled: false,
    },
  },
);

const buttonTextVariants = cva("text-sm font-semibold", {
  variants: {
    variant: {
      default: "text-primary-foreground",
      outline: "text-foreground",
      secondary: "text-secondary-foreground",
      ghost: "text-foreground",
      destructive: "text-white",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type ButtonProps = PressableProps &
  VariantProps<typeof buttonVariants> & {
    className?: string;
    textClassName?: string;
    children?: React.ReactNode;
  };

export function Button({
  className,
  textClassName,
  variant,
  size,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      className={cn(buttonVariants({ variant, size, disabled: Boolean(disabled) }), className)}
      {...props}
    >
      {typeof children === "string" ? (
        <Text className={cn(buttonTextVariants({ variant }), textClassName)}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

export { buttonVariants };
