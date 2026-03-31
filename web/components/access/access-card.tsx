"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import type { AccessType } from "@/lib/api/types"

// ----------------------------------------------------------------------------
// Access Type Badge
// ----------------------------------------------------------------------------

const accessTypeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      type: {
        kubernetes: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        aws: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
        web_service: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
        database: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      },
    },
    defaultVariants: {
      type: "kubernetes",
    },
  }
)

export interface AccessTypeBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof accessTypeVariants> {
  type: AccessType
}

export function AccessTypeBadge({
  className,
  type,
  ...props
}: AccessTypeBadgeProps) {
  const labels: Record<AccessType, string> = {
    kubernetes: "Kubernetes",
    aws: "AWS",
    web_service: "Web Service",
    database: "Database",
  }

  return (
    <span className={cn(accessTypeVariants({ type }), className)} {...props}>
      {labels[type]}
    </span>
  )
}

// ----------------------------------------------------------------------------
// Access Card
// ----------------------------------------------------------------------------

export interface AccessCardProps extends React.HTMLAttributes<HTMLDivElement> {
  access: {
    id: string
    name: string
    type: AccessType
    description: string
  }
  onRequestAccess?: (accessId: string) => void
  showRequestButton?: boolean
}

export function AccessCard({
  className,
  access,
  showRequestButton = true,
  onRequestAccess,
  ...props
}: AccessCardProps) {
  const typeIcons: Record<AccessType, React.ReactNode> = {
    kubernetes: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    aws: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 01-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 01-.287-.375 6.18 6.18 0 01-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103-.296.072-.583.16-.862.272a2.287 2.287 0 01-.28.104.488.488 0 01-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 01.224-.167c.279-.144.614-.264 1.005-.36a4.84 4.84 0 011.246-.151c.95 0 1.644.216 2.091.647.439.43.662 1.085.662 1.963v2.586zm-3.24 1.214c.263 0 .534-.048.822-.144.287-.096.543-.271.758-.51a1.2 1.2 0 00.32-.726c0-.135-.024-.247-.08-.336a.898.898 0 00-.215-.224.96.96 0 00-.311-.151 2.乐赢pt老虎机93 2.293 0 00-.375-.056 2.586 2.586 0 00-.375.056c-.128.032-.24.08-.336.144a1.001 1.001 0 00-.232.224.589.589 0 00-.088.32c0 .128.024.24.08.336.055.095.144.183.256.247.111.065.25.119.414.16.166.043.35.064.56.064z" />
      </svg>
    ),
    web_service: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    database: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
  }

  const typeColors: Record<AccessType, string> = {
    kubernetes: "text-blue-600 dark:text-blue-400",
    aws: "text-orange-600 dark:text-orange-400",
    web_service: "text-purple-600 dark:text-purple-400",
    database: "text-green-600 dark:text-green-400",
  }

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-lg bg-surface-container-low p-5 shadow-sm transition-all duration-200 hover:bg-surface-container hover:shadow-md",
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between">
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-high", typeColors[access.type])}>
          {typeIcons[access.type]}
        </div>
        <AccessTypeBadge type={access.type} />
      </div>

      <div className="mt-4 flex-1">
        <h3 className="text-title-md font-semibold text-foreground">
          {access.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-body-sm text-muted-foreground">
          {access.description}
        </p>
      </div>

      {showRequestButton && onRequestAccess && (
        <div className="mt-4 pt-4">
          <button
            onClick={() => onRequestAccess(access.id)}
            className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Request Access
          </button>
        </div>
      )}
    </div>
  )
}
