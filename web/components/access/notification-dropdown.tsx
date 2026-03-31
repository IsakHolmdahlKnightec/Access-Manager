"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from "@/lib/api"
import type { Notification } from "@/lib/api/types"

export interface NotificationDropdownProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

export function NotificationDropdown({
  isOpen,
  onClose,
  className,
}: NotificationDropdownProps) {
  const { data, isLoading } = useNotifications()
  const markRead = useMarkNotificationRead()
  const markAllRead = useMarkAllNotificationsRead()
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  const notifications = data?.notifications ?? []

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await markRead.mutateAsync(notification.id)
    }
    // Could navigate to the related request here
    onClose()
  }

  const handleMarkAllRead = async () => {
    await markAllRead.mutateAsync()
  }

  if (!isOpen) return null

  return (
    <div
      ref={dropdownRef}
      className={cn(
        "absolute right-0 top-full z-50 mt-2 w-80 rounded-xl bg-surface-container shadow-elevated",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-outline-variant px-4 py-3">
        <h3 className="text-title-sm font-semibold text-foreground">Notifications</h3>
        {notifications.some((n) => !n.isRead) && (
          <button
            onClick={handleMarkAllRead}
            className="text-xs text-primary hover:text-primary/80"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <svg
              className="h-12 w-12 text-muted-foreground"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <p className="mt-3 text-sm text-muted-foreground">No notifications yet</p>
          </div>
        ) : (
          <ul className="divide-y divide-outline-variant">
            {notifications.map((notification) => (
              <li key={notification.id}>
                <button
                  onClick={() => handleNotificationClick(notification)}
                  className={cn(
                    "w-full px-4 py-3 text-left transition-colors hover:bg-surface-container-low",
                    !notification.isRead && "bg-primary/5"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "text-sm truncate",
                        !notification.isRead ? "font-medium text-foreground" : "text-muted-foreground"
                      )}>
                        {notification.title}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatRelativeTime(notification.createdAt)}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <span className="h-2 w-2 flex-shrink-0 rounded-full bg-primary mt-1.5" />
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {notifications.length > 0 && (
        <div className="border-t border-outline-variant px-4 py-3">
          <a
            href="/notifications"
            className="block text-center text-sm text-primary hover:text-primary/80"
          >
            View all notifications
          </a>
        </div>
      )}
    </div>
  )
}

// Helper function to format relative time
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return "Just now"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`

  return date.toLocaleDateString()
}
