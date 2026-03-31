"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const spinnerVariants = cva("animate-spin rounded-full border-2", {
  variants: {
    size: {
      sm: "h-4 w-4",
      md: "h-6 w-6",
      lg: "h-8 w-8",
      xl: "h-12 w-12",
    },
    variant: {
      primary: "border-primary border-t-transparent",
      secondary: "border-secondary border-t-transparent",
      white: "border-white border-t-transparent",
      current: "border-current border-t-transparent",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "primary",
  },
})

export interface LoadingSpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  variant?: "primary" | "secondary" | "white" | "current"
}

export function LoadingSpinner({
  className,
  size,
  variant,
  ...props
}: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      className={cn("inline-flex items-center justify-center", className)}
      {...props}
    >
      <span className="sr-only">Loading...</span>
      <div className={cn(spinnerVariants({ size, variant }))} />
    </div>
  )
}

// ----------------------------------------------------------------------------
// Loading Skeleton Components
// ----------------------------------------------------------------------------

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-surface-container-high", className)}
      {...props}
    />
  )
}

export function SkeletonCard({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("flex flex-col rounded-lg bg-surface-container-low p-5", className)}
      {...props}
    >
      <div className="flex items-start justify-between">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="mt-4 pt-4">
        <Skeleton className="h-9 w-full rounded-lg" />
      </div>
    </div>
  )
}

export function SkeletonListItem({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("flex items-center gap-4 rounded-lg p-4", className)}
      {...props}
    >
      <Skeleton className="h-10 w-10 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
  )
}

export function SkeletonTable({ rows = 5, className, ...props }: SkeletonProps & { rows?: number }) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      <div className="flex items-center gap-4 p-4">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 border-t border-outline-variant">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      ))}
    </div>
  )
}
