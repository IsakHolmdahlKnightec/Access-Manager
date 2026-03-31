"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({
  className,
  icon,
  title,
  description,
  action,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4 text-center",
        className
      )}
      {...props}
    >
      {icon ? (
        <div className="mb-4 text-muted-foreground">{icon}</div>
      ) : (
        <svg
          className="mb-4 h-16 w-16 text-muted-foreground"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M9 9h.01M15 15h.01M9 15l6-6" />
        </svg>
      )}

      <h3 className="text-title-md font-semibold text-foreground">{title}</h3>

      {description && (
        <p className="mt-2 max-w-sm text-body-sm text-muted-foreground">
          {description}
        </p>
      )}

      {action && (
        <Button onClick={action.onClick} className="mt-6" variant="default">
          {action.label}
        </Button>
      )}
    </div>
  )
}

// Preset empty states for common use cases
export const EmptyStatePresets = {
  noAccesses: {
    icon: (
      <svg className="h-16 w-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    title: "No accesses available",
    description: "There are no accesses available for request at the moment.",
  },

  noRequests: {
    icon: (
      <svg className="h-16 w-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14,2 14,8 20,8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10,9 9,9 8,9" />
      </svg>
    ),
    title: "No requests yet",
    description: "You haven't made any access requests. Browse the catalog to get started.",
    action: {
      label: "Browse Access Catalog",
      onClick: () => { window.location.href = "/access" },
    },
  },

  noNotifications: {
    icon: (
      <svg className="h-16 w-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
    title: "No notifications",
    description: "You're all caught up! Notifications about your requests will appear here.",
  },

  noPendingApprovals: {
    icon: (
      <svg className="h-16 w-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="9,11 12,14 22,4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
    title: "No pending approvals",
    description: "There are no access requests waiting for your approval.",
  },

  searchNoResults: {
    icon: (
      <svg className="h-16 w-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <line x1="8" y1="11" x2="14" y2="11" />
      </svg>
    ),
    title: "No results found",
    description: "Try adjusting your search or filter criteria.",
  },
}
