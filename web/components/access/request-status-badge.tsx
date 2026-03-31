"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import type { RequestStatus } from "@/lib/api/types"

// ----------------------------------------------------------------------------
// Request Status Badge
// ----------------------------------------------------------------------------

const statusVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      status: {
        pending: "bg-warning-container text-on-warning-container dark:bg-warning/20",
        approved: "bg-success-container text-on-success-container dark:bg-success/20",
        declined: "bg-error-container text-on-error-container dark:bg-error/20",
        cancelled: "bg-muted text-muted-foreground",
        more_info: "bg-info-container text-on-info-container dark:bg-info/20",
      },
    },
    defaultVariants: {
      status: "pending",
    },
  }
)

export interface RequestStatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusVariants> {
  status: RequestStatus
  showIcon?: boolean
}

export function RequestStatusBadge({
  className,
  status,
  showIcon = true,
  ...props
}: RequestStatusBadgeProps) {
  const statusConfig: Record<RequestStatus, { label: string; icon: React.ReactNode }> = {
    pending: {
      label: "Pending",
      icon: (
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12,6 12,12 16,14" />
        </svg>
      ),
    },
    approved: {
      label: "Approved",
      icon: (
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="20,6 9,17 4,12" />
        </svg>
      ),
    },
    declined: {
      label: "Declined",
      icon: (
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      ),
    },
    cancelled: {
      label: "Cancelled",
      icon: (
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      ),
    },
    more_info: {
      label: "More Info Needed",
      icon: (
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      ),
    },
  }

  const config = statusConfig[status]

  return (
    <span className={cn(statusVariants({ status }), className)} {...props}>
      {showIcon && config.icon}
      {config.label}
    </span>
  )
}
