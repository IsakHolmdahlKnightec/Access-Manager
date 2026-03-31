"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useNotifications } from "@/lib/api"

export interface NotificationBellProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  onClick?: () => void
  className?: string
}

export function NotificationBell({
  className,
  onClick,
  ...props
}: NotificationBellProps) {
  const { data } = useNotifications()
  const unreadCount = data?.unreadCount ?? 0

  return (
    <button
      type="button"
      className={cn(
        "relative inline-flex h-10 w-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-surface-container",
        className
      )}
      onClick={onClick}
      aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
      {...props}
    >
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>

      {unreadCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-error text-xs font-medium text-on-error">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  )
}
