import * as React from "react";
import { Suspense, type ReactNode } from "react";
import { View } from "react-native";
import { Skeleton } from "../composed/skeleton";
import { cn } from "../lib/cn";
import { AppErrorBoundary, type UiErrorBoundaryProps } from "./AppErrorBoundary";

export function DefaultSuspenseFallback({ className }: { className?: string }) {
  return (
    <View className={cn("gap-3", className)}>
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </View>
  );
}

export type SuspenseErrorBoundaryProps = UiErrorBoundaryProps & {
  fallback?: ReactNode;
  suspenseClassName?: string;
};

export function SuspenseErrorBoundary({
  children,
  fallback,
  suspenseClassName,
  className,
  title,
  description,
  ...props
}: SuspenseErrorBoundaryProps) {
  return (
    <AppErrorBoundary className={className} title={title} description={description} {...props}>
      <Suspense fallback={fallback ?? <DefaultSuspenseFallback className={suspenseClassName} />}>
        {children}
      </Suspense>
    </AppErrorBoundary>
  );
}
